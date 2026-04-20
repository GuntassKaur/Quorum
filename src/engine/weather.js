/**
 * QUORUM WEATHER SERVICE
 * 
 * Fetches live weather from OpenWeatherMap.
 * Falls back to realistic simulated data if no API key or network issues.
 */

const OWM_API_KEY = import.meta.env.VITE_OPENWEATHER_KEY || '';
const DEFAULT_LAT = 28.6139;  // New Delhi (adjustable)
const DEFAULT_LON = 77.2090;

/**
 * Parse raw OWM data into our internal weather schema.
 */
function parseOWMData(data) {
  const tempC = data.main.temp - 273.15; // Kelvin → Celsius
  const feelsLike = data.main.feels_like - 273.15;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed; // m/s
  const condition = data.weather[0].main;
  const icon = data.weather[0].icon;

  // Simplified Heat Index (Rothfusz approximation for high-temp events)
  const RH = humidity;
  const T = tempC;
  const heatIndex = -8.78469475556 +
    1.61139411 * T +
    2.33854883889 * RH +
    -0.14611605 * T * RH +
    -0.012308094 * T * T +
    -0.016424828 * RH * RH +
    0.002211732 * T * T * RH +
    0.00072546 * T * RH * RH +
    -0.000003582 * T * T * RH * RH;

  // Crowd Fatigue Risk (0–1)
  const fatigue = Math.min(1, Math.max(0,
    (tempC - 20) / 20 * 0.5 +
    (humidity - 40) / 60 * 0.3 +
    (windSpeed < 1 ? 0.2 : 0)
  ));

  return {
    tempC: parseFloat(tempC.toFixed(1)),
    feelsLike: parseFloat(feelsLike.toFixed(1)),
    humidity,
    windSpeed: parseFloat(windSpeed.toFixed(1)),
    heatIndex: parseFloat(heatIndex.toFixed(1)),
    condition,
    icon,
    fatigue: parseFloat(fatigue.toFixed(2)),
    source: 'live',
  };
}

/**
 * Generate realistic simulated weather that slowly drifts.
 */
let _simWeather = null;
function simulatedWeather() {
  if (!_simWeather) {
    _simWeather = {
      tempC: 29 + Math.random() * 8,
      humidity: 50 + Math.random() * 30,
      windSpeed: 0.5 + Math.random() * 3,
      condition: ['Clear', 'Clouds', 'Haze'][Math.floor(Math.random() * 3)],
      icon: '02d',
    };
  }

  // Drift slightly each call
  _simWeather.tempC = Math.min(42, Math.max(18, _simWeather.tempC + (Math.random() - 0.5) * 0.3));
  _simWeather.humidity = Math.min(90, Math.max(30, _simWeather.humidity + (Math.random() - 0.5) * 1));
  _simWeather.windSpeed = Math.max(0, _simWeather.windSpeed + (Math.random() - 0.5) * 0.3);

  const T = _simWeather.tempC;
  const RH = _simWeather.humidity;
  const heatIndex = T + ((RH - 40) / 100) * 5;
  const fatigue = Math.min(1, Math.max(0, (T - 24) / 16 * 0.6 + (RH - 50) / 50 * 0.4));

  return {
    ..._simWeather,
    feelsLike: parseFloat((T + 1.5).toFixed(1)),
    heatIndex: parseFloat(heatIndex.toFixed(1)),
    fatigue: parseFloat(fatigue.toFixed(2)),
    source: 'simulated',
  };
}

/**
 * Main export: fetch weather, with live or simulated fallback.
 */
export async function fetchWeather(lat = DEFAULT_LAT, lon = DEFAULT_LON) {
  if (!OWM_API_KEY) {
    return simulatedWeather();
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OWM API error: ${res.status}`);
    const data = await res.json();
    return parseOWMData(data);
  } catch (err) {
    console.warn('[QUORUM Weather] Live fetch failed, using simulation:', err.message);
    return simulatedWeather();
  }
}

/**
 * Weather Risk Labels
 */
export function getWeatherRiskLevel(weather) {
  if (!weather) return 'NOMINAL';
  if (weather.fatigue > 0.7 || weather.tempC > 38) return 'CRITICAL';
  if (weather.fatigue > 0.4 || weather.tempC > 32) return 'ELEVATED';
  return 'NOMINAL';
}
