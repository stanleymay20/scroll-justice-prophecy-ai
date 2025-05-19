
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { AnimatedValue } from "@/components/advanced-ui/AnimatedValue";
import { useLanguage } from "@/contexts/language";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const DashboardMetrics = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log(`DashboardMetrics rendered with language: ${language}`);
  }, [language]);
  
  return (
    <GlassCard className="p-6">
      <Alert variant="destructive" className="bg-yellow-900/20 border-yellow-600/50 mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {t("dashboard.demoDisclaimer", "This is a demo version with simulated data for illustration purposes only.")}
        </AlertDescription>
      </Alert>
      
      <h2 className="text-xl font-semibold text-white mb-4">{t("dashboard.metrics")}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-justice-light/70 text-sm mb-1">{t("dashboard.activeCases")}</p>
          <div className="text-2xl font-bold text-white flex items-center justify-center">
            <span className="text-xs bg-yellow-700/30 px-1 rounded mr-1">DEMO</span>
            <span>--</span>
          </div>
        </div>
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-justice-light/70 text-sm mb-1">{t("dashboard.courts")}</p>
          <div className="text-2xl font-bold text-white flex items-center justify-center">
            <span className="text-xs bg-yellow-700/30 px-1 rounded mr-1">DEMO</span>
            <span>--</span>
          </div>
        </div>
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-justice-light/70 text-sm mb-1">{t("dashboard.precedents")}</p>
          <div className="text-2xl font-bold text-white flex items-center justify-center">
            <span className="text-xs bg-yellow-700/30 px-1 rounded mr-1">DEMO</span>
            <span>--</span>
          </div>
        </div>
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-justice-light/70 text-sm mb-1">{t("dashboard.justiceScore")}</p>
          <div className="text-2xl font-bold text-white flex items-center justify-center">
            <span className="text-xs bg-yellow-700/30 px-1 rounded mr-1">DEMO</span>
            <span>--</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={() => navigate("/precedent")}>
          {t("nav.precedent")}
        </Button>
        <Button onClick={() => navigate("/courtroom")}>
          {t("court.oath")}
        </Button>
        <Button 
          variant="default"
          className="bg-justice-tertiary hover:bg-justice-tertiary/80 relative"
          onClick={() => navigate("/simulation-trial")}
        >
          <span>{t("court.simulation")}</span>
          <div className="absolute -top-1 -right-1">
            <PulseEffect color="bg-justice-primary" />
          </div>
        </Button>
      </div>
    </GlassCard>
  );
};
