
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language";

export const CTASection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-br from-justice-dark to-black">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          {t("landing.cta.title")}
        </h2>
        <p className="mt-4 text-lg text-justice-light">
          {t("landing.cta.description")}
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Button size="lg" onClick={() => navigate("/signup")}>
            {t("button.register")}
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/subscription/plans")}>
            {t("landing.cta.viewPlans")}
          </Button>
        </div>
      </div>
    </div>
  );
};
