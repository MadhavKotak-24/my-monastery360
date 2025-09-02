import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Play, 
  Archive, 
  Image as ImageIcon,
  FileText,
  Eye
} from "lucide-react";
import monastariesData from "@/data/monasteries.json";

interface ArchiveItem {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  caption: string;
  metadata: {
    date: string;
    material: string;
    language?: string;
    artist?: string;
  };
}

const MonasteryDetail = () => {
  const { id } = useParams();
  const [selectedArchive, setSelectedArchive] = useState<ArchiveItem | null>(null);
  
  const monastery = monastariesData.find(m => m.id === id);

  if (!monastery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Monastery not found</h1>
          <Button asChild variant="monastery">
            <Link to="/map">Return to Map</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-monastery-stone/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button asChild variant="stone" size="sm">
            <Link to="/map">
              <ArrowLeft className="w-4 h-4" />
              Back to Map
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">
              {monastery.name}
            </h1>
            <p className="text-muted-foreground">{monastery.shortDescription}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* 360° Viewer */}
            <Card className="monastery-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-serif">
                  <Eye className="w-5 h-5" />
                  <span>360° Virtual Tour</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-monastery-stone/30 rounded-lg flex items-center justify-center border-2 border-dashed border-monastery-wood/30">
                  <div className="text-center">
                    <Eye className="w-16 h-16 text-monastery-wood mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-bold text-monastery-wood mb-2">
                      360° Panoramic View
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      PhotoSphere viewer will be integrated here
                    </p>
                    <Button variant="monastery">
                      <Play className="w-4 h-4" />
                      Start Virtual Tour
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="monastery-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-serif font-bold mb-4 text-primary">
                  About This Monastery
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {monastery.fullDescription}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <Badge variant="secondary" className="font-serif">
                    <Calendar className="w-3 h-3 mr-1" />
                    Founded {monastery.yearFounded}
                  </Badge>
                  <Badge variant="secondary" className="font-serif">
                    <MapPin className="w-3 h-3 mr-1" />
                    {monastery.location.address}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Archives */}
            <Card className="monastery-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-serif">
                  <Archive className="w-5 h-5" />
                  <span>Historical Archives</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {monastery.archives.map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer monastery-card p-4"
                      onClick={() => setSelectedArchive(item)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-monastery-stone/50 rounded-lg flex items-center justify-center">
                          {item.type === 'manuscript' ? (
                            <FileText className="w-6 h-6 text-monastery-wood" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-monastery-wood" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif font-semibold text-primary group-hover:text-monastery-gold transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{item.caption}</p>
                          <p className="text-xs text-monastery-wood mt-1">{item.metadata.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Audio Narration */}
            <Card className="monastery-card">
              <CardContent className="p-6">
                <h3 className="font-serif font-bold mb-4 text-primary">
                  Audio Guide
                </h3>
                <Button variant="sacred" className="w-full">
                  <Play className="w-4 h-4" />
                  Play Narration
                </Button>
              </CardContent>
            </Card>

            {/* Cultural Events */}
            <Card className="monastery-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-serif">
                  <Calendar className="w-4 h-4" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monastery.culturalEvents.map((event, index) => (
                    <div key={index} className="p-3 bg-monastery-stone/30 rounded-lg">
                      <h4 className="font-serif font-semibold text-sm text-primary">
                        {event.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            <Card className="monastery-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-serif">
                  <ImageIcon className="w-4 h-4" />
                  <span>Gallery</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={monastery.images.main}
                    alt={monastery.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Archive Modal */}
      {selectedArchive && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="monastery-card max-w-2xl w-full max-h-[90vh] overflow-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif">{selectedArchive.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedArchive(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-monastery-stone/30 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-monastery-wood" />
                </div>
                <p className="text-muted-foreground">{selectedArchive.caption}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Date:</span> {selectedArchive.metadata.date}
                  </div>
                  <div>
                    <span className="font-semibold">Material:</span> {selectedArchive.metadata.material}
                  </div>
                  {selectedArchive.metadata.language && (
                    <div className="col-span-2">
                      <span className="font-semibold">Language:</span> {selectedArchive.metadata.language}
                    </div>
                  )}
                  {selectedArchive.metadata.artist && (
                    <div className="col-span-2">
                      <span className="font-semibold">Artist:</span> {selectedArchive.metadata.artist}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MonasteryDetail;