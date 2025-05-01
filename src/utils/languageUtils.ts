
import type { LanguageCode } from "@/contexts/LanguageContext";

// Normalize language codes (e.g., 'en-US' -> 'en')
export const normalizeLanguageCode = (code: string): string => {
  return code.split('-')[0].toLowerCase();
};

// Check if a language uses RTL writing
export const isRtlLanguage = (code: LanguageCode): boolean => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'ps'];
  return rtlLanguages.includes(code);
};

// Group languages by category for UI organization
export const getLanguageGroups = () => {
  return {
    primary: ["en", "fr", "es", "de"],
    extended: ["zh", "ar", "hi", "pt"],
    sacred: ["he", "sw", "am"]
  };
};
