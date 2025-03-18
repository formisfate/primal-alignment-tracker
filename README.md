# Primal Alignment Tracker

A lightweight JavaScript library to fetch and display data about moon phases, daily gods, seasonal festivals, and other “Primal Way” alignments.  

It uses:
- [Farmsense.net](https://www.farmsense.net/) for real-time moon phase data  
- Hardcoded festival data for the “Primal Way” seasonal alignments  
- Local storage to remember the user’s selected hemisphere

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Hemisphere Selection](#hemisphere-selection)
- [Configuration / Customization](#configuration--customization)
- [Contributing](#contributing)
- [License](#license)

---

## Features

1. **Moon Phase Fetching**  
   Fetches current moon phase from Farmsense API and displays it in the DOM.

2. **Daily Gods**  
   Populates a “daily gods” field based on the current day (Sunday -> Apollo & Demeter, Monday -> Selene, etc.).

3. **Festivals & Seasons**  
   Shows the next upcoming festival, the days until it arrives, and references the associated gods.

4. **Persistent Hemisphere**  
   Saves the user’s selected hemisphere (`northern` or `southern`) in `localStorage`, so the page remains consistent across visits.

5. **Auto-Refreshing**  
   On page load (and whenever the hemisphere changes), data is fetched and relevant DOM elements are updated automatically.

---

## Getting Started

1. **Clone or Download** this repository to your local machine.  
2. **Open `index.html`** in your browser to see a quick demo.  

That’s it! The script (`primal-alignment.js`) runs as soon as the page loads, fetching data and populating the alignment info.

---

## Usage

### Include the Script

If you’re integrating into an existing site, place something like this in your HTML:

```html
<script src="./primal-alignment.js"></script>
