import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plane, Hotel as HotelIcon, MapPin, Star } from "lucide-react";
import monastariesData from "@/data/monasteries.json";
import HotelCard from "@/components/HotelCard";
import BookingModal from "@/components/BookingModal";

// Mock hotel data - in a real app, this would come from an API
const generateHotelsNearMonastery = (monasteryId: string) => {
  const baseHotels = [
    {
      id: `${monasteryId}-hotel-1`,
      name: "Himalayan Heritage Resort",
      rating: 4.5,
      price: 3500,
      distance: "2.3 km",
      amenities: ["WiFi", "Parking", "Restaurant", "Breakfast"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      description: "Luxury resort with mountain views and traditional Sikkimese hospitality"
    },
    {
      id: `${monasteryId}-hotel-2`,
      name: "Sacred Valley Inn",
      rating: 4.2,
      price: 2800,
      distance: "1.8 km",
      amenities: ["WiFi", "Breakfast", "Parking"],
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
      description: "Cozy boutique hotel with authentic local cuisine and peaceful gardens"
    },
    {
      id: `${monasteryId}-hotel-3`,
      name: "Mountain View Lodge",
      rating: 4.0,
      price: 2200,
      distance: "3.1 km",
      amenities: ["WiFi", "Restaurant", "Parking"],
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
      description: "Budget-friendly accommodation with stunning valley views"
    },
    {
      id: `${monasteryId}-hotel-4`,
      name: "Monastery Gate Hotel",
      rating: 4.3,
      price: 3200,
      distance: "0.8 km",
      amenities: ["WiFi", "Breakfast", "Restaurant", "Parking"],
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
      description: "Closest hotel to the monastery with panoramic mountain views"
    }
  ];
  
  return baseHotels;
};

const BookingPage: React.FC = () => {
  const { id } = useParams();
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    type: 'trip' | 'hotel';
  }>({
    isOpen: false,
    type: 'trip'
  });

  const monastery = monastariesData.find(m => m.id === id);
  const nearbyHotels = monastery ? generateHotelsNearMonastery(monastery.id) : [];

  if (!monastery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Monastery not found</h1>
          <Button asChild variant="outline">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const openBookingModal = (type: 'trip' | 'hotel') => {
    setBookingModal({ isOpen: true, type });
  };

  const closeBookingModal = () => {
    setBookingModal({ isOpen: false, type: 'trip' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-monastery-stone/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button asChild variant="outline" size="sm">
            <Link to={`/monastery/${id}`}>
              <ArrowLeft className="w-4 h-4" />
              Back to Monastery
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">
              Book Your Visit to {monastery.name}
            </h1>
            <p className="text-muted-foreground flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {monastery.location.address}
            </p>
          </div>
        </div>

        <Tabs defaultValue="trip" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="trip" className="flex items-center space-x-2">
              <Plane className="w-4 h-4" />
              <span>Trip Packages</span>
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center space-x-2">
              <HotelIcon className="w-4 h-4" />
              <span>Nearby Hotels</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trip" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Package */}
              <Card className="monastery-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="font-serif">Basic Day Trip</CardTitle>
                  <div className="text-2xl font-bold text-primary">₹2,500</div>
                  <p className="text-sm text-muted-foreground">per person</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li>• Transportation from Gangtok</li>
                    <li>• Monastery entry fee</li>
                    <li>• Local guide</li>
                    <li>• Basic refreshments</li>
                  </ul>
                  <Button 
                    onClick={() => openBookingModal('trip')} 
                    className="w-full monastery-gradient"
                  >
                    Book Day Trip
                  </Button>
                </CardContent>
              </Card>

              {/* Premium Package */}
              <Card className="monastery-card hover:shadow-lg transition-all duration-300 border-monastery-gold/50">
                <CardHeader>
                  <CardTitle className="font-serif">Premium Experience</CardTitle>
                  <div className="text-2xl font-bold text-primary">₹4,500</div>
                  <p className="text-sm text-muted-foreground">per person</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li>• Private transportation</li>
                    <li>• Expert cultural guide</li>
                    <li>• Traditional lunch included</li>
                    <li>• Photography session</li>
                    <li>• Meditation session</li>
                  </ul>
                  <Button 
                    onClick={() => openBookingModal('trip')} 
                    className="w-full monastery-gradient"
                  >
                    Book Premium Trip
                  </Button>
                </CardContent>
              </Card>

              {/* Multi-day Package */}
              <Card className="monastery-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="font-serif">2-Day Spiritual Retreat</CardTitle>
                  <div className="text-2xl font-bold text-primary">₹8,500</div>
                  <p className="text-sm text-muted-foreground">per person</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li>• 1 night accommodation</li>
                    <li>• All meals included</li>
                    <li>• Morning meditation</li>
                    <li>• Cultural workshops</li>
                    <li>• Sunset viewing</li>
                  </ul>
                  <Button 
                    onClick={() => openBookingModal('trip')} 
                    className="w-full monastery-gradient"
                  >
                    Book Retreat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hotels" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onBook={() => openBookingModal('hotel')}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={closeBookingModal}
        type={bookingModal.type}
        monasteryName={monastery.name}
        monasteryLocation={monastery.location.address}
      />
    </div>
  );
};

export default BookingPage;