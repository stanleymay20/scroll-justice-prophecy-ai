
export type LanguageCode = 
  | "en" 
  | "fr" 
  | "es" 
  | "de" 
  | "zh" 
  | "ar" 
  | "hi" 
  | "pt" 
  | "he" 
  | "sw" 
  | "am";

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, ...args: any[]) => string;
  isLoading: boolean;
  reloadTranslations?: () => Promise<void>;
  formatDate?: (date: Date | string, format?: string) => string;
}

export type TranslationsType = {
  [key in LanguageCode]?: Record<string, any>;
};
