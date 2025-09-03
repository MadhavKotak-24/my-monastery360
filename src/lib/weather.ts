// Weather API integration for monastery locations
const WEATHER_API_KEY = 'your-weather-api-key' // In production, use environment variables

export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  visibility: number
  windSpeed: number
  location: string
}

export const fetchWeatherData = async (lat: number, lng: number): Promise<WeatherData | null> => {
  try {
    // Using OpenWeatherMap API (free tier)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
    )
    
    if (!response.ok) {
      throw new Error('Weather data not available')
    }
    
    const data = await response.json()
    
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      location: data.name
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    // Return mock weather data for demo purposes
    return {
      temperature: 18,
      condition: 'Clear',
      humidity: 65,
      visibility: 15,
      windSpeed: 12,
      location: 'Sikkim'
    }
  }
}

export const getWeatherIcon = (condition: string): string => {
  const iconMap: Record<string, string> = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Snow': '🌨️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  }
  
  return iconMap[condition] || '🌤️'
}