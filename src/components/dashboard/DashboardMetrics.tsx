
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { AnimatedValue } from "@/components/advanced-ui/AnimatedValue";
import { useLanguage } from "@/contexts/language";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";
import { useEffect } from "react";

export const DashboardMetrics = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Log the current language for debugging
    console.log(`DashboardMetrics rendered with language: ${language}`);
  }, [language]);
  
  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-semibold text-white mb-4">{t("dashboard.metrics")}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-justice-light/70 text-sm mb-1">{t("dashboard.activeCases")}</p>
          <AnimatedValue 
            value={23} 
            className="text-2xl font-bold text-white"
          />
        </div>
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-justice-light/70 text-sm mb-1">{t("dashboard.courts")}</p>
          <AnimatedValue 
            value={7} 
            className="text-2xl font-bold text-white"
          />
        </div>
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-justice-light/70 text-sm mb-1">{t("dashboard.precedents")}</p>
          <AnimatedValue 
            value={342} 
            className="text-2xl font-bold text-white"
          />
        </div>
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-justice-light/70 text-sm mb-1">{t("dashboard.justiceScore")}</p>
          <AnimatedValue 
            value={98.7} 
            decimals={1}
            suffix="%"
            className="text-2xl font-bold text-white"
          />
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
