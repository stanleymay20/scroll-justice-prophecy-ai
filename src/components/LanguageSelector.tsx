
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">{t("nav.language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-justice-dark border-justice-light/20">
        <DropdownMenuItem 
          onClick={() => setLanguage("en")}
          className={language === "en" ? "bg-justice-primary/20" : ""}
        >
          🇬🇧 English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("fr")}
          className={language === "fr" ? "bg-justice-primary/20" : ""}
        >
          🇫🇷 Français
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("es")}
          className={language === "es" ? "bg-justice-primary/20" : ""}
        >
          🇪🇸 Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
