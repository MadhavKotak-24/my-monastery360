import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import monastariesData from "@/data/monasteries.json";

const CultureCalendar = () => {
  const today = new Date();
  
  // Collect all cultural events from all monasteries
  const allEvents = monastariesData.flatMap(monastery =>
    monastery.culturalEvents.map(event => ({
      ...event,
      monastery: monastery.name,
      monasteryId: monastery.id,
      location: monastery.location.address
    }))
  );

  // Separate upcoming and past events
  const upcomingEvents = allEvents
    .filter(event => new Date(event.date) > today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  const pastEvents = allEvents
    .filter(event => new Date(event.date) <= today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3); // Show only 3 most recent past events

  // Combine with upcoming events first
  const sortedEvents = [...upcomingEvents, ...pastEvents];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-monastery-stone/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4 monastery-text-gradient">
            Cultural Calendar
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Discover sacred festivals, ceremonies, and cultural events across Sikkim's monasteries
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{upcomingEvents.length}</div>
              <div className="text-muted-foreground">Upcoming Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{pastEvents.length}</div>
              <div className="text-muted-foreground">Recent Events</div>
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-6 text-primary">
              Upcoming Sacred Festivals
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {upcomingEvents.map((event, index) => {
                const eventDate = new Date(event.date);
                const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <Card key={`upcoming-${index}`} className="monastery-card group border-primary/20 shadow-lg">
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
                        <div className="text-right">
                          <Badge variant="default" className="font-serif mb-1">
                            Upcoming
                          </Badge>
                          <div className="text-xs text-primary font-semibold">
                            {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-monastery-gold" />
                          <span className="font-serif font-semibold">
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
          </div>
        )}

        {/* Recent Events Section */}
        {pastEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-6 text-muted-foreground">
              Recent Celebrations
            </h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {pastEvents.map((event, index) => {
                const eventDate = new Date(event.date);
                
                return (
                  <Card key={`past-${index}`} className="monastery-card group opacity-75 hover:opacity-100 transition-opacity">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="font-serif text-lg text-muted-foreground mb-1">
                            {event.name}
                          </CardTitle>
                          <p className="text-muted-foreground font-serif text-sm">
                            {event.monastery}
                          </p>
                        </div>
                        <Badge variant="secondary" className="font-serif text-xs">
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground leading-relaxed text-sm line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex items-center space-x-2 text-xs">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="font-serif text-muted-foreground">
                          {eventDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

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