
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
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  // Expanded language list with additional metadata
  const languages = [
    // Main languages
    { code: "en", name: "English", flag: "🇬🇧", group: "primary" },
    { code: "fr", name: "Français", flag: "🇫🇷", group: "primary" },
    { code: "es", name: "Español", flag: "🇪🇸", group: "primary" },
    { code: "de", name: "Deutsch", flag: "🇩🇪", group: "primary" },
    
    // Extended languages
    { code: "zh", name: "中文", flag: "🇨🇳", group: "extended" },
    { code: "ar", name: "العربية", flag: "🇸🇦", group: "extended" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳", group: "extended" },
    { code: "pt", name: "Português", flag: "🇧🇷", group: "extended" },
    
    // Sacred languages
    { code: "he", name: "עברית", flag: "🕮", group: "sacred" },
    { code: "sw", name: "Kiswahili", flag: "🇰🇪", group: "sacred" },
    { code: "am", name: "አማርኛ", flag: "🇪🇹", group: "sacred" },
  ];

  const handleLanguageChange = (lang: string) => {
    console.log("Changing language to:", lang);
    setLanguage(lang as any); // Using 'as any' for now, we'll improve the typing in LanguageContext
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
