
import { useContext } from "react";
import { LanguageContext } from "./LanguageProvider";
import { formatDate, formatNumber } from "@/services/i18n/i18nService";
import { LanguageCode } from "./types";
import { getLanguageDisplayName, isRtlLanguage } from "@/utils/languageUtils";

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  // Provide a fallback implementation if context is undefined
  if (context === undefined) {
    console.error("useLanguage was used outside of LanguageProvider");
    
    // Robust fallback implementation to prevent crashes
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
      },
      formatDate: (date: Date) => {
        try {
          return date?.toISOString() || '';
        } catch (e) {
          return '';
        }
      },
      formatNumber: (num: number) => {
        try {
          return num?.toString() || '0';
        } catch (e) {
          return '0';
        }
      },
      isRtl: false,
      getLanguageName: (code: LanguageCode) => code || 'en'
    };
  }

  // Extend the context with additional i18n utilities
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
};
