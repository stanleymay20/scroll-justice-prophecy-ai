
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

// Helper function to get the browser language and normalize it
export const getBrowserLanguage = (): LanguageCode => {
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
  const normalizedLang = normalizeLanguageCode(browserLang);
  
  // Make sure the language is supported, default to 'en' if not
  const supportedLanguages = [
    ...getLanguageGroups().primary,
    ...getLanguageGroups().extended,
    ...getLanguageGroups().sacred
  ];
  
  return supportedLanguages.includes(normalizedLang) ? normalizedLang as LanguageCode : 'en';
};

// Get language display name
export const getLanguageDisplayName = (code: LanguageCode): string => {
  const languageNames: Record<string, string> = {
    'en': 'English',
    'fr': 'Français',
    'es': 'Español',
    'de': 'Deutsch',
    'zh': '中文',
    'ar': 'العربية',
    'hi': 'हिन्दी',
    'pt': 'Português',
    'he': 'עברית',
    'sw': 'Kiswahili',
    'am': 'አማርኛ'
  };
  
  return languageNames[code] || code;
};

// Apply language direction to document
export const applyLanguageDirection = (code: LanguageCode): void => {
  document.documentElement.dir = isRtlLanguage(code) ? 'rtl' : 'ltr';
  document.documentElement.lang = code;
};

// Save language preference to localStorage
export const saveLanguagePreference = (code: LanguageCode): void => {
  try {
    localStorage.setItem('preferredLanguage', code);
  } catch (error) {
    console.error('Failed to save language preference:', error);
  }
};

// Get saved language preference from localStorage
export const getSavedLanguagePreference = (): LanguageCode | null => {
  try {
    return localStorage.getItem('preferredLanguage') as LanguageCode;
  } catch (error) {
    console.error('Failed to get saved language preference:', error);
    return null;
  }
};
