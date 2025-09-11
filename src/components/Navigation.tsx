import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Map, Calendar, Home, Search } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/map", label: "Map", icon: Map },
    { path: "/bookings", label: "Book Visits", icon: Calendar },
    { path: "/calendar", label: "Events", icon: Calendar },
  ];

  return (
    <nav className="monastery-card border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 monastery-gradient rounded-full flex items-center justify-center">
            <Search className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-serif font-bold monastery-text-gradient">
            Monastery360
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                asChild
                variant={isActive ? "sacred" : "ghost"}
                size="sm"
                className="font-serif"
              >
                <Link to={item.path} className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                asChild
                variant={isActive ? "sacred" : "ghost"}
                size="icon"
              >
                <Link to={item.path}>
                  <Icon className="w-4 h-4" />
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;