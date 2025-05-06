
// Language codes supported by the application
export type LanguageCode = 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ar' | 'pt' | 'hi' | 'sw' | 'he' | 'am';

// Interface for the Language Provider values
export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, ...args: any[]) => string;
  rtl: boolean;
  isLoading: boolean;
  reloadTranslations?: () => Promise<void>;
}
