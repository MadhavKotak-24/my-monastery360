import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Eye } from "lucide-react";

interface Monastery {
  id: string;
  name: string;
  shortDescription: string;
  yearFounded: number;
  location: {
    address: string;
  };
  images: {
    main: string;
  };
}

interface MonasteryCardProps {
  monastery: Monastery;
}

const MonasteryCard = ({ monastery }: MonasteryCardProps) => {
  return (
    <Card className="monastery-card group overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={monastery.images.main}
          alt={monastery.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center space-x-1 text-sm opacity-90">
            <Calendar className="w-3 h-3" />
            <span>Founded {monastery.yearFounded}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-serif font-bold mb-2 text-primary">
          {monastery.name}
        </h3>
        <p className="text-muted-foreground mb-3 line-clamp-2">
          {monastery.shortDescription}
        </p>
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{monastery.location.address}</span>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0 flex space-x-2">
        <Button asChild variant="monastery" className="flex-1">
          <Link to={`/monastery/${monastery.id}`} className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Explore 360°</span>
          </Link>
        </Button>
        <Button asChild variant="pilgrim" size="sm">
          <Link to={`/monastery/${monastery.id}`}>
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MonasteryCard;