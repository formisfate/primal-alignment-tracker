/*!
 * Primal Alignment Tracker v1.0.0
 * © 2024 [Your Name or The Primal Way]
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * This tracker provides celestial alignment data but does NOT include the full system of The Primal Way.
 * Visit primalway.org for the complete framework.
 */


// 🌌 Primal Alignment Tracker (with optional Geo-based Hemisphere detection)
document.addEventListener("DOMContentLoaded", async function () {
  console.log("🚀 Primal Alignment Script Loaded.");

  // Hemisphere selector in the DOM
  const hemisphereSelect = document.getElementById("hemisphere");
  if (!hemisphereSelect) {
    console.error("❌ Hemisphere selector not found!");
    return;
  }

  // If no hemisphere is in localStorage, try to detect via geolocation
  let storedHemisphere = localStorage.getItem("hemisphere");
  if (!storedHemisphere) {
    if ("geolocation" in navigator) {
      console.log("🌎 Attempting geolocation to determine hemisphere...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          // If latitude < 0 => Southern Hemisphere, else Northern
          const geoHemisphere = lat < 0 ? "southern" : "northern";
          console.log(`✅ Detected hemisphere via geolocation: ${geoHemisphere}`);

          localStorage.setItem("hemisphere", geoHemisphere);
          hemisphereSelect.value = geoHemisphere;
          fetchPrimalAlignment(); // fetch with newly set hemisphere
        },
        (error) => {
          console.warn("❌ Geolocation blocked or failed, falling back to 'northern'");
          localStorage.setItem("hemisphere", "northern");
          hemisphereSelect.value = "northern";
          fetchPrimalAlignment();
        }
      );
    } else {
      console.warn("❌ Geolocation not supported in this browser, defaulting to 'northern'");
      localStorage.setItem("hemisphere", "northern");
      hemisphereSelect.value = "northern";
      fetchPrimalAlignment();
    }
  } else {
    // If already stored, just use that
    hemisphereSelect.value = storedHemisphere;
    fetchPrimalAlignment();
  }

  // Re-fetch whenever the dropdown changes
  hemisphereSelect.addEventListener("change", () => {
    localStorage.setItem("hemisphere", hemisphereSelect.value);
    fetchPrimalAlignment();
  });

  // ---- MAIN FETCH FUNCTION ----
  async function fetchPrimalAlignment() {
    try {
      console.log("🔄 Fetching Primal Alignment Data...");

      // Placeholder text
      const placeholders = {
        "moon-phase": "🌙 Loading...",
        "daily-gods": "🔹 Loading...",
        "lunar-god": "🌕 Loading...",
        "moon-triad": "🌑 Loading...",
        "current-season": "🌿 Loading...",
        "next-festival": "📅 Loading...",
        "festival-god": "🔥 Loading...",
        "zodiac-sign": "♈ Loading...",
        "zodiac-god": "🔮 Loading..."
      };
      Object.keys(placeholders).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = placeholders[id];
      });

      // Final hemisphere to use
      const hemisphere = localStorage.getItem("hemisphere") || "northern";
      console.log(`🌍 Using hemisphere: ${hemisphere}`);

      // Date, day name
      const today = new Date();
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const todayName = weekdays[today.getUTCDay()];
      const month = today.getMonth() + 1; // 1-based
      const day = today.getDate();

      // Moon data from FarmSense
      const unixTime = Math.floor(Date.now() / 1000);
      const moonResponse = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${unixTime}`);
      const moonData = await moonResponse.json();

      if (!moonData || moonData.length === 0 || moonData[0].Error !== 0) {
        throw new Error(moonData[0]?.ErrorMsg || "Unknown API error");
      }

      const moonPhase = moonData[0].Phase;
      const illumination = parseFloat(moonData[0].Illumination) || 0;
      const farmSenseMoonName = moonData[0].Moon[0] || "Unknown";

      // Lunar God mapping
      const moonNameMapping = {
        "Wolf Moon": "Ares",
        "Snow Moon": "Hera",
        "Worm Moon": "Hermes",
        "Sap Moon": "Hermes",
        "Pink Moon": "Aphrodite",
        "Flower Moon": "Demeter",
        "Strawberry Moon": "Poseidon",
        "Buck Moon": "Zeus",
        "Sturgeon Moon": "Selene",
        "Harvest Moon": "Hades",
        "Hunter’s Moon": "Gaia",
        "Beaver Moon": "Iris",
        "Cold Moon": "Apollo",
        "Blue Moon": "The Void"
      };
      const lunarGod = moonNameMapping[farmSenseMoonName] || "Unknown";

      // Moon Triad
      const moonTriadInfluence =
        illumination >= 0.9
          ? "Selene (Full Moon Influence)"
          : illumination >= 0.4
          ? "Hecate (Waxing & Waning Influence)"
          : "Artemis (New & Crescent Influence)";

      // Planetary rulership
      const planetaryGods = {
        "Monday": "Gaia, Selene",
        "Tuesday": "Ares, Hera",
        "Wednesday": "Hermes, Iris",
        "Thursday": "Zeus, Poseidon",
        "Friday": "Aphrodite",
        "Saturday": "Hades",
        "Sunday": "Apollo, Demeter"
      };
      const rulingGods = planetaryGods[todayName] || "Unknown";

      // Festivals
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

      const upcoming = festivals[hemisphere].find(f => new Date(f.date) >= today) || festivals[hemisphere][0];
      const daysToFestival = Math.ceil((new Date(upcoming.date) - today) / (1000 * 60 * 60 * 24));

      // Basic zodiac partial list
      const zodiacSigns = [
        { sign: "Capricorn", dates: [12, 22, 1, 19], god: "Hades" },
        { sign: "Aquarius", dates: [1, 20, 2, 18], god: "Zeus" },
        { sign: "Pisces", dates: [2, 19, 3, 20], god: "Aphrodite" }
        // Add more as needed
      ];
      let zodiacSign = "Unknown";
      let zodiacGod = "Unknown";
      zodiacSigns.forEach(({ sign, dates, god }) => {
        // e.g. [12,22, 1,19]
        if (
          (month === dates[0] && day >= dates[1]) ||
          (month === dates[2] && day <= dates[3])
        ) {
          zodiacSign = sign;
          zodiacGod = god;
        }
      });

      // Seasons
      function getCurrentSeason(dateObj, hemi) {
        const m = dateObj.getMonth(); // 0-based
        if (hemi === "northern") {
          if (m >= 2 && m < 5) return "Spring";
          if (m >= 5 && m < 8) return "Summer";
          if (m >= 8 && m < 11) return "Autumn";
          return "Winter";
        } else {
          if (m >= 2 && m < 5) return "Autumn";
          if (m >= 5 && m < 8) return "Winter";
          if (m >= 8 && m < 11) return "Spring";
          return "Summer";
        }
      }

      const seasonRulers = {
        "Spring": "Zeus (Air 🌬️)",
        "Summer": "Hera (Fire 🔥)",
        "Autumn": "Selene (Water 🌊)",
        "Winter": "Demeter (Earth 🟤)"
      };

      const currentSeason = getCurrentSeason(today, hemisphere);

      // Insert data into DOM
      const dataMapping = {
        "moon-phase": `🌙 ${moonPhase}`,
        "daily-gods": `🔹 ${rulingGods}`,
        "lunar-god": `🌕 ${farmSenseMoonName} (${lunarGod})`,
        "moon-triad": `🌑 ${moonTriadInfluence}`,
        "current-season": `🌿 Season of ${currentSeason} ruled by ${seasonRulers[currentSeason]}`,
        "next-festival": `📅 ${upcoming.name} on ${upcoming.date} (${daysToFestival} days away)`,
        "festival-god": `🔥 ${upcoming.god} (${upcoming.element})`,
        "zodiac-sign": `♈ ${zodiacSign}`,
        "zodiac-god": `🔮 ${zodiacGod}`
      };

      Object.keys(dataMapping).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = dataMapping[id];
      });

    } catch (error) {
      console.error("🚨 Error fetching data:", error);
      const moonPhaseEl = document.getElementById("moon-phase");
      if (moonPhaseEl) {
        moonPhaseEl.textContent = "❌ Unable to fetch moon data";
      }
    }
  }
});
