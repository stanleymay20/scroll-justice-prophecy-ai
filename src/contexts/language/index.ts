
import { useLanguage } from './useLanguage';
import { LanguageProvider } from './LanguageProvider';

// Define the context type with required properties
export interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, ...args: any[]) => string;
  availableLanguages: string[];
  reloadTranslations: () => Promise<void>;
}

export { useLanguage, LanguageProvider };
export type { LanguageContextType };
