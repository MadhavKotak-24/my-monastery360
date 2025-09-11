import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Wifi, Car, Coffee, UtensilsCrossed } from "lucide-react";

interface Hotel {
  id: string;
  name: string;
  rating: number;
  price: number;
  distance: string;
  amenities: string[];
  image: string;
  description: string;
}

interface HotelCardProps {
  hotel: Hotel;
  onBook: () => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onBook }) => {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-3 h-3" />;
      case 'parking':
        return <Car className="w-3 h-3" />;
      case 'breakfast':
        return <Coffee className="w-3 h-3" />;
      case 'restaurant':
        return <UtensilsCrossed className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="monastery-card hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="p-0">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-primary">
              <MapPin className="w-3 h-3 mr-1" />
              {hotel.distance}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-serif line-clamp-1">
            {hotel.name}
          </CardTitle>
          <div className="flex items-center space-x-1 text-monastery-gold">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{hotel.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {hotel.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {hotel.amenities.slice(0, 4).map((amenity) => (
            <Badge key={amenity} variant="outline" className="text-xs">
              {getAmenityIcon(amenity)}
              <span className="ml-1">{amenity}</span>
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              ₹{hotel.price.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">per night</div>
          </div>
          <Button onClick={onBook} size="sm" className="monastery-gradient">
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCard;