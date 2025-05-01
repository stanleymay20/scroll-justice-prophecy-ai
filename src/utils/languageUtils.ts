
import type { LanguageCode } from "@/contexts/LanguageContext";

/**
 * Normalizes browser or system language code to the format used in our application
 * @param languageCode The language code to normalize (e.g., 'en-US', 'fr-FR')
 * @returns Normalized language code (e.g., 'en', 'fr')
 */
export function normalizeLanguageCode(languageCode: string): string {
  // Extract the base language code (e.g., 'en' from 'en-US')
  return languageCode.split('-')[0].toLowerCase();
}

/**
 * Determines if a language requires RTL (Right-to-Left) text direction
 * @param languageCode The language code to check
 * @returns Boolean indicating if the language is RTL
 */
export function isRtlLanguage(languageCode: LanguageCode): boolean {
  const rtlLanguages = ['ar', 'he'];
  return rtlLanguages.includes(languageCode);
}

/**
 * Groups language codes by category
 * @returns Object with grouped languages
 */
export function getLanguageGroups() {
  return {
    primary: ["en", "fr", "es", "de"],
    extended: ["zh", "ar", "hi", "pt"],
    sacred: ["he", "sw", "am"]
  };
}
