
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/language";
import { MetaTags } from "@/components/MetaTags";
import { ensureEvidenceBucketExists } from "@/services/evidenceService";
import { AppRoutes } from "@/routes/AppRoutes";
import { 
  applyRlsPolicies, 
  initializeAiAuditLog, 
  setupWindowSizeLogger 
} from "@/services/appInitService";

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
    console.log("info: App component mounted");
    
    // Set up window size logger
    const cleanupSizeLogger = setupWindowSizeLogger();
    
    // Ensure evidence bucket exists
    ensureEvidenceBucketExists().then(exists => {
      console.log("info: Evidence bucket ready:", exists);
    });

    // Apply RLS policies to fix permission issues
    applyRlsPolicies();
    
    // Initialize AI audit log table
    initializeAiAuditLog();
    
    return () => {
      cleanupSizeLogger();
    };
  }, []);

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
