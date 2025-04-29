
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" }
  ];

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
        {languages.map(lang => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => setLanguage(lang.code as "en" | "fr" | "es")}
            className={`flex items-center gap-2 ${language === lang.code ? "bg-justice-primary/20" : ""}`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
            {language === lang.code && (
              <span className="ml-auto text-justice-primary text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
