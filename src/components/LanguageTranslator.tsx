
import { useLanguage } from "@/contexts/language";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useState } from "react";
import { getLanguageDisplayName } from "@/utils/languageUtils";
import { LanguageCode } from "@/contexts/language";
import { Globe, ExternalLink } from "lucide-react";

type TranslationEntry = {
  key: string;
  en: string;
  translation: string;
  path: string[];
};

export function LanguageTranslator() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<"view" | "add">("view");
  
  // Sample translations for demonstration
  const commonTranslations: TranslationEntry[] = [
    { key: "app.title", en: "ScrollJustice.AI", translation: t("app.title"), path: ["app", "title"] },
    { key: "app.tagline", en: "Sacred justice through digital scrolls", translation: t("app.tagline"), path: ["app", "tagline"] },
    { key: "nav.signin", en: "Sign In", translation: t("nav.signin"), path: ["nav", "signin"] },
    { key: "nav.precedent", en: "Sacred Precedents", translation: t("nav.precedent"), path: ["nav", "precedent"] },
    { key: "button.register", en: "Register", translation: t("button.register"), path: ["button", "register"] },
    { key: "language.select", en: "Select Language", translation: t("language.select"), path: ["language", "select"] },
    { key: "language.extended", en: "Extended Languages", translation: t("language.extended"), path: ["language", "extended"] },
    { key: "language.sacred", en: "Sacred Languages", translation: t("language.sacred"), path: ["language", "sacred"] }
  ];

  // Get current language display name
  const currentLanguageName = getLanguageDisplayName(language as LanguageCode);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>Translation Helper</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <span>Language Translations</span>
            <span className="px-2 py-1 ml-2 text-sm bg-justice-primary/20 rounded-md">
              {currentLanguageName} ({language})
            </span>
          </DialogTitle>
          <DialogDescription>
            View and manage translations for the current language.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as "view" | "add")} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="view">View Translations</TabsTrigger>
            <TabsTrigger value="add">Add Translations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="space-y-4">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-justice-dark">
                  <tr>
                    <th className="text-left p-2 border-b">Key</th>
                    <th className="text-left p-2 border-b">English</th>
                    <th className="text-left p-2 border-b">Translation ({language})</th>
                  </tr>
                </thead>
                <tbody>
                  {commonTranslations.map((item) => (
                    <tr key={item.key} className="border-b last:border-0 hover:bg-justice-dark/10">
                      <td className="p-2 font-mono text-sm text-justice-primary">{item.key}</td>
                      <td className="p-2">{item.en}</td>
                      <td className="p-2 font-medium">{item.translation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>These translations are loaded from locale files in <code>public/locales/{language}/common.json</code></p>
            </div>
          </TabsContent>
          
          <TabsContent value="add" className="space-y-4">
            <div className="rounded-md border p-4 bg-justice-dark/10">
              <h3 className="font-medium mb-2">How to Add New Translations</h3>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Add new translation keys to <code>src/contexts/language/translations.ts</code></li>
                <li>Update JSON files in <code>public/locales/{language}/common.json</code></li>
                <li>Use the translation in your component with <code>const {"{ t }"} = useLanguage();</code></li>
              </ol>
              
              <div className="mt-4">
                <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <ExternalLink className="h-4 w-4" />
                  <span>View Documentation</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
