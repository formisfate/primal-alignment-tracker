# Primal Alignment Tracker

The **Primal Alignment Tracker** is a lightweight JavaScript tool that displays cosmic alignments including moon phases, daily gods, lunar god mappings, moon triads, seasonal data, festivals, and zodiac signs. It automatically detects your hemisphere via geolocation (if permitted) to adjust the displayed data, while still allowing manual override via a dropdown.

## Features

- **Moon Phase Detection:** Uses the FarmSense API to fetch current moon phase data.
- **Daily & Lunar Gods:** Maps moon names to corresponding mythological deities.
- **Moon Triad Influence:** Determines lunar influence based on the moon's illumination.
- **Season & Festival Data:** Displays the current season and upcoming festivals based on the user’s hemisphere.
- **Zodiac Signs:** Provides a basic mapping of zodiac signs and their ruling gods.
- **Geolocation-based Hemisphere Detection:** Automatically detects if you're in the Northern or Southern Hemisphere. If denied or if detection fails, defaults to the Northern Hemisphere but allows manual override.

## Installation

Since this is a simple static project, no build process or additional dependency management is required.

1. **Clone the Repository:**

   ```bash
   git clone git@github.com:yourusername/primal-alignment-tracker.git
   cd primal-alignment-tracker

## Project Structure

- **index.html** – The main HTML file.
- **alignment-tracker.js** – The JavaScript file responsible for data fetching and UI updates.
- *(Optional)* Additional assets or styles.

## Running the Project Locally

To properly test geolocation (which requires a secure context or localhost), it’s best to serve the project via a local HTTP server. We recommend using `http-server` from Node.js.

### Using `http-server` with npx

#### Ensure Node.js is Installed

Download and install Node.js from [nodejs.org](https://nodejs.org) if you haven't already.

#### Run the Server

In your project directory, run:

npx http-server -a 127.0.0.1 -p 8080

This command starts an HTTP server bound to `127.0.0.1` on port `8080`. Then, open your browser at [http://127.0.0.1:8080](http://127.0.0.1:8080). Browsing via `127.0.0.1` ensures that Chrome allows geolocation over HTTP.

## Usage

### Geolocation
- On first load, the script requests your location.
- If you allow it, the script will automatically set the hemisphere to “southern” or “northern” based on your latitude.
- If you deny or if geolocation isn’t available, it defaults to “northern.”

### Manual Override
- Use the provided dropdown to manually select a hemisphere if needed.

### Data Display
The page updates in real time with cosmic data such as:
- The current moon phase
- Daily gods
- Lunar god
- Moon triad influence
- Season
- Upcoming festival
- Festival god
- Zodiac sign
- Zodiac god

## Troubleshooting

### Geolocation Issues
- Ensure you access the site via [http://127.0.0.1:8080](http://127.0.0.1:8080) to avoid geolocation restrictions on non-secure origins.
- If the hemisphere is stuck on “northern” despite being in the southern hemisphere, clear the cached value with:

  ```js
  localStorage.clear();
  location.reload();

For more accurate testing, override your location using Chrome’s Developer Tools → More Tools → Sensors, and set a custom location with a negative latitude.

## Contributing

Contributions are welcome! Fork the repository, make your improvements, and submit a pull request. For bugs or feature requests, please open an issue in the GitHub repository.

## License

This project is open source and available under the [MIT License](LICENSE).

Enjoy exploring the cosmic alignments with the Primal Alignment Tracker!
