import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import monastariesData from "@/data/monasteries.json";

const CultureCalendar = () => {
  // Collect all cultural events from all monasteries
  const allEvents = monastariesData.flatMap(monastery =>
    monastery.culturalEvents.map(event => ({
      ...event,
      monastery: monastery.name,
      monasteryId: monastery.id,
      location: monastery.location.address
    }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-monastery-stone/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4 monastery-text-gradient">
            Cultural Calendar
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover sacred festivals, ceremonies, and cultural events across monasteries worldwide
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {allEvents.map((event, index) => {
            const eventDate = new Date(event.date);
            const isUpcoming = eventDate > new Date();
            
            return (
              <Card key={index} className="monastery-card group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-serif text-xl text-primary mb-2">
                        {event.name}
                      </CardTitle>
                      <p className="text-muted-foreground font-serif">
                        {event.monastery}
                      </p>
                    </div>
                    <Badge 
                      variant={isUpcoming ? "default" : "secondary"}
                      className="font-serif"
                    >
                      {isUpcoming ? "Upcoming" : "Past"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-monastery-gold" />
                      <span className="font-serif">
                        {eventDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-monastery-gold" />
                      <span className="text-muted-foreground line-clamp-1">
                        {event.location}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-monastery-gold" />
                      <span className="text-muted-foreground">
                        All Day Event
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-monastery-gold" />
                      <span className="text-muted-foreground">
                        Open to Visitors
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <Button 
                      variant="monastery" 
                      size="sm"
                      className="w-full group-hover:shadow-lg transition-all"
                    >
                      Learn More About This Monastery
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Festival Information */}
        <Card className="monastery-card mt-12">
          <CardHeader>
            <CardTitle className="font-serif text-center text-primary">
              About Monastic Festivals
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Monastic festivals are sacred celebrations that connect communities with ancient wisdom traditions. 
              These events often feature ritual ceremonies, traditional music, spiritual teachings, and cultural 
              performances that have been preserved for centuries.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 monastery-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-serif font-semibold text-primary mb-2">Seasonal Celebrations</h3>
                <p className="text-sm text-muted-foreground">
                  Many festivals align with lunar calendars and seasonal changes
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 monastery-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-serif font-semibold text-primary mb-2">Community Gathering</h3>
                <p className="text-sm text-muted-foreground">
                  These events bring together monks, pilgrims, and local communities
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 monastery-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-serif font-semibold text-primary mb-2">Ancient Traditions</h3>
                <p className="text-sm text-muted-foreground">
                  Ceremonies preserve rituals passed down through generations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CultureCalendar;