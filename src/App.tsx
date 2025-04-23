
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import PrecedentExplorer from "./pages/PrecedentExplorer";
import ScrollMemory from "./pages/ScrollMemory";
import PrinciplesPage from "./pages/PrinciplesPage";
import CaseSearch from "./pages/CaseSearch";
import Analytics from "./pages/Analytics";
import ScrollTimePage from "./pages/ScrollTimePage";
import LegalSystems from "./pages/LegalSystems";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  // Add console logging to help with debugging
  useEffect(() => {
    console.log("App component mounted");
    
    // Log window dimensions to help with responsive design debugging
    const logDimensions = () => {
      console.log(`Window size: ${window.innerWidth}x${window.innerHeight}`);
    };
    
    logDimensions();
    window.addEventListener('resize', logDimensions);
    
    return () => {
      window.removeEventListener('resize', logDimensions);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/precedent" element={<PrecedentExplorer />} />
            <Route path="/scroll-memory" element={<ScrollMemory />} />
            <Route path="/principles" element={<PrinciplesPage />} />
            <Route path="/search" element={<CaseSearch />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/scroll-time" element={<ScrollTimePage />} />
            <Route path="/legal-systems" element={<LegalSystems />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
