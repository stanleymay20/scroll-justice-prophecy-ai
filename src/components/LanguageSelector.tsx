
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language";
import { Globe } from "lucide-react";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";
import type { LanguageCode } from "@/contexts/language";
import { getLanguageGroups, getLanguageDisplayName } from "@/utils/languageUtils";
import { LanguageGroup, LanguageItem } from "./language/LanguageGroup";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const languageGroups = getLanguageGroups();

  // Generate the language list with metadata
  const allLanguages: LanguageItem[] = [
    // Primary languages
    { code: "en" as LanguageCode, name: getLanguageDisplayName("en"), flag: "🇬🇧", group: "primary" },
    { code: "fr" as LanguageCode, name: getLanguageDisplayName("fr"), flag: "🇫🇷", group: "primary" },
    { code: "es" as LanguageCode, name: getLanguageDisplayName("es"), flag: "🇪🇸", group: "primary" },
    { code: "de" as LanguageCode, name: getLanguageDisplayName("de"), flag: "🇩🇪", group: "primary" },
    
    // Extended languages
    { code: "zh" as LanguageCode, name: getLanguageDisplayName("zh"), flag: "🇨🇳", group: "extended" },
    { code: "ar" as LanguageCode, name: getLanguageDisplayName("ar"), flag: "🇸🇦", group: "extended" },
    { code: "hi" as LanguageCode, name: getLanguageDisplayName("hi"), flag: "🇮🇳", group: "extended" },
    { code: "pt" as LanguageCode, name: getLanguageDisplayName("pt"), flag: "🇧🇷", group: "extended" },
    
    // Sacred languages
    { code: "he" as LanguageCode, name: getLanguageDisplayName("he"), flag: "🇮🇱", group: "sacred" },
    { code: "sw" as LanguageCode, name: getLanguageDisplayName("sw"), flag: "🇰🇪", group: "sacred" },
    { code: "am" as LanguageCode, name: getLanguageDisplayName("am"), flag: "🇪🇹", group: "sacred" },
  ];

  const handleLanguageChange = (lang: LanguageCode) => {
    console.log("Changing language to:", lang);
    try {
      setLanguage(lang);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  // Group languages by category
  const primaryLanguages = allLanguages.filter(lang => lang.group === 'primary');
  const extendedLanguages = allLanguages.filter(lang => lang.group === 'extended');
  const sacredLanguages = allLanguages.filter(lang => lang.group === 'sacred');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">{t("nav.language")}</span>
          {language !== "en" && (
            <PulseEffect size="sm" color="bg-justice-tertiary" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-justice-dark border-justice-light/20">
        <LanguageGroup
          title={t("language.select")}
          languages={primaryLanguages}
          currentLanguage={language}
          onLanguageSelect={handleLanguageChange}
        />
        
        <DropdownMenuSeparator className="bg-justice-light/10" />
        
        <LanguageGroup
          title={t("language.extended")}
          languages={extendedLanguages}
          currentLanguage={language}
          onLanguageSelect={handleLanguageChange}
        />
        
        <DropdownMenuSeparator className="bg-justice-light/10" />
        
        <LanguageGroup
          title={t("language.sacred")}
          languages={sacredLanguages}
          currentLanguage={language}
          onLanguageSelect={handleLanguageChange}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
