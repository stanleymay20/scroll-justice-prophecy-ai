
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { ScrollText, Shield, Scale, Gavel } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";

export const QuickActionsPanel = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-semibold text-white mb-4">{t("dashboard.quickActions")}</h2>
      <div className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => navigate("/document-upload")}
        >
          <ScrollText className="mr-2 h-4 w-4" />
          {t("dashboard.uploadEvidence")}
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start relative"
          onClick={() => navigate("/community")}
        >
          <Shield className="mr-2 h-4 w-4" />
          {t("dashboard.communityForum")}
          <div className="absolute top-1 right-2">
            <PulseEffect size="sm" color="bg-justice-tertiary" />
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => navigate("/principles")}
        >
          <Scale className="mr-2 h-4 w-4" />
          {t("dashboard.sacredPrinciples")}
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => navigate("/admin/mcp")}
        >
          <Gavel className="mr-2 h-4 w-4" />
          {t("dashboard.masterControlPanel")}
        </Button>
      </div>
    </GlassCard>
  );
};
