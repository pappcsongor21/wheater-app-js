# Weather Dashboard

A Vanilla JavaScript weather application that provides current weather conditions based on user location input.

## 🚀 Features
- **Geocoding:** Converts user input (city names, addresses) into coordinates using the Google Maps Geocoding API.
- **Real-time Weather:** Fetches current weather data based on coordinates.
- **Unit Toggle:** Users can switch between Celsius and Fahrenheit dynamically.
- **Persistent State:** Saves the last searched location and weather data to `localStorage` so it persists across page reloads.
- Interactive UI with a loading state and dynamic SVG weather icons.

## 🛠️ Built With
- HTML5
- CSS3
- Vanilla JavaScript 
- APIs: Google Maps Geocoding API, Google Weather API

## ⚙️ How to run locally
1. Clone the repository.
2. Create a `GoogleMapsApiKey.txt` file in the root folder and paste your valid Google Cloud API key (with Geocoding and Weather APIs enabled) inside.
3. Open `index.html` via Live Server (or any local web server).
