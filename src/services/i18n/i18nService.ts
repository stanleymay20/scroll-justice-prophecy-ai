
import { LanguageCode } from '@/contexts/language/types';
import fallbackTranslations from '@/contexts/language/translations';

// Function to load translations from public/locales/{lang}/common.json
export const loadTranslations = async (lang: LanguageCode): Promise<Record<string, any>> => {
  try {
    console.info(`Attempting to load translations for ${lang} from /locales/${lang}/common.json`);
    
    // First, try to load the requested language
    const response = await fetch(`/locales/${lang}/common.json`);
    if (!response.ok) {
      console.warn(`Failed to load translations for ${lang} from file system, status: ${response.status}`);
      
      // Fall back to English if requested language loading fails
      if (lang !== 'en') {
        console.info('Falling back to English translations file');
        const fallbackResponse = await fetch(`/locales/en/common.json`);
        if (fallbackResponse.ok) {
          const englishData = await fallbackResponse.json();
          console.info(`Successfully loaded English fallback with ${Object.keys(englishData).length} keys`);
          return englishData;
        }
      }
      
      // If even English file fails, return in-memory fallbacks
      console.info('Using in-memory fallbacks');
      return fallbackTranslations[lang as keyof typeof fallbackTranslations] || fallbackTranslations.en || {};
    }
    
    const data = await response.json();
    console.info(`Successfully loaded ${lang} translations with ${Object.keys(data).length} keys`);
    return data;
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    
    // Try loading English from file system as fallback
    try {
      if (lang !== 'en') {
        const fallbackResponse = await fetch(`/locales/en/common.json`);
        if (fallbackResponse.ok) {
          const englishData = await fallbackResponse.json();
          console.info(`Falling back to English translations after error, loaded ${Object.keys(englishData).length} keys`);
          return englishData;
        }
      }
    } catch (fallbackError) {
      console.error('Failed to load even fallback translations from file:', fallbackError);
    }
    
    // Last resort: return in-memory fallbacks
    return fallbackTranslations[lang as keyof typeof fallbackTranslations] || fallbackTranslations.en || {};
  }
};

// Get a nested key from an object using dot notation
export const getNestedValue = (obj: Record<string, any>, path: string): string => {
  if (!obj || typeof obj !== 'object') {
    return path;
  }

  // Handle dot notation for nested objects
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      // If at any point the path doesn't exist, return the original path
      return path;
    }
  }

  return typeof result === 'string' ? result : path;
};

// Format a translation string with dynamic values
export const formatTranslation = (text: string, args: any[]): string => {
  if (!args || args.length === 0) return text;
  
  try {
    return args.reduce((str, arg, index) => {
      const placeholder = new RegExp(`\\{${index}\\}`, 'g');
      return str.replace(placeholder, String(arg));
    }, text);
  } catch (error) {
    console.error('Error formatting translation:', error);
    return text;
  }
};

// Sync language with localStorage and URL
export const syncLanguageWithRouter = (lang: LanguageCode): void => {
  // Update URL if supported by the router
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());
  } catch (error) {
    console.error('Failed to update URL with language:', error);
  }
};

// Format dates based on the current locale
export const formatDate = (date: Date, lang: LanguageCode, options?: Intl.DateTimeFormatOptions): string => {
  try {
    return new Intl.DateTimeFormat(lang, options).format(date);
  } catch (error) {
    console.error(`Error formatting date for language ${lang}:`, error);
    return date.toLocaleDateString();
  }
};

// Format numbers based on the current locale
export const formatNumber = (num: number, lang: LanguageCode, options?: Intl.NumberFormatOptions): string => {
  try {
    return new Intl.NumberFormat(lang, options).format(num);
  } catch (error) {
    console.error(`Error formatting number for language ${lang}:`, error);
    return num.toString();
  }
};

// Convert nested object to flattened dot notation for translation export
export const flattenTranslations = (obj: Record<string, any>, prefix = ''): Record<string, string> => {
  return Object.keys(obj).reduce((acc: Record<string, string>, key: string) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenTranslations(obj[key], prefixedKey));
    } else {
      acc[prefixedKey] = String(obj[key]);
    }
    
    return acc;
  }, {});
};

// Create a translation object from flattened dot notation
export const unflattenTranslations = (flat: Record<string, string>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  for (const key in flat) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (i === keys.length - 1) {
        current[k] = flat[key];
      } else {
        current[k] = current[k] || {};
        current = current[k];
      }
    }
  }
  
  return result;
};

// Compare two translation objects to find missing keys
export const findMissingTranslationKeys = (
  source: Record<string, any>, 
  target: Record<string, any>
): string[] => {
  const flatSource = flattenTranslations(source);
  const flatTarget = flattenTranslations(target);
  
  return Object.keys(flatSource).filter(key => !flatTarget[key]);
};

// Merge translations with fallback for missing keys
export const mergeWithFallback = (
  target: Record<string, any>,
  fallback: Record<string, any>
): Record<string, any> => {
  if (!target || Object.keys(target).length === 0) {
    return fallback || {};
  }
  
  if (!fallback || Object.keys(fallback).length === 0) {
    return target || {};
  }
  
  try {
    // First try to merge flattened versions
    const flatTarget = flattenTranslations(target);
    const flatFallback = flattenTranslations(fallback);
    
    // Add missing keys from fallback
    Object.keys(flatFallback).forEach(key => {
      if (!flatTarget[key]) {
        flatTarget[key] = flatFallback[key];
      }
    });
    
    // Convert back to nested structure
    return unflattenTranslations(flatTarget);
  } catch (error) {
    console.error('Error merging translations with fallback:', error);
    // If the merge fails, return target with fallback as the backup
    return { ...fallback, ...target };
  }
};
