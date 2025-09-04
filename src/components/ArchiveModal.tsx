import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, MapPin, Download, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'

interface ArchiveItem {
  id: string
  title: string
  type: 'manuscript' | 'mural' | 'artifact' | 'photograph'
  thumbnail: string
  fullImage: string
  caption: string
  metadata: {
    date: string
    material: string
    language: string
    artist?: string
    location?: string
  }
}

interface ArchiveModalProps {
  isOpen: boolean
  onClose: () => void
  item: ArchiveItem | null
}

const ArchiveModal = ({ isOpen, onClose, item }: ArchiveModalProps) => {
  const [zoom, setZoom] = useState(1)

  if (!item) return null

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const resetZoom = () => {
    setZoom(1)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'manuscript': return 'bg-amber-100 text-amber-800'
      case 'mural': return 'bg-purple-100 text-purple-800'
      case 'artifact': return 'bg-green-100 text-green-800'
      case 'photograph': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate mr-4">{item.title}</span>
            <Badge className={getTypeColor(item.type)}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[70vh]">
          {/* Image Viewer */}
          <div className="lg:col-span-2 relative">
            <div className="relative border rounded-lg overflow-hidden bg-gray-50">
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                <Button size="sm" variant="secondary" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" onClick={resetZoom}>
                  {Math.round(zoom * 100)}%
                </Button>
                <Button size="sm" variant="secondary" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="overflow-auto max-h-[400px]">
                <img 
                  src={item.fullImage} 
                  alt={item.title}
                  className="transition-transform duration-200"
                  style={{ 
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                    cursor: zoom > 1 ? 'move' : 'zoom-in'
                  }}
                  onClick={() => zoom === 1 && setZoom(2)}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.caption}
              </p>
            </div>
          </div>
          
          {/* Metadata Panel */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{item.metadata.date}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0">📜</div>
                  <div>
                    <p className="text-sm font-medium">Material</p>
                    <p className="text-sm text-muted-foreground">{item.metadata.material}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0">🗣️</div>
                  <div>
                    <p className="text-sm font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">{item.metadata.language}</p>
                  </div>
                </div>
                
                {item.metadata.artist && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Artist/Creator</p>
                      <p className="text-sm text-muted-foreground">{item.metadata.artist}</p>
                    </div>
                  </div>
                )}
                
                {item.metadata.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Found At</p>
                      <p className="text-sm text-muted-foreground">{item.metadata.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download High Resolution
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ArchiveModal