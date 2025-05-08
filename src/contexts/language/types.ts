
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
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, ...args: any[]) => string;
  availableLanguages: LanguageCode[];
  rtl: boolean;
  isLoading: boolean;
  reloadTranslations?: () => Promise<void>;
}
