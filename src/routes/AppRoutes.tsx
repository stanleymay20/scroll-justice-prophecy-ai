
import { Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import PrecedentExplorer from "@/pages/PrecedentExplorer";
import ScrollMemory from "@/pages/ScrollMemory";
import PrinciplesPage from "@/pages/PrinciplesPage";
import CaseSearch from "@/pages/CaseSearch";
import Analytics from "@/pages/Analytics";
import ScrollTimePage from "@/pages/ScrollTimePage";
import LegalSystems from "@/pages/LegalSystems";
import CaseClassification from "@/pages/CaseClassification";
import DocumentUpload from "@/pages/DocumentUpload";
import SimulationTrial from "@/pages/SimulationTrial";
import AITraining from "@/pages/AITraining";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import { CommunityForum } from "@/components/community/CommunityForum";
import DeveloperDashboard from "@/pages/Admin/DeveloperDashboard";
import MCPDashboard from "@/pages/Admin/MCPDashboard";
import SuccessionSystem from "@/pages/Admin/SuccessionSystem";
import Courtroom from "@/pages/Courtroom";
import Witness from "@/pages/Witness";
import AIUsagePolicy from "@/pages/policy/AIUsagePolicy";
import Blessing from "@/pages/Blessing";
import HallOfSealedScrolls from "@/pages/HallOfSealedScrolls";
import RecoveryPage from "@/pages/Recovery";
import PlanetPage from "@/pages/Planet";
import EmailPreferencesPage from "@/pages/EmailPreferencesPage";

// Auth Pages
import SignIn from "@/pages/Auth/SignIn";
import SignUp from "@/pages/Auth/SignUp";
import ResetPassword from "@/pages/Auth/ResetPassword";
import UpdatePassword from "@/pages/Auth/UpdatePassword";
import AuthCallback from "@/pages/Auth/AuthCallback";

// Subscription Pages
import SubscriptionPlans from "@/pages/Subscription/Plans";
import SubscriptionSuccess from "@/pages/Subscription/Success";
import ManageSubscription from "@/pages/Subscription/Manage";

export const AppRoutes = () => {
  return (
    <TooltipProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Blessing and Onboarding */}
        <Route path="/blessing" element={<Blessing />} />
        <Route path="/recovery" element={<RecoveryPage />} />
        
        {/* Policy Routes */}
        <Route path="/policy/ai-usage" element={<AIUsagePolicy />} />
        
        {/* Email Preferences Route */}
        <Route 
          path="/email-preferences" 
          element={
            <ProtectedRoute>
              <EmailPreferencesPage />
            </ProtectedRoute>
          } 
        />
        
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
        
        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <DeveloperDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/mcp" 
          element={
            <ProtectedRoute>
              <MCPDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/succession" 
          element={
            <ProtectedRoute>
              <SuccessionSystem />
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
        
        {/* Courtroom Routes */}
        <Route path="/courtroom" element={<Courtroom />} />
        <Route path="/courtroom/:id" element={<Courtroom />} />
        
        {/* Hall of Sealed Scrolls */}
        <Route path="/hall-of-sealed" element={<HallOfSealedScrolls />} />
        
        {/* Planet Map */}
        <Route path="/planet" element={<PlanetPage />} />
        
        {/* Witness Routes */}
        <Route path="/witness/:id" element={<Witness />} />
        
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
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
}
