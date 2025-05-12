
import { LanguageCode } from '@/contexts/language/types';

// Function to load translations from public/locales/{lang}/common.json
export const loadTranslations = async (lang: LanguageCode): Promise<Record<string, any>> => {
  try {
    if (!lang || typeof fetch === 'undefined') {
      return {};
    }
    
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
      if (typeof fetch === 'undefined') {
        return {};
      }
      
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
export const getNestedValue = (obj: Record<string, any> | null | undefined, path: string): string => {
  try {
    if (!obj || typeof obj !== 'object' || !path) {
      return path || '';
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
  } catch (error) {
    console.error(`Error getting nested value for path ${path}:`, error);
    return path || '';
  }
};

// Format a translation string with dynamic values
export const formatTranslation = (text: string, args: any[]): string => {
  try {
    if (!text) return '';
    if (!args || !Array.isArray(args) || args.length === 0) return text;
    
    return args.reduce((str, arg, index) => {
      if (str === null || str === undefined) return '';
      
      try {
        const placeholder = new RegExp(`\\{${index}\\}`, 'g');
        return str.replace(placeholder, String(arg || ''));
      } catch (err) {
        return str;
      }
    }, text);
  } catch (error) {
    console.error(`Error formatting translation for "${text}":`, error);
    return text || '';
  }
};

// Sync language with localStorage and URL
export const syncLanguageWithRouter = (lang: LanguageCode): void => {
  try {
    if (typeof window === 'undefined' || !lang) return;
    
    // Update URL if supported by the router
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
    if (!date || !lang) return '';
    
    return new Intl.DateTimeFormat(lang, options).format(date);
  } catch (error) {
    console.error(`Error formatting date for language ${lang}:`, error);
    return date.toISOString();
  }
};

// Format numbers based on the current locale
export const formatNumber = (num: number, lang: LanguageCode, options?: Intl.NumberFormatOptions): string => {
  try {
    if (num === null || num === undefined) return '0';
    if (!lang) return num.toString();
    
    return new Intl.NumberFormat(lang, options).format(num);
  } catch (error) {
    console.error(`Error formatting number for language ${lang}:`, error);
    return num.toString();
  }
};

// Convert nested object to flattened dot notation for translation export
export const flattenTranslations = (obj: Record<string, any>, prefix = ''): Record<string, string> => {
  try {
    if (!obj || typeof obj !== 'object') return {};
    
    return Object.keys(obj).reduce((acc: Record<string, string>, key: string) => {
      const prefixedKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(acc, flattenTranslations(obj[key], prefixedKey));
      } else {
        acc[prefixedKey] = String(obj[key] || '');
      }
      
      return acc;
    }, {});
  } catch (error) {
    console.error("Error flattening translations:", error);
    return {};
  }
};

// Create a translation object from flattened dot notation
export const unflattenTranslations = (flat: Record<string, string>): Record<string, any> => {
  try {
    if (!flat || typeof flat !== 'object') return {};
    
    const result: Record<string, any> = {};
    
    for (const key in flat) {
      if (!key) continue;
      
      const keys = key.split('.');
      let current = result;
      
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (!k) continue;
        
        if (i === keys.length - 1) {
          current[k] = flat[key];
        } else {
          current[k] = current[k] || {};
          current = current[k];
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error("Error unflattening translations:", error);
    return {};
  }
};

// Compare two translation objects to find missing keys
export const findMissingTranslationKeys = (
  source: Record<string, any>, 
  target: Record<string, any>
): string[] => {
  try {
    if (!source || !target) return [];
    
    const flatSource = flattenTranslations(source);
    const flatTarget = flattenTranslations(target);
    
    return Object.keys(flatSource).filter(key => !flatTarget[key]);
  } catch (error) {
    console.error("Error finding missing translation keys:", error);
    return [];
  }
};

// Merge translations with fallback for missing keys
export const mergeWithFallback = (
  target: Record<string, any>,
  fallback: Record<string, any>
): Record<string, any> => {
  try {
    if (!target || Object.keys(target).length === 0) {
      return fallback || {};
    }
    
    if (!fallback || Object.keys(fallback).length === 0) {
      return target || {};
    }
    
    const merged = { ...target };
    const flatTarget = flattenTranslations(target);
    const flatFallback = flattenTranslations(fallback);
    
    // Add missing keys from fallback
    Object.keys(flatFallback).forEach(key => {
      if (!key) return;
      
      if (!flatTarget[key]) {
        const keys = key.split('.');
        if (!Array.isArray(keys) || keys.length === 0) return;
        
        let current = merged;
        
        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i];
          if (!k) continue;
          
          current[k] = current[k] || {};
          current = current[k];
        }
        
        const lastKey = keys[keys.length - 1];
        if (lastKey) {
          current[lastKey] = flatFallback[key];
        }
      }
    });
    
    return merged;
  } catch (error) {
    console.error("Error merging translations with fallback:", error);
    return target || fallback || {};
  }
};
