
import { useEffect } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/language";
import { MetaTags } from "@/components/MetaTags";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { LandingPage } from "@/components/landing/LandingPage";

const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Log mount for debugging
  useEffect(() => {
    console.log("Index page mounted");
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={user ? t("nav.dashboard") : t("nav.home")} />
      <NavBar />
      
      {user ? <Dashboard /> : <LandingPage />}
    </div>
  );
};

export default Index;
