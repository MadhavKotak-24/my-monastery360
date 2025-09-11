import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import MonasteryChatbot from "@/components/MonasteryChatbot";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import MonasteryDetail from "./pages/MonasteryDetail";
import BookingPage from "./pages/BookingPage";
import BookingsPage from "./pages/BookingsPage";
import CultureCalendar from "./pages/CultureCalendar";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isChatbotMinimized, setIsChatbotMinimized] = useState(false);
  
  useEffect(() => {
    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/monastery/:id" element={<MonasteryDetail />} />
                <Route path="/booking/:id" element={<BookingPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/calendar" element={<CultureCalendar />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* AI Chatbot */}
              <MonasteryChatbot 
                isMinimized={isChatbotMinimized}
                onToggleMinimize={() => setIsChatbotMinimized(!isChatbotMinimized)}
              />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
