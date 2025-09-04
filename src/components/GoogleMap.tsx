import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Eye, Users, Sparkles } from 'lucide-react'
import { fetchWeatherData, getWeatherIcon, WeatherData } from '@/lib/weather'
import { Link } from 'react-router-dom'

interface Monastery {
  id: string
  name: string
  shortDescription: string
  location: {
    lat: number
    lng: number
    address: string
  }
  visitCount: number
  cleanlinessRating: number
  mostViewed?: boolean
  mostVisited?: boolean
  cleanest?: boolean
  images: {
    main: string
  }
}

interface GoogleMapProps {
  monasteries: Monastery[]
  onMarkerClick?: (monastery: Monastery) => void
}

// You'll need to add your Google Maps API key here or use environment variables
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY' // Replace with actual key

declare global {
  interface Window {
    google: typeof google
  }
}

const GoogleMap = ({ monasteries, onMarkerClick }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [weather, setWeather] = useState<Record<string, WeatherData>>({})
  const [markers, setMarkers] = useState<any[]>([])
  const [infoWindows, setInfoWindows] = useState<any[]>([])

  useEffect(() => {
    // Fetch weather data for all monasteries
    const fetchAllWeatherData = async () => {
      const weatherData: Record<string, WeatherData> = {}
      
      for (const monastery of monasteries) {
        const data = await fetchWeatherData(monastery.location.lat, monastery.location.lng)
        if (data) {
          weatherData[monastery.id] = data
        }
      }
      
      setWeather(weatherData)
    }
    
    fetchAllWeatherData()
  }, [monasteries])

  useEffect(() => {
    if (!mapRef.current || !GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
      console.warn('Google Maps API key not provided. Please add your API key to use Google Maps.')
      return
    }

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places']
    })

    loader.load().then(() => {
      if (window.google && window.google.maps) {
        const mapInstance = new window.google.maps.Map(mapRef.current!, {
          center: { lat: 27.3389, lng: 88.6169 }, // Center on Gangtok, Sikkim
          zoom: 10,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels.icon',
              stylers: [{ visibility: 'off' }]
            }
          ]
        })

        setMap(mapInstance)
      }
    })
  }, [])

  useEffect(() => {
    if (!map) return

    // Clear existing markers and info windows
    markers.forEach((marker: any) => marker.setMap(null))
    infoWindows.forEach((infoWindow: any) => infoWindow.close())
    setMarkers([])
    setInfoWindows([])

    const newMarkers: any[] = []
    const newInfoWindows: any[] = []

    monasteries.forEach(monastery => {
      // Create custom marker icon based on monastery type
      let iconColor = '#8B4513' // Default brown
      if (monastery.mostViewed) iconColor = '#FFD700' // Gold
      else if (monastery.mostVisited) iconColor = '#FF6B6B' // Red
      else if (monastery.cleanest) iconColor = '#4ECDC4' // Teal

      const marker = new window.google.maps.Marker({
        position: { lat: monastery.location.lat, lng: monastery.location.lng },
        map,
        title: monastery.name,
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: iconColor,
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2
        }
      })

      // Create info window content
      const weatherInfo = weather[monastery.id] 
        ? `<div class="bg-gray-100 p-2 rounded mt-2">
             <div class="flex justify-between items-center text-sm">
               <span>${getWeatherIcon(weather[monastery.id].condition)} ${weather[monastery.id].condition}</span>
               <span class="font-medium">${weather[monastery.id].temperature}°C</span>
             </div>
           </div>`
        : ''

      const badges = []
      if (monastery.mostViewed) badges.push('<span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">👁️ Most Viewed</span>')
      if (monastery.mostVisited) badges.push('<span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">👥 Most Visited</span>')
      if (monastery.cleanest) badges.push('<span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-800">✨ Cleanest</span>')

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-semibold text-lg text-blue-600 mb-1">${monastery.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${monastery.shortDescription}</p>
            
            <div class="flex flex-wrap gap-1 mb-2">
              ${badges.join('')}
            </div>
            
            ${weatherInfo}
            
            <div class="flex items-center text-xs text-gray-500 mt-2 mb-3">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <span class="truncate">${monastery.location.address}</span>
            </div>
            
            <a href="/monastery/${monastery.id}" class="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded text-sm font-medium transition-colors">
              View Details
            </a>
          </div>
        `
      })

      marker.addListener('click', () => {
        // Close other info windows
        newInfoWindows.forEach(window => window.close())
        
        infoWindow.open(map, marker)
        onMarkerClick?.(monastery)
      })

      newMarkers.push(marker)
      newInfoWindows.push(infoWindow)
    })

    setMarkers(newMarkers)
    setInfoWindows(newInfoWindows)

    // Fit map to show all markers
    if (newMarkers.length > 0 && window.google) {
      const bounds = new window.google.maps.LatLngBounds()
      newMarkers.forEach((marker: any) => {
        bounds.extend(marker.getPosition())
      })
      map.fitBounds(bounds)
    }

  }, [map, monasteries, weather, onMarkerClick])

  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center p-6">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Google Maps API Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please add your Google Maps API key to enable the interactive map.
          </p>
          <p className="text-xs text-muted-foreground">
            Get your API key from: <br />
            <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
               className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              Google Maps Platform
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />
    </div>
  )
}

export default GoogleMap