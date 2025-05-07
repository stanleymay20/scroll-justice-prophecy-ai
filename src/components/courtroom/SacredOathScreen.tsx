
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language";

interface SacredOathScreenProps {
  onComplete: () => void;
}

export const SacredOathScreen: React.FC<SacredOathScreenProps> = ({ onComplete }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="max-w-2xl p-8 bg-black/60 border border-justice-gold rounded-lg shadow-lg text-center space-y-6">
        <h2 className="text-2xl font-bold text-justice-gold">
          {t("oath.title")}
        </h2>
        
        <div className="space-y-4 text-justice-light py-4">
          <p>{t("oath.premise")}</p>
          <p>{t("oath.body1")}</p>
          <p>{t("oath.body2")}</p>
          <p>{t("oath.body3")}</p>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={onComplete} 
            className="bg-justice-gold hover:bg-justice-gold/90 text-black"
          >
            {t("oath.swear")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SacredOathScreen;
