
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Import pages
import Index from "@/pages/Index";
import { Dashboard } from "@/components/dashboard/Dashboard";
import PrecedentExplorer from "@/pages/PrecedentExplorer";
import ScrollMemory from "@/pages/ScrollMemory";
import PrinciplesPage from "@/pages/PrinciplesPage";
import Analytics from "@/pages/Analytics";
import ScrollTimePage from "@/pages/ScrollTimePage";
import LegalSystems from "@/pages/LegalSystems";
import CaseClassification from "@/pages/CaseClassification";
import DocumentUpload from "@/pages/DocumentUpload";
import SimulationTrial from "@/pages/SimulationTrial";
import AITraining from "@/pages/AITraining";
import Profile from "@/pages/Profile";
import CaseSearch from "@/pages/CaseSearch";
import Courtroom from "@/pages/Courtroom";
import HallOfSealedScrolls from "@/pages/HallOfSealedScrolls";
import Witness from "@/pages/Witness";
import EmailPreferencesPage from "@/pages/EmailPreferencesPage";
import Unsubscribe from "@/pages/Unsubscribe";
import Plans from "@/pages/Subscription/Plans";
import Manage from "@/pages/Subscription/Manage";
import Success from "@/pages/Subscription/Success";
import AIUsagePolicy from "@/pages/policy/AIUsagePolicy";
import Blessing from "@/pages/Blessing";
import Recovery from "@/pages/Recovery";
import Planet from "@/pages/Planet";
import SignIn from "@/pages/Auth/SignIn";
import SignUp from "@/pages/Auth/SignUp";
import ResetPassword from "@/pages/Auth/ResetPassword";
import UpdatePassword from "@/pages/Auth/UpdatePassword";
import AuthCallback from "@/pages/Auth/AuthCallback";
import MCPDashboard from "@/pages/Admin/MCPDashboard";
import DeveloperDashboard from "@/pages/Admin/DeveloperDashboard";
import SuccessionSystem from "@/pages/Admin/SuccessionSystem";
import NotFound from "@/pages/NotFound";

// Import hooks
import { useOnboarding } from "@/hooks/useOnboarding";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useLanguage } from '@/contexts/language';
import { AIDisclosureBanner } from '@/components/compliance/AIDisclosureBanner';

function App() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    console.log("App component mounted");
  }, []);

  // Initialize onboarding sequence for new users
  useOnboarding();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/precedent" element={<PrecedentExplorer />} />
        <Route path="/scroll-memory" element={<ScrollMemory />} />
        <Route path="/principles" element={<PrinciplesPage />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/search" element={<CaseSearch />} />
        <Route path="/scroll-time" element={<ScrollTimePage />} />
        <Route path="/legal-systems" element={<LegalSystems />} />
        <Route path="/case-classification" element={<CaseClassification />} />
        <Route path="/document-upload" element={<DocumentUpload />} />
        <Route path="/simulation-trial" element={<SimulationTrial />} />
        <Route path="/ai-training" element={<AITraining />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/courtroom" element={<Courtroom />} />
        <Route path="/sealed-scrolls" element={<HallOfSealedScrolls />} />
        <Route path="/witness" element={<Witness />} />
        <Route path="/preferences" element={<EmailPreferencesPage />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/subscription/plans" element={<Plans />} />
        <Route path="/subscription/manage" element={<ProtectedRoute><Manage /></ProtectedRoute>} />
        <Route path="/subscription/success" element={<Success />} />
        <Route path="/policy/ai-usage" element={<AIUsagePolicy />} />
        <Route path="/blessing" element={<Blessing />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/planet" element={<Planet />} />
        <Route path="/auth">
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="update-password" element={<UpdatePassword />} />
          <Route path="callback" element={<AuthCallback />} />
        </Route>
        <Route path="/admin">
          <Route path="mcp" element={<MCPDashboard />} />
          <Route path="developer" element={<DeveloperDashboard />} />
          <Route path="succession" element={<SuccessionSystem />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
