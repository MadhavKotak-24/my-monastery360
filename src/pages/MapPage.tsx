import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MapPin } from "lucide-react";
import MonasteryCard from "@/components/MonasteryCard";
import monastariesData from "@/data/monasteries.json";

const MapPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMonasteries, setFilteredMonasteries] = useState(monastariesData);

  useEffect(() => {
    const filtered = monastariesData.filter(monastery =>
      monastery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monastery.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monastery.location.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMonasteries(filtered);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-monastery-stone/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="monastery-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-serif font-bold mb-4 text-primary">
                  Find Monasteries
                </h2>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search monasteries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 font-serif"
                    />
                  </div>
                  
                  <Button variant="stone" size="sm" className="w-full">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-serif font-semibold mb-3 text-primary">
                    Found {filteredMonasteries.length} monasteries
                  </h3>
                  <div className="space-y-2">
                    {filteredMonasteries.map((monastery) => (
                      <div key={monastery.id} className="flex items-center space-x-2 p-2 rounded hover:bg-accent/50 transition-colors cursor-pointer">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm font-serif">{monastery.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Map Placeholder */}
            <Card className="monastery-card mb-8">
              <CardContent className="p-0">
                <div className="h-96 bg-monastery-stone/30 rounded-lg flex items-center justify-center border-2 border-dashed border-monastery-wood/30">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-monastery-wood mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-bold text-monastery-wood mb-2">
                      Interactive Map
                    </h3>
                    <p className="text-muted-foreground">
                      Google Maps integration will display monastery locations here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monastery Grid */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6 text-primary">
                Featured Monasteries
              </h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMonasteries.map((monastery) => (
                  <MonasteryCard key={monastery.id} monastery={monastery} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;