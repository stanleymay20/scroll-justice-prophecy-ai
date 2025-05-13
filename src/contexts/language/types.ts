
export type LanguageCode = 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ar' | 'hi' | 'pt' | 'he' | 'sw' | 'am';

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, ...args: any[]) => string;
  isLoading: boolean;
  reloadTranslations: () => Promise<void>;
}

// Update TranslationsType to support nested structures
export type TranslationsType = {
  [lang in LanguageCode]?: {
    [key: string]: string | Record<string, any>;
  };
};
