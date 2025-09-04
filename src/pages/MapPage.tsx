import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Calendar, Users, Filter, Eye, Sparkles, TrendingUp } from "lucide-react";
import MonasteryCard from "@/components/MonasteryCard";
import GoogleMap from "@/components/GoogleMap";
import monastariesData from "@/data/monasteries.json";

const MapPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedMonastery, setSelectedMonastery] = useState<any>(null);

  const filteredMonasteries = useMemo(() => {
    return monastariesData.filter((monastery) => {
      const matchesSearch = monastery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           monastery.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           monastery.location.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = selectedFilters.length === 0 || 
                            selectedFilters.some(filter => {
                              switch (filter) {
                                case "nyingma":
                                  return monastery.shortDescription.toLowerCase().includes("nyingma");
                                case "kagyu":
                                  return monastery.shortDescription.toLowerCase().includes("kagyu") || 
                                         monastery.shortDescription.toLowerCase().includes("karma kagyu");
                                case "ancient":
                                  return monastery.yearFounded < 1800;
                                case "modern":
                                  return monastery.yearFounded > 1900;
                                case "most-viewed":
                                  return monastery.mostViewed;
                                case "most-visited":
                                  return monastery.mostVisited || monastery.visitCount > 12000;
                                case "cleanest":
                                  return monastery.cleanest || monastery.cleanlinessRating >= 4.8;
                                default:
                                  return true;
                              }
                            });
      
      return matchesSearch && matchesFilters;
    });
  }, [searchTerm, selectedFilters]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filters = [
    { id: "nyingma", label: "Nyingma School", count: monastariesData.filter(m => m.shortDescription.toLowerCase().includes("nyingma")).length },
    { id: "kagyu", label: "Kagyu School", count: monastariesData.filter(m => m.shortDescription.toLowerCase().includes("kagyu")).length },
    { id: "ancient", label: "Ancient (Pre-1800)", count: monastariesData.filter(m => m.yearFounded < 1800).length },
    { id: "modern", label: "Modern (Post-1900)", count: monastariesData.filter(m => m.yearFounded > 1900).length },
    { id: "most-viewed", label: "Most Viewed", count: monastariesData.filter(m => m.mostViewed).length, icon: Eye },
    { id: "most-visited", label: "Most Visited", count: monastariesData.filter(m => m.mostVisited || m.visitCount > 12000).length, icon: TrendingUp },
    { id: "cleanest", label: "Cleanest Places", count: monastariesData.filter(m => m.cleanest || m.cleanlinessRating >= 4.8).length, icon: Sparkles },
  ];

  const handleMarkerClick = (monastery: any) => {
    setSelectedMonastery(monastery);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-6rem)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Monasteries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Search by name, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {filters.map((filter) => {
                      const Icon = filter.icon;
                      return (
                        <Button
                          key={filter.id}
                          variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter(filter.id)}
                          className="justify-between"
                        >
                          <span className="flex items-center gap-2">
                            {Icon && <Icon className="h-3 w-3" />}
                            {filter.label}
                          </span>
                          <Badge variant="secondary" className="ml-2">
                            {filter.count}
                          </Badge>
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{monastariesData.length} Monasteries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Cultural Events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Virtual Tours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Results */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>
                  Monasteries ({filteredMonasteries.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
                {filteredMonasteries.map((monastery) => (
                  <MonasteryCard key={monastery.id} monastery={monastery} />
                ))}
                
                {filteredMonasteries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No monasteries found matching your criteria.</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-6 h-full">
                <div className="h-full rounded-lg overflow-hidden">
                  <GoogleMap 
                    monasteries={filteredMonasteries} 
                    onMarkerClick={handleMarkerClick}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;