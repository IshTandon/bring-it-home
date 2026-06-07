/**
 * weather.ts
 * OpenWeatherMap client for match-day weather per stadium city.
 * Free tier: 1,000 req/day — more than enough.
 * Docs: https://openweathermap.org/current
 */

const OWM_KEY = process.env.WEATHER_API_KEY ?? '';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !OWM_KEY;

export interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  city: string;
}

const MOCK_WEATHER: Record<string, WeatherData> = {
  'East Rutherford': { temp: 26, feelsLike: 28, description: 'Partly cloudy', humidity: 62, windSpeed: 14, icon: '⛅', city: 'East Rutherford' },
  'Arlington': { temp: 21, feelsLike: 21, description: 'Clear (dome)', humidity: 45, windSpeed: 0, icon: '🏟️', city: 'Arlington' },
  'Inglewood': { temp: 23, feelsLike: 22, description: 'Sunny', humidity: 55, windSpeed: 18, icon: '☀️', city: 'Inglewood' },
  'Mexico City': { temp: 18, feelsLike: 16, description: 'Thin air at altitude', humidity: 70, windSpeed: 8, icon: '🌤️', city: 'Mexico City' },
  'Vancouver': { temp: 19, feelsLike: 18, description: 'Overcast', humidity: 78, windSpeed: 12, icon: '🌥️', city: 'Vancouver' },
  'Santa Clara': { temp: 22, feelsLike: 21, description: 'Clear', humidity: 50, windSpeed: 16, icon: '☀️', city: 'Santa Clara' },
};

export async function getWeather(city: string, lat: number, lng: number): Promise<WeatherData> {
  if (USE_MOCK) {
    return MOCK_WEATHER[city] ?? {
      temp: 24, feelsLike: 24, description: 'Clear', humidity: 55, windSpeed: 12, icon: '☀️', city,
    };
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OWM_KEY}&units=metric`;
  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1hr
  const data = await res.json();
  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
    icon: '🌤️',
    city,
  };
}
