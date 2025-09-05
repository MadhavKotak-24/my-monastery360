import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
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

interface MapboxMapProps {
  monasteries: Monastery[]
  onMarkerClick?: (monastery: Monastery) => void
}

const MapboxMap = ({ monasteries, onMarkerClick }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [weather, setWeather] = useState<Record<string, WeatherData>>({})
  const [selectedMonastery, setSelectedMonastery] = useState<Monastery | null>(null)
  const [mapboxToken, setMapboxToken] = useState<string>('')
  
  // Request Mapbox token from user
  useEffect(() => {
    const token = prompt('Please enter your Mapbox Public Token (get it from https://mapbox.com):')
    if (token) {
      setMapboxToken(token)
      mapboxgl.accessToken = token
    } else {
      alert('Mapbox token is required for the map to work. Please refresh and enter your token.')
    }
  }, [])

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [88.6169, 27.3389], // Gangtok, Sikkim
      zoom: 10,
      pitch: 45,
      bearing: 0
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Wait for style to load before adding markers
    map.current.on('style.load', () => {
      if (!map.current) return

      // Add markers for each monastery
      monasteries.forEach((monastery) => {
        // Create custom marker element
        const markerEl = document.createElement('div')
        markerEl.className = 'monastery-marker'
        markerEl.style.cssText = `
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          transition: transform 0.2s;
          ${getMarkerStyle(monastery)}
        `
        markerEl.innerHTML = '⛩️'
        
        // Hover effects
        markerEl.addEventListener('mouseenter', () => {
          markerEl.style.transform = 'scale(1.2)'
        })
        markerEl.addEventListener('mouseleave', () => {
          markerEl.style.transform = 'scale(1)'
        })

        // Create popup content
        const popupContent = createPopupContent(monastery, weather[monastery.id])
        
        // Create popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          maxWidth: '320px'
        }).setHTML(popupContent)

        // Create marker
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([monastery.location.lng, monastery.location.lat])
          .setPopup(popup)
          .addTo(map.current!)

        // Handle marker click
        markerEl.addEventListener('click', () => {
          setSelectedMonastery(monastery)
          onMarkerClick?.(monastery)
        })
      })
    })

    // Fetch weather data
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

    return () => {
      map.current?.remove()
    }
  }, [mapboxToken, monasteries])

  const getMarkerStyle = (monastery: Monastery) => {
    let backgroundColor = 'hsl(var(--monastery-wood))' // Default brown
    
    if (monastery.mostViewed) backgroundColor = 'hsl(var(--monastery-gold))' // Gold
    else if (monastery.mostVisited) backgroundColor = '#FF6B6B' // Red  
    else if (monastery.cleanest) backgroundColor = '#4ECDC4' // Teal
    
    return `background-color: ${backgroundColor}; border: 2px solid white;`
  }

  const createPopupContent = (monastery: Monastery, weather?: WeatherData) => {
    return `
      <div class="monastery-popup p-4 bg-background rounded-lg shadow-lg" style="font-family: inherit;">
        <h3 class="font-semibold text-lg text-primary mb-2">${monastery.name}</h3>
        <p class="text-sm text-muted-foreground mb-3">${monastery.shortDescription}</p>
        
        <div class="flex flex-wrap gap-1 mb-3">
          ${monastery.mostViewed ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"><svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>Most Viewed</span>' : ''}
          ${monastery.mostVisited ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"><svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.414 14.586 7H12z" clip-rule="evenodd"/></svg>Most Visited</span>' : ''}
          ${monastery.cleanest ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"><svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>Cleanest</span>' : ''}
        </div>
        
        ${weather ? `
          <div class="bg-muted/50 rounded-lg p-2 mb-3">
            <div class="flex items-center justify-between text-sm">
              <span class="flex items-center">
                <span class="mr-2">${getWeatherIcon(weather.condition)}</span>
                ${weather.condition}
              </span>
              <span class="font-medium">${weather.temperature}°C</span>
            </div>
          </div>
        ` : ''}
        
        <div class="flex items-center text-xs text-muted-foreground mb-3">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
          <span class="truncate">${monastery.location.address}</span>
        </div>
        
        <a href="/monastery/${monastery.id}" class="inline-block w-full">
          <button class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            View Details
          </button>
        </a>
      </div>
    `
  }

  if (!mapboxToken) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg">
        <div className="text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Please provide your Mapbox token to view the map</p>
          <p className="text-sm text-muted-foreground mt-2">
            Get your free token at <a href="https://mapbox.com" target="_blank" className="text-primary hover:underline">mapbox.com</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        © Mapbox
      </div>
    </div>
  )
}

export default MapboxMap