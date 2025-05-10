
import type { LanguageCode } from "@/contexts/language/types";

// Normalize language codes (e.g., 'en-US' -> 'en')
export const normalizeLanguageCode = (code: string): string => {
  try {
    if (!code) return '';
    return code.split('-')[0].toLowerCase();
  } catch (error) {
    console.error("Error normalizing language code:", error);
    return '';
  }
};

// Check if a language uses RTL writing
export const isRtlLanguage = (code: LanguageCode): boolean => {
  try {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'ps'];
    return rtlLanguages.includes(code);
  } catch (error) {
    console.error("Error checking RTL language:", error);
    return false;
  }
};

// Group languages by category for UI organization
export const getLanguageGroups = () => {
  try {
    return {
      primary: ["en", "fr", "es", "de"],
      extended: ["zh", "ar", "hi", "pt"],
      sacred: ["he", "sw", "am"]
    };
  } catch (error) {
    console.error("Error getting language groups:", error);
    return { primary: ["en"], extended: [], sacred: [] };
  }
};

// Get all supported languages
export const getSupportedLanguages = (): LanguageCode[] => {
  try {
    const groups = getLanguageGroups();
    return [
      ...groups.primary,
      ...groups.extended,
      ...groups.sacred
    ] as LanguageCode[];
  } catch (error) {
    console.error("Error getting supported languages:", error);
    return ["en"] as LanguageCode[];
  }
};

// Helper function to get the browser language and normalize it
export const getBrowserLanguage = (): LanguageCode => {
  try {
    const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
    const normalizedLang = normalizeLanguageCode(browserLang);
    
    // Make sure the language is supported, default to 'en' if not
    const supportedLanguages = getSupportedLanguages();
    
    return supportedLanguages.includes(normalizedLang as LanguageCode) ? normalizedLang as LanguageCode : 'en';
  } catch (error) {
    console.error("Error getting browser language:", error);
    return 'en';
  }
};

// Get language display name
export const getLanguageDisplayName = (code: LanguageCode): string => {
  try {
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
  } catch (error) {
    console.error("Error getting language display name:", error);
    return code;
  }
};

// Apply language direction to document
export const applyLanguageDirection = (code: LanguageCode): void => {
  try {
    document.documentElement.dir = isRtlLanguage(code) ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
    
    // Add a data attribute for CSS targeting
    document.documentElement.setAttribute('data-language', code);
    
    // Apply RTL class to body for easier styling
    if (isRtlLanguage(code)) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }

    // Add specific font families for languages like Arabic, Hebrew, Chinese
    switch (code) {
      case 'ar':
        document.documentElement.style.setProperty('--font-family', '"Amiri", "Noto Sans Arabic", sans-serif');
        break;
      case 'he':
        document.documentElement.style.setProperty('--font-family', '"Frank Ruhl Libre", "Noto Sans Hebrew", sans-serif');
        break;
      case 'zh':
        document.documentElement.style.setProperty('--font-family', '"Noto Sans SC", sans-serif');
        break;
      case 'hi':
        document.documentElement.style.setProperty('--font-family', '"Noto Sans Devanagari", sans-serif');
        break;
      case 'am':
        document.documentElement.style.setProperty('--font-family', '"Noto Sans Ethiopic", sans-serif');
        break;
      default:
        document.documentElement.style.setProperty('--font-family', 'system-ui, sans-serif');
    }
  } catch (error) {
    console.error("Error applying language direction:", error);
  }
};

// Save language preference to localStorage with consistent key
export const saveLanguagePreference = (code: LanguageCode): void => {
  try {
    localStorage.setItem('scrollJustice-language', code);
    console.log(`Language preference saved: ${code}`);
  } catch (error) {
    console.error('Failed to save language preference:', error);
  }
};

// Get saved language preference from localStorage with consistent key
export const getSavedLanguagePreference = (): LanguageCode | null => {
  try {
    const saved = localStorage.getItem('scrollJustice-language');
    if (saved && getSupportedLanguages().includes(saved as LanguageCode)) {
      console.log(`Saved language preference found: ${saved}`);
      return saved as LanguageCode;
    }
    return null;
  } catch (error) {
    console.error('Failed to get saved language preference:', error);
    return null;
  }
};

// Check if a language is available as a full translation
export const isLanguageFullyTranslated = async (code: LanguageCode): Promise<boolean> => {
  try {
    const response = await fetch(`/locales/${code}/common.json`);
    return response.ok;
  } catch (error) {
    console.error(`Error checking translation for ${code}:`, error);
    return false;
  }
};

// Get the completion percentage of a translation compared to English
export const getTranslationCompleteness = async (code: LanguageCode): Promise<number> => {
  try {
    // Load English as the reference
    const enResponse = await fetch('/locales/en/common.json');
    if (!enResponse.ok) return 0;
    const enTranslations = await enResponse.json();
    
    // Load the target language
    const langResponse = await fetch(`/locales/${code}/common.json`);
    if (!langResponse.ok) return 0;
    const langTranslations = await langResponse.json();
    
    // Flatten both translation objects
    const flattenTranslations = (obj: Record<string, any>, prefix = ''): string[] => {
      return Object.keys(obj).reduce((acc: string[], key: string) => {
        const prefixedKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          return [...acc, ...flattenTranslations(obj[key], prefixedKey)];
        }
        return [...acc, prefixedKey];
      }, []);
    };
    
    const enKeys = flattenTranslations(enTranslations);
    const langKeys = flattenTranslations(langTranslations);
    
    return (langKeys.length / enKeys.length) * 100;
  } catch (error) {
    console.error(`Error calculating completion for ${code}:`, error);
    return 0;
  }
};
