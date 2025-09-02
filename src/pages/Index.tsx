import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Map, Calendar, Eye, Archive } from "lucide-react";
import MonasteryCard from "@/components/MonasteryCard";
import monastariesData from "@/data/monasteries.json";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/src/assets/hero-monastery.jpg')`
          }}
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-7xl font-serif font-bold mb-6 monastery-text-gradient">
            Monastery360
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-serif">
            Explore sacred spaces through immersive 360° virtual tours and discover centuries of spiritual heritage
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild variant="monastery" size="xl">
              <Link to="/map" className="flex items-center space-x-2">
                <Map className="w-5 h-5" />
                <span>Explore Map</span>
              </Link>
            </Button>
            <Button asChild variant="pilgrim" size="xl">
              <Link to="/calendar" className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Cultural Events</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Monasteries */}
      <section className="py-20 bg-gradient-to-br from-background via-monastery-stone/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4 text-primary">
              Featured Sacred Spaces
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Journey through time and explore monasteries that have preserved wisdom traditions for centuries
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {monastariesData.slice(0, 3).map((monastery) => (
              <MonasteryCard key={monastery.id} monastery={monastery} />
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild variant="stone" size="lg">
              <Link to="/map">
                View All Monasteries
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 monastery-gradient">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold">360° Virtual Tours</h3>
              <p className="text-white/90">
                Immerse yourself in sacred spaces with interactive panoramic views and clickable hotspots
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Archive className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold">Historical Archives</h3>
              <p className="text-white/90">
                Discover ancient manuscripts, murals, and artifacts preserved through centuries
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold">Cultural Events</h3>
              <p className="text-white/90">
                Stay connected with living traditions through festivals and sacred ceremonies
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
