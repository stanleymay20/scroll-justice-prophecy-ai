
import { LanguageCode } from '@/contexts/language/types';

// Function to load translations from public/locales/{lang}/common.json
export const loadTranslations = async (lang: LanguageCode): Promise<Record<string, any>> => {
  try {
    const response = await fetch(`/locales/${lang}/common.json`);
    if (!response.ok) {
      console.error(`Failed to load translations for ${lang}`);
      // Fall back to in-memory translations if file loading fails
      return {};
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    return {};
  }
};

// Get a nested key from an object using dot notation
export const getNestedValue = (obj: Record<string, any>, path: string): string => {
  const keys = path.split('.');
  return keys.reduce((acc, key) => {
    return (acc && typeof acc === 'object' && key in acc) ? acc[key] : path;
  }, obj);
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
