
export type LanguageCode = 
  | "en" // English
  | "es" // Spanish
  | "fr" // French
  | "de" // German
  | "zh" // Chinese
  | "ar" // Arabic
  | "hi" // Hindi
  | "pt" // Portuguese
  | "sw" // Swahili
  | "he" // Hebrew
  | "am"; // Amharic

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
