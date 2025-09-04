import { useEffect, useRef } from 'react'
import { Viewer } from 'photo-sphere-viewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FullscreenIcon, InfoIcon, VolumeXIcon, Volume2Icon } from 'lucide-react'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'

interface Hotspot {
  id: string
  x: number // percentage from left
  y: number // percentage from top
  title: string
  content: string
  type: 'info' | 'image' | 'audio'
  imageUrl?: string
}

interface PanoramaViewerProps {
  panoramaUrl: string
  hotspots?: Hotspot[]
  title?: string
  className?: string
}

const PanoramaViewer = ({ panoramaUrl, hotspots = [], title, className }: PanoramaViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create the viewer
    const viewer = new Viewer({
      container: containerRef.current,
      panorama: panoramaUrl,
      caption: title,
      loadingImg: '/placeholder.svg',
      navbar: [
        'autorotate',
        'zoom',
        'caption',
        'fullscreen'
      ]
    })

    viewerRef.current = viewer

    // Add hotspot overlays manually since markers plugin might not be available
    if (hotspots.length > 0) {
      hotspots.forEach(hotspot => {
        const hotspotElement = document.createElement('div')
        hotspotElement.className = 'absolute cursor-pointer z-10 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors'
        hotspotElement.style.left = `${hotspot.x}%`
        hotspotElement.style.top = `${hotspot.y}%`
        hotspotElement.innerHTML = hotspot.type === 'info' ? '📍' : hotspot.type === 'image' ? '🖼️' : '🔊'
        hotspotElement.title = hotspot.title
        
        hotspotElement.addEventListener('click', () => {
          alert(`${hotspot.title}\n\n${hotspot.content}`)
        })
        
        containerRef.current?.appendChild(hotspotElement)
      })
    }

    return () => {
      viewer.destroy()
    }
  }, [panoramaUrl, hotspots, title])

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      
      {/* Overlay controls */}
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="secondary" className="bg-black/50 text-white">
          360° View
        </Badge>
      </div>
      
      {hotspots.length > 0 && (
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="bg-black/50 border-none">
            <CardContent className="p-3">
              <p className="text-white text-sm">
                <InfoIcon className="inline w-4 h-4 mr-1" />
                Click the markers to explore
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default PanoramaViewer