
import { useNavigate } from "react-router-dom";
import { Shield, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { useLanguage } from "@/contexts/language";

export const CTASection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="bg-justice-dark/50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              {t("landing.cta.title")}
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-justice-light">
              {t("landing.cta.description")}
            </p>
            <div className="mt-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-justice-primary" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-white">{t("landing.cta.secure")}</h3>
                  <p className="mt-2 text-justice-light/80">
                    {t("landing.cta.secureDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-center mt-6">
                <div className="flex-shrink-0">
                  <ScrollText className="h-6 w-6 text-justice-primary" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-white">{t("landing.cta.knowledge")}</h3>
                  <p className="mt-2 text-justice-light/80">
                    {t("landing.cta.knowledgeDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">{t("landing.cta.experience")}</h3>
              <p className="text-justice-light/80 mb-6">
                {t("landing.cta.experienceDesc")}
              </p>
              <Button 
                className="w-full" 
                onClick={() => navigate("/subscription/plans")}
              >
                {t("landing.cta.viewPlans")}
              </Button>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};
