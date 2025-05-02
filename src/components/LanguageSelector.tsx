
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language";
import { Globe } from "lucide-react";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";
import type { LanguageCode } from "@/contexts/language";
import { getLanguageGroups, getLanguageDisplayName } from "@/utils/languageUtils";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const languageGroups = getLanguageGroups();

  // Expanded language list with additional metadata
  const languages = [
    // Main languages
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
    { code: "he" as LanguageCode, name: getLanguageDisplayName("he"), flag: "🕮", group: "sacred" },
    { code: "sw" as LanguageCode, name: getLanguageDisplayName("sw"), flag: "🇰🇪", group: "sacred" },
    { code: "am" as LanguageCode, name: getLanguageDisplayName("am"), flag: "🇪🇹", group: "sacred" },
  ];

  const handleLanguageChange = (lang: LanguageCode) => {
    console.log("Changing language to:", lang);
    setLanguage(lang);
  };

  // Group languages by category
  const primaryLanguages = languages.filter(lang => lang.group === 'primary');
  const extendedLanguages = languages.filter(lang => lang.group === 'extended');
  const sacredLanguages = languages.filter(lang => lang.group === 'sacred');

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
        <DropdownMenuLabel className="text-justice-light/70">
          {t("language.select")}
        </DropdownMenuLabel>
        
        <DropdownMenuGroup>
          {primaryLanguages.map(lang => (
            <DropdownMenuItem 
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center gap-2 ${language === lang.code ? "bg-justice-primary/20" : ""}`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-justice-primary text-xs">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="bg-justice-light/10" />
        <DropdownMenuLabel className="text-justice-light/70">
          {t("language.extended")}
        </DropdownMenuLabel>
        
        <DropdownMenuGroup>
          {extendedLanguages.map(lang => (
            <DropdownMenuItem 
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center gap-2 ${language === lang.code ? "bg-justice-primary/20" : ""}`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-justice-primary text-xs">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="bg-justice-light/10" />
        <DropdownMenuLabel className="text-justice-light/70">
          {t("language.sacred")}
        </DropdownMenuLabel>
        
        <DropdownMenuGroup>
          {sacredLanguages.map(lang => (
            <DropdownMenuItem 
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center gap-2 ${language === lang.code ? "bg-justice-primary/20" : ""}`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-justice-primary text-xs">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
