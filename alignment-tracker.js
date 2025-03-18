// 🌌 Primal Alignment Tracker (Moon Phases + Festivals + Hemispheres)
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Primal Alignment Script Loaded.");
  
    // 1) Hemisphere Selector
    const hemisphereSelect = document.getElementById("hemisphere");
    if (!hemisphereSelect) {
      console.error("❌ Hemisphere selector not found!");
      return;
    }
  
    // 2) Load saved hemisphere or default to northern
    const storedHemisphere = localStorage.getItem("hemisphere") || "northern";
    hemisphereSelect.value = storedHemisphere;
  
    // Function to fetch & update data
    async function fetchPrimalAlignment() {
      try {
        console.log("🔄 Fetching Primal Alignment Data...");
  
        // Temporary placeholders to avoid flicker
        const placeholders = {
          "moon-phase": "🌙 Loading...",
          "daily-gods": "🔹 Loading...",
          "lunar-god": "🌕 Loading...",
          "moon-triad": "🌑 Loading...",
          "current-season": "🌿 Loading...",
          "next-festival": "📅 Loading...",
          "festival-god": "🔥 Loading..."
        };
        Object.entries(placeholders).forEach(([id, val]) => {
          const el = document.getElementById(id);
          if (el) el.textContent = val;
        });
  
        // Current hemisphere
        const hemisphere = localStorage.getItem("hemisphere") || "northern";
        console.log(`🌍 Hemisphere: ${hemisphere}`);
  
        // Current date, day name
        const today = new Date();
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const todayName = weekdays[today.getUTCDay()];
  
        // ---------- FETCH MOON PHASE DATA ----------
        const unixTime = Math.floor(Date.now() / 1000);
        const moonResponse = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${unixTime}`);
        const moonData = await moonResponse.json();
  
        if (!moonData || moonData.length === 0 || moonData[0].Error !== 0) {
          throw new Error(moonData[0]?.ErrorMsg || "Unknown API error");
        }
  
        // ---------- MOON PHASE MAPPING ----------
        const moonPhase = moonData[0].Phase;
        const illumination = parseFloat(moonData[0].Illumination) || 0;
        const farmSenseMoonName = moonData[0].Moon[0];
  
        // Convert FarmSense moon names to simpler known names
        const moonNameMapping = {
          "Wolf Moon": "Wolf Moon", "Snow Moon": "Snow Moon", "Worm Moon": "Worm Moon",
          "Sap Moon": "Worm Moon", "Pink Moon": "Pink Moon", "Flower Moon": "Flower Moon",
          "Strawberry Moon": "Strawberry Moon", "Buck Moon": "Buck Moon", "Sturgeon Moon": "Sturgeon Moon",
          "Corn Moon": "Harvest Moon", "Harvest Moon": "Harvest Moon", "Hunter's Moon": "Hunter’s Moon",
          "Beaver Moon": "Beaver Moon", "Cold Moon": "Cold Moon", "Blue Moon": "Blue Moon"
        };
        const moonName = moonNameMapping[farmSenseMoonName] || "Unknown";
        if (moonName === "Unknown") {
          console.warn(`🚨 Unknown moon name: "${farmSenseMoonName}"`);
        }
  
        // ---------- MOON TRIAD INFLUENCE ----------
        const moonTriadInfluence =
          illumination >= 0.9 ? "Selene (Full Moon Influence)" :
          illumination >= 0.4 ? "Hecate (Waxing & Waning Influence)" :
          "Artemis (New & Crescent Influence)";
  
        // ---------- PLANETARY RULERSHIP ----------
        const planetaryGods = {
          "Monday": "Gaia, Selene",
          "Tuesday": "Ares, Hera",
          "Wednesday": "Hermes, Iris",
          "Thursday": "Zeus, Poseidon",
          "Friday": "Aphrodite",
          "Saturday": "Hades",
          "Sunday": "Apollo, Demeter"
        };
  
        // ---------- LUNAR GODS ALIGNMENT ----------
        const lunarGods = {
          "Wolf Moon": "Ares", "Snow Moon": "Hera", "Worm Moon": "Hermes",
          "Pink Moon": "Aphrodite", "Flower Moon": "Demeter", "Strawberry Moon": "Poseidon",
          "Buck Moon": "Zeus", "Sturgeon Moon": "Selene", "Harvest Moon": "Hades",
          "Hunter’s Moon": "Gaia", "Beaver Moon": "Iris", "Cold Moon": "Apollo", "Blue Moon": "The Void"
        };
  
        // ---------- FESTIVAL & SEASONAL DATA ----------
        const festivals = {
          "northern": [
            { name: "Imbolc", date: "2025-02-02", god: "Hermes", element: "Air 🌬️" },
            { name: "Spring Equinox (Ostara)", date: "2025-03-20", god: "Iris", element: "Air 🌬️" },
            { name: "Beltane", date: "2025-05-01", god: "Ares", element: "Fire 🔥" },
            { name: "Summer Solstice (Litha)", date: "2025-06-20", god: "Apollo", element: "Fire 🔥" }
          ],
          "southern": [
            { name: "Autumn Equinox (Mabon)", date: "2025-03-20", god: "Poseidon", element: "Water 🌊" },
            { name: "Samhain", date: "2025-04-30", god: "Hades", element: "Earth 🟤" },
            { name: "Winter Solstice (Yule)", date: "2025-06-21", god: "Gaia", element: "Earth 🟤" }
          ]
        };
  
        // Find next festival after today's date
        const nextFestival = festivals[hemisphere].find(f => new Date(f.date) >= today) || festivals[hemisphere][0];
        const daysToFestival = Math.ceil((new Date(nextFestival.date) - today) / (1000 * 60 * 60 * 24));
  
        // ---------- SEASONAL RULERS ----------
        const seasonRulers = {
          "Spring": "Zeus (Air 🌬️)",
          "Summer": "Hera (Fire 🔥)",
          "Autumn": "Selene (Water 🌊)",
          "Winter": "Demeter (Earth 🟤)"
        };
  
        // Helper: Determine current season by month + hemisphere
        function getCurrentSeason(date, hem) {
          const month = date.getMonth();
          if (hem === "northern") {
            if (month >= 2 && month < 5) return "Spring";
            if (month >= 5 && month < 8) return "Summer";
            if (month >= 8 && month < 11) return "Autumn";
            return "Winter";
          } else {
            // southern hemisphere
            if (month >= 2 && month < 5) return "Autumn";
            if (month >= 5 && month < 8) return "Winter";
            if (month >= 8 && month < 11) return "Spring";
            return "Summer";
          }
        }
  
        const currentSeason = getCurrentSeason(today, hemisphere);
  
        // ---------- Populate Data in HTML ----------
        const dataMapping = {
          "moon-phase": `🌙 ${moonPhase}`,
          "daily-gods": `🔹 ${planetaryGods[todayName]}`,
          "lunar-god": `🌕 ${moonName} (${lunarGods[moonName]})`,
          "moon-triad": `🌑 ${moonTriadInfluence}`,
          "current-season": `🌿 Season of ${currentSeason} ruled by ${seasonRulers[currentSeason]}`,
          "next-festival": `📅 ${nextFestival.name} on ${nextFestival.date} (${daysToFestival} days away)`,
          "festival-god": `🔥 ${nextFestival.god} (${nextFestival.element})`
        };
  
        Object.entries(dataMapping).forEach(([id, val]) => {
          const el = document.getElementById(id);
          if (el) el.textContent = val;
        });
  
      } catch (error) {
        console.error("🚨 Error fetching data:", error);
        // Optionally, display an error message in the UI
        const moonPhaseEl = document.getElementById("moon-phase");
        if (moonPhaseEl) {
          moonPhaseEl.textContent = "❌ Unable to fetch moon data";
        }
      }
    }
  
    // 3) Hemisphere Handler
    function updateHemisphere() {
      localStorage.setItem("hemisphere", hemisphereSelect.value);
      fetchPrimalAlignment();
    }
  
    // Trigger whenever user changes the hemisphere
    hemisphereSelect.addEventListener("change", updateHemisphere);
  
    // Initial load
    fetchPrimalAlignment();
  });
  