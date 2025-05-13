
export type LanguageCode = 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ar' | 'hi' | 'pt' | 'he' | 'sw' | 'am';

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, ...args: any[]) => string;
  isLoading: boolean;
  reloadTranslations: () => Promise<void>;
  formatDate?: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber?: (num: number, options?: Intl.NumberFormatOptions) => string;
  isRtl?: boolean;
  getLanguageName?: (code: LanguageCode) => string;
}

// Update TranslationsType to support nested structures
export type TranslationsType = {
  [lang in LanguageCode]?: {
    [key: string]: string | Record<string, any>;
  };
};
