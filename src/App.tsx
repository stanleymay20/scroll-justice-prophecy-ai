
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/language";
import { MetaTags } from "@/components/MetaTags";
import { AppRoutes } from "@/routes/AppRoutes";
import { 
  applyRlsPolicies, 
  initializeAiAuditLog, 
  setupWindowSizeLogger 
} from "@/services/appInitService";
import { ensureEvidenceBucketExists } from "@/services/evidenceService";
import { supabase } from "@/lib/supabase";

// Create a client with safer defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      // Add safety handlers
      onError: (err) => {
        console.error("Query error:", err);
      }
    },
  },
});

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  
  // Initialize app services after render
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("info: App component mounted");
        
        // Set up window size logger
        const cleanupSizeLogger = setupWindowSizeLogger();
        
        // First, check if Supabase session is available
        const { data } = await supabase.auth.getSession();
        console.log("info: Supabase session initialized:", data.session ? "Found" : "Not found");
        
        // Only after auth is ready, try these operations
        try {
          // Ensure evidence bucket exists
          const exists = await ensureEvidenceBucketExists();
          console.log("info: Evidence bucket ready:", exists);
        } catch (error) {
          console.error("Error ensuring evidence bucket exists:", error);
        }
    
        // Apply RLS policies to fix permission issues
        try {
          await applyRlsPolicies();
        } catch (error) {
          console.error("Error applying RLS policies:", error);
        }
        
        // Initialize AI audit log table
        try {
          await initializeAiAuditLog();
        } catch (error) {
          console.error("Error initializing AI audit log:", error);
        }
        
        // Mark app as ready once initialization is complete
        setIsAppReady(true);
        
        return () => {
          cleanupSizeLogger();
        };
      } catch (error) {
        console.error("Error initializing app:", error);
        // Still mark app as ready to avoid endless loading
        setIsAppReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!isAppReady) {
    // Show minimal loading state while initializing
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-justice-dark to-black">
        <div className="text-white text-lg">Loading application...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            {/* Add global meta tags */}
            <MetaTags />
            <AppRoutes />
            <Toaster />
            <Sonner />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
