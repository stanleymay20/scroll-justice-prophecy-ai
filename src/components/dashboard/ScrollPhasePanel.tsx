
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { ScrollPhaseIndicator } from "@/components/dashboard/ScrollPhaseIndicator";
import { useLanguage } from "@/contexts/language";

export const ScrollPhasePanel = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Current scroll phase and gate from the original file
  const currentScrollPhase = "RISE";
  const currentScrollGate = 4;
  
  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-semibold text-white mb-4">{t("dashboard.scrollPhase")}</h2>
      <ScrollPhaseIndicator 
        phase={currentScrollPhase as any} 
        gate={currentScrollGate as any} 
      />
      
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => navigate("/scroll-time")}
      >
        {t("dashboard.scrollPhase")}
      </Button>
    </GlassCard>
  );
};
