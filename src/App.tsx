
import { Route, Routes } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Precedents from "@/pages/Precedents";
import Community from "@/pages/Community";
import PostDetails from "@/pages/Community/PostDetails";
import CreatePost from "@/pages/Community/CreatePost";
import Profile from "@/pages/Profile";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Reset from "@/pages/Auth/Reset";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ScrollCourt } from "@/pages/ScrollCourt";
import { PetitionDetails } from "@/pages/ScrollCourt/PetitionDetails";
import { NewPetition } from "@/pages/ScrollCourt/NewPetition";
import HallOfSealedScrolls from "@/pages/HallOfSealedScrolls";
import Recovery from "@/pages/Recovery";
import { LanguageProvider } from "@/contexts/language";
import { AuthProvider } from "@/contexts/auth";
import { AIComplianceProvider } from "@/contexts/ai-compliance";
import Plans from "@/pages/Subscription/Plans";
import SubscriptionSuccess from "@/pages/Subscription/Success";
import CourtOnboarding from "@/pages/Onboarding/CourtOnboarding";
import JurisdictionDirectory from "@/pages/JurisdictionDirectory";
import AdminPanel from "@/pages/Admin/AdminPanel";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AIComplianceProvider>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />
              
              {/* Authentication Routes */}
              <Route path="auth">
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="reset" element={<Reset />} />
                <Route path="verify" element={<VerifyEmail />} />
              </Route>
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="recovery" element={<Recovery />} />
              </Route>
              
              {/* Scroll Court Routes */}
              <Route path="court" element={<ScrollCourt />} />
              <Route path="petition/new" element={<NewPetition />} />
              <Route path="petition/:id" element={<PetitionDetails />} />
              <Route path="sealed-scrolls" element={<HallOfSealedScrolls />} />
              <Route path="jurisdictions" element={<JurisdictionDirectory />} />
              
              {/* Community Routes */}
              <Route path="community" element={<Community />} />
              <Route path="community/post/:id" element={<PostDetails />} />
              <Route path="community/create" element={<CreatePost />} />
              
              {/* Precedents Routes */}
              <Route path="precedents" element={<Precedents />} />
              
              {/* Subscription Routes */}
              <Route path="subscription">
                <Route path="plans" element={<Plans />} />
                <Route path="success" element={<SubscriptionSuccess />} />
              </Route>
              
              {/* Onboarding Routes */}
              <Route path="onboarding">
                <Route path="court" element={<CourtOnboarding />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="admin" element={<AdminPanel />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AIComplianceProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
