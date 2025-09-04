// Weather API integration for monastery locations
const WEATHER_API_KEY = '' // No API key for demo

export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  visibility: number
  windSpeed: number
  location: string
}

export const fetchWeatherData = async (lat: number, lng: number): Promise<WeatherData | null> => {
  // Skip API call since no key provided, return mock data directly
  const mockWeatherConditions = ['Clear', 'Clouds', 'Mist', 'Fog']
  const randomCondition = mockWeatherConditions[Math.floor(Math.random() * mockWeatherConditions.length)]
  
  return {
    temperature: Math.floor(Math.random() * 15) + 10, // 10-25°C
    condition: randomCondition,
    humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
    visibility: Math.floor(Math.random() * 10) + 10, // 10-20 km
    windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    location: 'Sikkim'
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