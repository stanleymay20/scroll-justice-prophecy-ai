
import { LanguageCode } from '@/contexts/language/types';

// Function to load translations from public/locales/{lang}/common.json
export const loadTranslations = async (lang: LanguageCode): Promise<Record<string, any>> => {
  try {
    // First, try to load the requested language
    const response = await fetch(`/locales/${lang}/common.json`);
    if (!response.ok) {
      console.error(`Failed to load translations for ${lang}`);
      // Fall back to English if requested language loading fails
      const fallbackResponse = await fetch(`/locales/en/common.json`);
      if (fallbackResponse.ok) {
        console.log(`Falling back to English translations for ${lang}`);
        return await fallbackResponse.json();
      }
      // If even English fails, return empty object
      return {};
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    // Try loading English as fallback
    try {
      const fallbackResponse = await fetch(`/locales/en/common.json`);
      if (fallbackResponse.ok) {
        console.log(`Falling back to English translations after error for ${lang}`);
        return await fallbackResponse.json();
      }
    } catch (fallbackError) {
      console.error('Failed to load even fallback translations:', fallbackError);
    }
    return {};
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
  
  return args.reduce((str, arg, index) => {
    const placeholder = new RegExp(`\\{${index}\\}`, 'g');
    return str.replace(placeholder, String(arg));
  }, text);
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
  return new Intl.DateTimeFormat(lang, options).format(date);
};

// Format numbers based on the current locale
export const formatNumber = (num: number, lang: LanguageCode, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat(lang, options).format(num);
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
  const merged = { ...target };
  const flatTarget = flattenTranslations(target);
  const flatFallback = flattenTranslations(fallback);
  
  // Add missing keys from fallback
  Object.keys(flatFallback).forEach(key => {
    if (!flatTarget[key]) {
      const keys = key.split('.');
      let current = merged;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        current[k] = current[k] || {};
        current = current[k];
      }
      
      current[keys[keys.length - 1]] = flatFallback[key];
    }
  });
  
  return merged;
};
