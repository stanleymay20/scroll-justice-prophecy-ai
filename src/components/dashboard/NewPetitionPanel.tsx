
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { useLanguage } from "@/contexts/language";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";

export const NewPetitionPanel = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <GlassCard className="p-6 border-justice-primary/30">
      <h2 className="text-xl font-semibold text-white mb-4">{t("dashboard.newPetition")}</h2>
      <p className="text-justice-light/80 mb-4">
        {t("dashboard.petitionDescription")}
      </p>
      <Button 
        className="w-full bg-justice-tertiary hover:bg-justice-tertiary/80 relative"
        onClick={() => navigate("/courtroom")}
      >
        {t("dashboard.newPetition")}
        <div className="absolute -top-1 -right-1">
          <PulseEffect color="bg-justice-primary" />
        </div>
      </Button>
    </GlassCard>
  );
};
