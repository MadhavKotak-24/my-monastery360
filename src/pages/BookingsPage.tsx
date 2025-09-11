import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Calendar, 
  Search, 
  Filter,
  Plane,
  Hotel,
  Star,
  Users,
  Clock
} from "lucide-react";
import monastariesData from "@/data/monasteries.json";
import BookingModal from "@/components/BookingModal";

const BookingsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    type: 'trip' | 'hotel';
    monasteryId: string;
    monasteryName: string;
    monasteryLocation: string;
  }>({
    isOpen: false,
    type: 'trip',
    monasteryId: '',
    monasteryName: '',
    monasteryLocation: ''
  });

  // Filter monasteries based on search and location
  const filteredMonasteries = monastariesData.filter(monastery => {
    const matchesSearch = monastery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         monastery.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === "all" || 
                           monastery.location.address.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  // Get unique locations for filter
  const locations = [...new Set(monastariesData.map(m => 
    m.location.address.split(',')[1]?.trim() || 'East Sikkim'
  ))];

  const openBookingModal = (type: 'trip' | 'hotel', monastery: any) => {
    setBookingModal({
      isOpen: true,
      type,
      monasteryId: monastery.id,
      monasteryName: monastery.name,
      monasteryLocation: monastery.location.address
    });
  };

  const closeBookingModal = () => {
    setBookingModal({
      isOpen: false,
      type: 'trip',
      monasteryId: '',
      monasteryName: '',
      monasteryLocation: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-monastery-stone/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            Book Your Spiritual Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and book visits to the sacred monasteries of Sikkim. Choose from guided tours, 
            spiritual retreats, and nearby accommodation options.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search monasteries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Select location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>{filteredMonasteries.length} monasteries found</span>
            </div>
          </div>
        </div>

        {/* Monasteries Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMonasteries.map((monastery, index) => (
            <Card 
              key={monastery.id} 
              className="monastery-card hover:shadow-xl transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="p-0">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={monastery.images.main}
                    alt={monastery.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {monastery.mostViewed && (
                      <Badge variant="secondary" className="bg-monastery-gold/90 text-white">
                        Most Viewed
                      </Badge>
                    )}
                    {monastery.cleanest && (
                      <Badge variant="secondary" className="bg-green-500/90 text-white">
                        Cleanest
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-primary">
                      <Calendar className="w-3 h-3 mr-1" />
                      Founded {monastery.yearFounded}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <CardTitle className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">
                  {monastery.name}
                </CardTitle>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {monastery.shortDescription}
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        {monastery.visitCount.toLocaleString()} visitors
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-monastery-gold fill-current" />
                      <span className="font-medium">{monastery.cleanlinessRating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">
                      {monastery.location.address.split(',')[0]}
                    </span>
                  </div>
                </div>

                {/* Booking Options */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => openBookingModal('trip', monastery)}
                      size="sm" 
                      className="monastery-gradient group-hover:shadow-lg"
                    >
                      <Plane className="w-4 h-4 mr-1" />
                      Book Trip
                    </Button>
                    <Button 
                      onClick={() => openBookingModal('hotel', monastery)}
                      size="sm" 
                      variant="outline"
                      className="group-hover:border-primary"
                    >
                      <Hotel className="w-4 h-4 mr-1" />
                      Book Hotel
                    </Button>
                  </div>
                  
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link to={`/monastery/${monastery.id}`}>
                      View Details & 360° Tour
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredMonasteries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-xl font-serif font-bold mb-2">No monasteries found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all locations.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedLocation("all");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Popular Packages Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-8 text-primary">
            Popular Spiritual Packages
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="monastery-card hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-serif flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Day Pilgrimage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2">₹2,500</div>
                <p className="text-sm text-muted-foreground mb-4">
                  Visit 3 monasteries in one day with transportation and guide included.
                </p>
                <ul className="text-sm space-y-1 mb-4">
                  <li>• Transportation included</li>
                  <li>• Expert guide</li>
                  <li>• Lunch at monastery</li>
                </ul>
                <Button className="w-full monastery-gradient">
                  Book Package
                </Button>
              </CardContent>
            </Card>

            <Card className="monastery-card hover:shadow-xl transition-all duration-300 border-monastery-gold/50">
              <CardHeader>
                <CardTitle className="font-serif flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>3-Day Retreat</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2">₹12,500</div>
                <p className="text-sm text-muted-foreground mb-4">
                  Immersive spiritual experience with meditation and cultural activities.
                </p>
                <ul className="text-sm space-y-1 mb-4">
                  <li>• 2 nights accommodation</li>
                  <li>• All meals included</li>
                  <li>• Meditation sessions</li>
                  <li>• Cultural workshops</li>
                </ul>
                <Button className="w-full monastery-gradient">
                  Book Retreat
                </Button>
              </CardContent>
            </Card>

            <Card className="monastery-card hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-serif flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Group Tour</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2">₹1,800</div>
                <p className="text-sm text-muted-foreground mb-4">
                  Perfect for families and groups. Special discounts for 6+ people.
                </p>
                <ul className="text-sm space-y-1 mb-4">
                  <li>• Group discounts</li>
                  <li>• Shared transportation</li>
                  <li>• Group activities</li>
                  <li>• Family-friendly</li>
                </ul>
                <Button className="w-full monastery-gradient">
                  Book Group Tour
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={closeBookingModal}
        type={bookingModal.type}
        monasteryName={bookingModal.monasteryName}
        monasteryLocation={bookingModal.monasteryLocation}
      />
    </div>
  );
};

export default BookingsPage;