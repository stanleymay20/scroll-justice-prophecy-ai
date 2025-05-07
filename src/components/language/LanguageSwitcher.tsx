
import React, { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { LanguageCode } from "@/contexts/language/types";
import { getLanguageDisplayName, isRtlLanguage } from "@/utils/languageUtils";
import { LanguageGroup } from "./LanguageGroup";
import { LanguageItem } from "./LanguageGroup";
import { cn } from "@/lib/utils";

export interface LanguageSwitcherProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  showFlags?: boolean;
  showLabel?: boolean;
  className?: string;
}

export const LanguageSwitcher = ({
  variant = "outline",
  size = "default",
  showFlags = true,
  showLabel = true,
  className
}: LanguageSwitcherProps) => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  // Language data with flags and groups
  const languages: LanguageItem[] = [
    { code: "en" as LanguageCode, name: "English", flag: "🇺🇸", group: "primary" },
    { code: "fr" as LanguageCode, name: "Français", flag: "🇫🇷", group: "primary" },
    { code: "es" as LanguageCode, name: "Español", flag: "🇪🇸", group: "primary" },
    { code: "de" as LanguageCode, name: "Deutsch", flag: "🇩🇪", group: "primary" },
    { code: "zh" as LanguageCode, name: "中文", flag: "🇨🇳", group: "extended" },
    { code: "ar" as LanguageCode, name: "العربية", flag: "🇦🇪", group: "extended" },
    { code: "pt" as LanguageCode, name: "Português", flag: "🇵🇹", group: "extended" },
    { code: "hi" as LanguageCode, name: "हिन्दी", flag: "🇮🇳", group: "extended" },
    { code: "sw" as LanguageCode, name: "Kiswahili", flag: "🇹🇿", group: "sacred" },
    { code: "he" as LanguageCode, name: "עברית", flag: "🇮🇱", group: "sacred" },
    { code: "am" as LanguageCode, name: "አማርኛ", flag: "🇪🇹", group: "sacred" },
  ];

  const primaryLanguages = languages.filter(lang => lang.group === "primary");
  const extendedLanguages = languages.filter(lang => lang.group === "extended");
  const sacredLanguages = languages.filter(lang => lang.group === "sacred");

  const currentLanguage = languages.find(lang => lang.code === language);
  
  const handleLanguageSelect = (code: LanguageCode) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={cn(
            "flex items-center gap-2", 
            isRtlLanguage(language as LanguageCode) && "flex-row-reverse",
            className
          )}
        >
          {showFlags && currentLanguage && (
            <span className="text-base">{currentLanguage.flag}</span>
          )}
          {showLabel && (
            <span>
              {size === "sm" ? currentLanguage?.code.toUpperCase() : getLanguageDisplayName(language as LanguageCode)}
            </span>
          )}
          {!showFlags && !showLabel && <Globe className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
        <LanguageGroup 
          title={t("language.select")} 
          languages={primaryLanguages} 
          currentLanguage={language as LanguageCode}
          onLanguageSelect={handleLanguageSelect}
        />
        
        <DropdownMenuSeparator />
        
        <LanguageGroup 
          title={t("language.extended")} 
          languages={extendedLanguages}
          currentLanguage={language as LanguageCode}
          onLanguageSelect={handleLanguageSelect}
        />
        
        <DropdownMenuSeparator />
        
        <LanguageGroup 
          title={t("language.sacred")} 
          languages={sacredLanguages}
          currentLanguage={language as LanguageCode}
          onLanguageSelect={handleLanguageSelect}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
