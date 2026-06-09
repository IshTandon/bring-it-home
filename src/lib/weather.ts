/**
 * weather.ts
 * OpenWeatherMap client for match-day weather per stadium city.
 * Free tier: 1,000 req/day — more than enough.
 * Docs: https://openweathermap.org/current
 */

const OWM_KEY = process.env.WEATHER_API_KEY ?? '';

export interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  city: string;
}

const FALLBACK_WEATHER: WeatherData = {
  temp: 24, feelsLike: 24, description: 'Clear', humidity: 55, windSpeed: 12, icon: '☀️', city: '',
};

export async function getWeather(city: string, lat: number, lng: number): Promise<WeatherData> {
  if (!OWM_KEY) {
    return { ...FALLBACK_WEATHER, city };
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OWM_KEY}&units=metric`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    const data = await res.json();
    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      icon: '🌤️',
      city,
    };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[weather] error:', err);
    return { ...FALLBACK_WEATHER, city };
  }
}
