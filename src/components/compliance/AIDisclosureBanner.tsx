
import { useState, useEffect } from "react";
import { X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/language";

export interface AIDisclosureBannerProps {
  alwaysShow?: boolean;
}

export const AIDisclosureBanner = ({ alwaysShow = false }: AIDisclosureBannerProps) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(alwaysShow);
  
  useEffect(() => {
    if (alwaysShow) return;
    
    // Show banner if user hasn't dismissed it before
    const hasDismissed = localStorage.getItem("ai-disclosure-dismissed") === "true";
    setIsVisible(!hasDismissed);
  }, [alwaysShow]);
  
  const handleDismiss = () => {
    if (!alwaysShow) {
      localStorage.setItem("ai-disclosure-dismissed", "true");
    }
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <Alert className="bg-justice-tertiary/10 border border-justice-tertiary mb-4 relative">
      <div className="flex items-start gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-justice-tertiary" />
          <AlertDescription className="text-sm text-justice-light">
            {t("ai.disclosure.banner")} {" "}
            <Link 
              to="/policy/ai-usage" 
              className="underline text-justice-tertiary hover:text-justice-tertiary/80"
            >
              {t("ai.disclosure.learnMore")}
            </Link>
          </AlertDescription>
        </div>
        
        {!alwaysShow && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 rounded-full"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t("common.dismiss")}</span>
          </Button>
        )}
      </div>
    </Alert>
  );
};
