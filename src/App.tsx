
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/precedent" element={<PrecedentExplorer />} />
            <Route path="/scroll-memory" element={<ScrollMemory />} />
            <Route path="/principles" element={<PrinciplesPage />} />
            <Route path="/search" element={<CaseSearch />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/scroll-time" element={<ScrollTimePage />} />
            <Route path="/legal-systems" element={<LegalSystems />} />
            <Route path="/docs" element={<Navigate to="/legal-systems" />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
