
/**
 * Available language codes for the application
 */
export type LanguageCode = 
  | "en" 
  | "es" 
  | "fr" 
  | "de" 
  | "zh" 
  | "ar" 
  | "pt" 
  | "hi" 
  | "sw" 
  | "am" 
  | "he";

/**
 * Language context types
 */
export interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, ...args: any[]) => string;
  availableLanguages: string[];
  reloadTranslations: () => Promise<void>;
}
