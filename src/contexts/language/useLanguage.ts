
import { useContext } from 'react';
import { LanguageContext } from './LanguageProvider';
import type { LanguageContextType } from './types';
import { formatDate, formatNumber } from "@/services/i18n/i18nService";
import { LanguageCode } from "./types";
import { getLanguageDisplayName, isRtlLanguage } from "@/utils/languageUtils";

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    console.error("useLanguage was used outside of LanguageProvider");
    
    // Provide a fallback to prevent crashes
    return {
      language: "en" as LanguageCode,
      setLanguage: (lang: LanguageCode) => {
        console.error("Language provider not available, can't set language to:", lang);
      },
      t: (key: string) => {
        // Return the key as fallback
        if (!key) return '';
        return key;
      },
      isLoading: false,
      reloadTranslations: async () => {
        console.error("Language provider not available, can't reload translations");
      }
    };
  }
  
  return {
    ...context,
    // Format a date according to the current language
    formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => {
      if (!date) return '';
      
      try {
        return formatDate(date, context.language, options);
      } catch (error) {
        console.error("Error formatting date:", error);
        return date.toISOString();
      }
    },
    
    // Format a number according to the current language
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) => {
      if (num === null || num === undefined) return '0';
      
      try {
        return formatNumber(num, context.language, options);
      } catch (error) {
        console.error("Error formatting number:", error);
        return num.toString();
      }
    },
    
    // Is the current language RTL?
    isRtl: isRtlLanguage(context.language),
    
    // Return localized language name
    getLanguageName: (code: LanguageCode) => {
      if (!code) return '';
      
      try {
        return getLanguageDisplayName(code);
      } catch (error) {
        console.error(`Error getting language name for ${code}:`, error);
        return code;
      }
    }
  };
}
