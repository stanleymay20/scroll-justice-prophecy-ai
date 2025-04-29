
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import PrecedentExplorer from "./pages/PrecedentExplorer";
import ScrollMemory from "./pages/ScrollMemory";
import PrinciplesPage from "./pages/PrinciplesPage";
import CaseSearch from "./pages/CaseSearch";
import Analytics from "./pages/Analytics";
import ScrollTimePage from "./pages/ScrollTimePage";
import LegalSystems from "./pages/LegalSystems";
import CaseClassification from "./pages/CaseClassification";
import DocumentUpload from "./pages/DocumentUpload";
import SimulationTrial from "./pages/SimulationTrial";
import AITraining from "./pages/AITraining";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { CommunityForum } from "./components/community/CommunityForum";

// Auth Pages
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import ResetPassword from "./pages/Auth/ResetPassword";
import UpdatePassword from "./pages/Auth/UpdatePassword";
import AuthCallback from "./pages/Auth/AuthCallback";

// Subscription Pages
import SubscriptionPlans from "./pages/Subscription/Plans";
import SubscriptionSuccess from "./pages/Subscription/Success";
import ManageSubscription from "./pages/Subscription/Manage";

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
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Subscription Routes */}
              <Route path="/subscription/plans" element={<SubscriptionPlans />} />
              <Route path="/subscription/success" element={<SubscriptionSuccess />} />
              <Route 
                path="/subscription/manage" 
                element={
                  <ProtectedRoute>
                    <ManageSubscription />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Community Forum */}
              <Route path="/community" element={<CommunityForum />} />
              
              {/* Basic Tier Routes - Free or any subscription */}
              <Route path="/precedent" element={<PrecedentExplorer />} />
              <Route path="/scroll-memory" element={<ScrollMemory />} />
              <Route path="/principles" element={<PrinciplesPage />} />
              <Route path="/search" element={<CaseSearch />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/scroll-time" element={<ScrollTimePage />} />
              <Route path="/legal-systems" element={<LegalSystems />} />
              
              {/* Professional Tier Routes */}
              <Route 
                path="/case-classification" 
                element={
                  <ProtectedRoute requireSubscription requiredTier="professional">
                    <CaseClassification />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/document-upload" 
                element={
                  <ProtectedRoute requireSubscription requiredTier="professional">
                    <DocumentUpload />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/simulation-trial" 
                element={
                  <ProtectedRoute requireSubscription requiredTier="professional">
                    <SimulationTrial />
                  </ProtectedRoute>
                } 
              />
              
              {/* Enterprise Tier Routes */}
              <Route 
                path="/ai-training" 
                element={
                  <ProtectedRoute requireSubscription requiredTier="enterprise">
                    <AITraining />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirects */}
              <Route path="/file-manager" element={<Navigate to="/document-upload" />} />
              <Route path="/docs" element={<Navigate to="/legal-systems" />} />
              <Route path="/dashboard" element={<Navigate to="/" />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
