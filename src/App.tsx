
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Landing from "./pages/Landing"; // New landing page
import Dashboard from "./pages/Dashboard"; // New dashboard
import AccessDenied from "./pages/AccessDenied"; // New access denied page
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
    console.log("ScrollJustice.AI initialized");
    
    // Log window dimensions to help with responsive design debugging
    const logDimensions = () => {
      console.log(`Window size: ${window.innerWidth}x${window.innerHeight}`);
    };
    
    logDimensions();
    window.addEventListener('resize', logDimensions);
    
    document.title = "ScrollJustice.AI";
    
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
              <Route path="/" element={<Landing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/access-denied" element={<AccessDenied />} />
              
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
              
              {/* Dashboard - Protected */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* User Profile - Protected */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Basic Features - Some protected */}
              <Route path="/precedent" element={<PrecedentExplorer />} />
              <Route path="/scroll-memory" element={<ScrollMemory />} />
              <Route path="/principles" element={<PrinciplesPage />} />
              <Route path="/search" element={<CaseSearch />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/scroll-time" element={<ScrollTimePage />} />
              <Route path="/legal-systems" element={<LegalSystems />} />
              
              {/* ScrollJustice.AI Core Routes - All Protected */}
              <Route 
                path="/courtrooms" 
                element={
                  <ProtectedRoute>
                    <div>Courtrooms</div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute>
                    <div>Community</div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/documents" 
                element={
                  <ProtectedRoute>
                    <div>Documents</div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <div>Messages</div>
                  </ProtectedRoute>
                } 
              />
              
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
              <Route path="/file-manager" element={<Navigate to="/documents" />} />
              <Route path="/docs" element={<Navigate to="/legal-systems" />} />
              
              {/* 404 Page */}
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
