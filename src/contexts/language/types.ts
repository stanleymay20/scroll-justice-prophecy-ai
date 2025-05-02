
// Define language codes as string literal types
export type LanguageCode = 
  | "en" | "fr" | "es" | "de"  // Primary
  | "zh" | "ar" | "hi" | "pt"  // Extended
  | "he" | "sw" | "am";        // Sacred

export type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, ...args: any[]) => string;
  isLoading?: boolean;
};

export type TranslationsType = Record<string, Record<string, string>>;

export interface LanguageMetadata {
  code: LanguageCode;
  name: string;
  flag: string;
  group: 'primary' | 'extended' | 'sacred';
}

export type LanguageGroups = {
  primary: LanguageCode[];
  extended: LanguageCode[];
  sacred: LanguageCode[];
};
