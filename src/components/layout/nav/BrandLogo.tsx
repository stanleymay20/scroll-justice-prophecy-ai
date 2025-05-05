
import React from "react";
import { Link } from "react-router-dom";
import { ScrollText } from "lucide-react";
import { useLanguage } from "@/contexts/language";

export const BrandLogo = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/" className="flex items-center">
      <div className="mr-2 relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-justice-primary to-justice-tertiary flex items-center justify-center">
          <ScrollText className="h-4 w-4 text-white" />
          <div className="absolute inset-0 rounded-full border border-justice-primary/50 animate-pulse"></div>
        </div>
      </div>
      <span className="text-xl font-bold text-white hidden sm:block">
        {t("app.title")}
      </span>
    </Link>
  );
};
