import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { MapPin, Calendar, Eye, Star, Users, Sparkles } from "lucide-react";

interface Monastery {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  yearFounded: number;
  location: {
    address: string;
  };
  images: {
    main: string;
  };
  visitCount: number;
  cleanlinessRating: number;
  mostViewed?: boolean;
  cleanest?: boolean;
  historical?: boolean;
}

interface MonasteryCardProps {
  monastery: Monastery;
}

const MonasteryCard = ({ monastery }: MonasteryCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="glass-card hover:monastery-glow group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up cursor-pointer">
          <div className="relative h-48 overflow-hidden">
            <img
              src={monastery.images.main}
              alt={monastery.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
            
            {/* Floating badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {monastery.mostViewed && (
                <div className="bg-accent/90 text-primary px-2 py-1 rounded-full text-xs font-medium animate-float flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>Most Viewed</span>
                </div>
              )}
              {monastery.cleanest && (
                <div className="bg-monastery-sage/90 text-white px-2 py-1 rounded-full text-xs font-medium animate-float-slow flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Cleanest</span>
                </div>
              )}
              {monastery.historical && (
                <div className="bg-monastery-gold/90 text-primary px-2 py-1 rounded-full text-xs font-medium animate-float flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Historical</span>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-3 left-3 text-white">
              <div className="flex items-center space-x-1 text-sm opacity-90 backdrop-blur-sm bg-black/20 px-2 py-1 rounded">
                <Calendar className="w-3 h-3" />
                <span>Founded {monastery.yearFounded}</span>
              </div>
            </div>
            
            <div className="absolute bottom-3 right-3 text-white">
              <div className="flex items-center space-x-1 text-sm opacity-90 backdrop-blur-sm bg-black/20 px-2 py-1 rounded">
                <Users className="w-3 h-3" />
                <span>{monastery.visitCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <h3 className="text-xl font-serif font-bold mb-2 text-primary group-hover:text-accent transition-colors">
              {monastery.name}
            </h3>
            <p className="text-muted-foreground mb-3 line-clamp-2">
              {monastery.shortDescription}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{monastery.location.address}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-monastery-gold">
                <Star className="w-3 h-3 fill-current" />
                <span>{monastery.cleanlinessRating}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="px-6 pb-6 pt-0 flex space-x-2">
            <Button asChild variant="monastery" className="flex-1 group-hover:shadow-lg">
              <Link to={`/monastery/${monastery.id}`} className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Explore 360°</span>
              </Link>
            </Button>
            <Button asChild variant="pilgrim" size="sm" className="group-hover:border-accent">
              <Link to={`/booking/${monastery.id}`}>
                Book Visit
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </HoverCardTrigger>
      
      <HoverCardContent className="w-80 p-4" side="top">
        <div className="space-y-3">
          <h4 className="text-lg font-serif font-bold text-primary">{monastery.name}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {monastery.fullDescription?.substring(0, 200)}...
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Visitors: {monastery.visitCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-monastery-gold fill-current" />
              <span className="text-muted-foreground">Rating: {monastery.cleanlinessRating}/5</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Founded: {monastery.yearFounded}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Location: {monastery.location.address.split(',')[0]}</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default MonasteryCard;