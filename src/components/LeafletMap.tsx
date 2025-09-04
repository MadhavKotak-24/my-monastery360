import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Eye, Users, Sparkles } from 'lucide-react'
import { fetchWeatherData, getWeatherIcon, WeatherData } from '@/lib/weather'
import { Link } from 'react-router-dom'

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

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

interface LeafletMapProps {
  monasteries: Monastery[]
  onMarkerClick?: (monastery: Monastery) => void
}

const LeafletMap = ({ monasteries, onMarkerClick }: LeafletMapProps) => {
  const [weather, setWeather] = useState<Record<string, WeatherData>>({})
  const [selectedMonastery, setSelectedMonastery] = useState<Monastery | null>(null)

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

  const getMonasteryIcon = (monastery: Monastery) => {
    let color = '#8B4513' // Default brown
    
    if (monastery.mostViewed) color = '#FFD700' // Gold
    else if (monastery.mostVisited) color = '#FF6B6B' // Red
    else if (monastery.cleanest) color = '#4ECDC4' // Teal
    
    return new L.Icon({
      iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${color}"/>
          <circle cx="12.5" cy="12.5" r="6" fill="white"/>
          <text x="12.5" y="17" text-anchor="middle" fill="${color}" font-size="10" font-family="Arial">⛩</text>
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    })
  }

  const handleMarkerClick = (monastery: Monastery) => {
    setSelectedMonastery(monastery)
    onMarkerClick?.(monastery)
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[27.3389, 88.6169]} // Center on Gangtok, Sikkim
        zoom={10}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {monasteries.map((monastery) => (
          <Marker
            key={monastery.id}
            position={[monastery.location.lat, monastery.location.lng]}
            icon={getMonasteryIcon(monastery)}
            eventHandlers={{
              click: () => handleMarkerClick(monastery),
            }}
          >
            <Popup className="max-w-xs">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-primary">{monastery.name}</h3>
                      <p className="text-sm text-muted-foreground">{monastery.shortDescription}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {monastery.mostViewed && (
                        <Badge variant="secondary" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Most Viewed
                        </Badge>
                      )}
                      {monastery.mostVisited && (
                        <Badge variant="secondary" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          Most Visited
                        </Badge>
                      )}
                      {monastery.cleanest && (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Cleanest
                        </Badge>
                      )}
                    </div>
                    
                    {weather[monastery.id] && (
                      <div className="bg-muted/50 rounded-lg p-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            <span className="mr-2">{getWeatherIcon(weather[monastery.id].condition)}</span>
                            {weather[monastery.id].condition}
                          </span>
                          <span className="font-medium">{weather[monastery.id].temperature}°C</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{monastery.location.address}</span>
                    </div>
                    
                    <Link to={`/monastery/${monastery.id}`}>
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default LeafletMap