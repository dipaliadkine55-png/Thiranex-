document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const weatherCard = document.getElementById('weather-card');
    const errorMessage = document.getElementById('error-message');
    
    const cityNameEl = document.getElementById('city-name');
    const weatherConditionEl = document.getElementById('weather-condition');
    const tempValEl = document.getElementById('temp-val');
    const humidityValEl = document.getElementById('humidity-val');
    const windValEl = document.getElementById('wind-val');

    // Convert WMO weather codes to readable descriptions
    function getWeatherDescription(code) {
        const weatherMap = {
            0: 'Clear sky',
            1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
            45: 'Foggy', 48: 'Depositing rime fog',
            51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
            61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
            71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
            95: 'Thunderstorm'
        };
        return weatherMap[code] || 'Fair conditions';
    }

    async function fetchWeatherData(cityName) {
        try {
            // Reset UI states
            errorMessage.classList.add('hidden');
            weatherCard.classList.add('hidden');

            // Step 1: Fetch Latitude and Longitude from Geocoding API
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`);
            
            if (!geoRes.ok) {
                throw new Error('Network error while connecting to geocoding service.');
            }

            const geoData = await geoRes.json();
            
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error(`City "${cityName}" not found. Please verify spelling.`);
            }

            const { name, country, latitude, longitude } = geoData.results[0];

            // Step 2: Fetch Live Weather using Coordinates
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);

            if (!weatherRes.ok) {
                throw new Error('Failed to retrieve weather metrics.');
            }

            const weatherData = await weatherRes.json();
            const current = weatherData.current;

            // Step 3: Dynamically Render Nested JSON Data
            cityNameEl.textContent = `${name}, ${country || ''}`;
            weatherConditionEl.textContent = getWeatherDescription(current.weather_code);
            tempValEl.textContent = `${current.temperature_2m}°C`;
            humidityValEl.textContent = `${current.relative_humidity_2m}%`;
            windValEl.textContent = `${current.wind_speed_10m} km/h`;

            weatherCard.classList.remove('hidden');

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
        }
    }

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cityName = cityInput.value.trim();
        if (cityName) {
            fetchWeatherData(cityName);
            cityInput.value = '';
        }
    });

    // Load default weather on page initialization
    fetchWeatherData('London');
});