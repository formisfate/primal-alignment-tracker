document.addEventListener("DOMContentLoaded", async function () {
  console.log("🚀 Primal Alignment Script Loaded.");

  // Get references to our key elements:
  const hemisphereSelect = document.getElementById("hemisphere");
  const testDateInput = document.getElementById("test-date");

  if (!hemisphereSelect || !testDateInput) {
    console.error("❌ Required elements not found in the HTML!");
    return;
  }

  // Store loaded JSON data
  let primalData = {};

  // -----------------------------
  //    1) LOAD DATA & SET DATE
  // -----------------------------
  await loadPrimalData();

  // Default the date picker to today (YYYY-MM-DD)
  testDateInput.value = new Date().toISOString().split("T")[0];

  // -----------------------------
  //   2) HEMISPHERE DETECTION
  // -----------------------------
  let storedHemisphere = localStorage.getItem("hemisphere");

  // If no stored hemisphere, try geolocation:
  if (!storedHemisphere) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // If geolocation works, set hemisphere based on latitude
          const geoHemisphere = position.coords.latitude < 0 ? "southern" : "northern";
          localStorage.setItem("hemisphere", geoHemisphere);
          hemisphereSelect.value = geoHemisphere;
          // Fetch data now that hemisphere is known
          fetchPrimalAlignment();
        },
        () => {
          // If user denies location or error occurs, default to northern
          localStorage.setItem("hemisphere", "northern");
          hemisphereSelect.value = "northern";
          fetchPrimalAlignment();
        }
      );
    } else {
      // If geolocation not available at all
      localStorage.setItem("hemisphere", "northern");
      hemisphereSelect.value = "northern";
      fetchPrimalAlignment();
    }
  } else {
    // We already have a stored hemisphere
    hemisphereSelect.value = storedHemisphere;
    // Fetch data immediately
    fetchPrimalAlignment();
  }

  // -----------------------------
  // 3) EVENT LISTENERS (re-fetch)
  // -----------------------------
  // If user changes hemisphere manually
  hemisphereSelect.addEventListener("change", () => {
    localStorage.setItem("hemisphere", hemisphereSelect.value);
    fetchPrimalAlignment();
  });

  // If user picks a new test date
  testDateInput.addEventListener("change", fetchPrimalAlignment);

  // -----------------------------
  //       HELPER FUNCTIONS
  // -----------------------------
  async function loadPrimalData() {
    try {
      const response = await fetch("primal-alignment-data.json");
      primalData = await response.json();
      console.log("📜 Primal Alignment Data Loaded", primalData);
    } catch (error) {
      console.error("🚨 Error loading Primal Alignment data:", error);
    }
  }

  function getCurrentSeason(month, hemisphere) {
    // Basic seasonal mapping
    if (hemisphere === "northern") {
      if (month >= 3 && month < 6) return "Spring";
      if (month >= 6 && month < 9) return "Summer";
      if (month >= 9 && month < 12) return "Autumn";
      return "Winter";
    } else {
      // Southern hemisphere seasons reversed
      if (month >= 3 && month < 6) return "Autumn";
      if (month >= 6 && month < 9) return "Winter";
      if (month >= 9 && month < 12) return "Spring";
      return "Summer";
    }
  }

  // -----------------------------
  //      MAIN FETCH FUNCTION
  // -----------------------------
  async function fetchPrimalAlignment() {
    try {
      console.log("🔄 Fetching Primal Alignment Data...");

      if (!primalData || Object.keys(primalData).length === 0) {
        console.warn("⚠️ JSON Data Not Ready. Retrying...");
        return;
      }

      // Determine which hemisphere we should use
      const hemisphere = localStorage.getItem("hemisphere") || "northern";

      // Get the date from the date picker (or fall back to real today)
      const testDateValue = testDateInput.value; // e.g. "2025-03-20"
      let today;
      if (testDateValue) {
        // If user picked a date, parse it as YYYY-MM-DD
        today = new Date(testDateValue + "T00:00:00");
      } else {
        // Otherwise use the real current date/time
        today = new Date();
      }

      // We'll use these for lookups
      const todayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][today.getDay()];
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const todayDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

      // -----------------------------
      //    MOON PHASE & LUNAR GOD
      // -----------------------------
      // Use external API for moon phases, passing epoch for "today"
      const moonResponse = await fetch(
        `https://api.farmsense.net/v1/moonphases/?d=${Math.floor(today.getTime() / 1000)}`
      );
      const moonData = await moonResponse.json();

      // Safely read the first item from the response
      const moonPhase = moonData[0]?.Phase || "Unknown";
      const farmSenseMoonName = moonData[0]?.Moon[0] || "Unknown";
      const illumination = moonData[0]?.Illumination || 0;

      // Look up the "lunar god" name from your primalData
      const lunarGod = primalData.moonMappings[farmSenseMoonName] || "Unknown";

      // Triad logic based on illumination
      const moonTriadInfluence =
        illumination >= 0.9 ? "Selene (Full Moon)" :
        illumination >= 0.4 ? "Hecate (Waxing & Waning)" :
        "Artemis (New & Crescent)";

      // -----------------------------
      //   DAILY RULING GOD (planet)
      // -----------------------------
      const rulingGods = primalData.planetaryGods[todayName] || "Unknown";

      // -----------------------------
      //   NEXT FESTIVAL (by date)
      // -----------------------------
      let upcomingFestival = primalData.festivals[hemisphere]
        ?.filter(f => f.date >= todayDate)
        ?.sort((a, b) => new Date(a.date) - new Date(b.date))[0]
        || primalData.festivals[hemisphere][0];

      // -----------------------------
      //     CURRENT SEASON & RULER
      // -----------------------------
      const currentSeason = getCurrentSeason(month, hemisphere);
      const seasonRuler = primalData.seasonRulers[currentSeason] || "Unknown";

      // -----------------------------
      //       ZODIAC & GOD
      // -----------------------------
      // Find the zodiac sign whose date range includes (month, day)
      const zodiac = primalData.zodiacSigns.find(({ dates }) =>
        (month === dates[0] && day >= dates[1]) ||
        (month === dates[2] && day <= dates[3])
      ) || { sign: "Unknown", god: "Unknown" };

      // If there's a festival god
      const festivalGod = upcomingFestival?.god
        ? `${upcomingFestival.god} (${upcomingFestival.element})`
        : "Unknown";

      // -----------------------------
      //        UPDATE THE DOM
      // -----------------------------
      // 1) Top table rows
      document.getElementById("moon-phase").innerHTML      = `🌙 ${moonPhase}`;
      document.getElementById("daily-gods").innerHTML      = `🔹 ${rulingGods}`;
      document.getElementById("lunar-god").innerHTML       = `🌕 ${farmSenseMoonName} (${lunarGod})`;
      document.getElementById("moon-triad").innerHTML      = `🌑 ${moonTriadInfluence}`;
      document.getElementById("current-season").innerHTML  = `🌿 Season of ${currentSeason} ruled by ${seasonRuler}`;
      document.getElementById("next-festival").innerHTML   = `📅 ${upcomingFestival.name} on ${upcomingFestival.date}`;
      document.getElementById("festival-god").innerHTML    = `🔥 ${festivalGod}`;
      document.getElementById("zodiac-sign").innerHTML     = `♈ ${zodiac.sign}`;
      document.getElementById("zodiac-god").innerHTML      = `🔮 ${zodiac.god}`;

      // 2) Extra Celestial Events (today only)
      let extraEvents = [];

      // Planetary alignments
      primalData.planetaryAlignments.forEach(event => {
        if (event.date === todayDate) {
          extraEvents.push(`🪐 ${event.event}`);
        }
      });

      // Eclipses
      primalData.eclipses.forEach(event => {
        if (event.date === todayDate) {
          extraEvents.push(`☀️ ${event.type}`);
        }
      });

      // Meteor showers
      primalData.meteorShowers.forEach(event => {
        if (event.peak === todayDate) {
          extraEvents.push(`☄️ Peak of ${event.name}`);
        }
      });

      // Show them or a fallback message
      document.getElementById("extra-events").innerHTML =
        extraEvents.length > 0
          ? extraEvents.join("<br>")
          : "No extra celestial events.";

      // 3) Active Retrogrades (today)
      const activeRetrogrades = primalData.retrogrades
        .filter(event => {
          const startDate = new Date(event.start);
          const endDate = new Date(event.end);
          return today >= startDate && today <= endDate;
        })
        .map(event => `🔄 ${event.planet}`)
        .join("<br>");

      // If you have a row <td id="active-retrogrades"></td> in HTML:
      document.getElementById("active-retrogrades").innerHTML =
        activeRetrogrades || "No retrogrades active today.";

      // 4) Expandable sections (bottom of page)
      // Eclipses
      document.getElementById("eclipses").innerHTML = (primalData.eclipses || [])
        .map(e => `☀️ ${e.type} - ${e.date} (${e.visibility})`)
        .join("<br>") || "No eclipses listed.";

      // Meteor Showers
      document.getElementById("meteorShowers").innerHTML = (primalData.meteorShowers || [])
        .map(m => `☄ ${m.name} - Peak: ${m.peak}`)
        .join("<br>") || "No meteor showers listed.";

      // Planetary Alignments
      document.getElementById("planetaryAlignments").innerHTML = (primalData.planetaryAlignments || [])
        .map(p => `🪐 ${p.event} - ${p.date}`)
        .join("<br>") || "No alignments listed.";

      // Dark Moons
      document.getElementById("darkMoons").innerHTML = (primalData.darkMoons || [])
        .map(d => `🌑 ${d.date}`)
        .join("<br>") || "No dark moons listed.";

      // Full Retrograde List
      document.getElementById("retrogrades").innerHTML = (primalData.retrogrades || [])
        .map(r => `🔄 ${r.planet}: ${r.start} - ${r.end}`)
        .join("<br>") || "No retrogrades listed.";

    } catch (error) {
      console.error("🚨 Error fetching data:", error);
    }
  }
});
