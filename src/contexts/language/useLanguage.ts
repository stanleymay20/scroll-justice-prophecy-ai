
import { useContext } from "react";
import { LanguageContext } from "./LanguageProvider";
import { formatDate, formatNumber } from "@/services/i18n/i18nService";
import { LanguageCode } from "./types";
import translations from "./translations";

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  // Enhanced error handling with more robust fallback
  if (context === undefined) {
    console.error("useLanguage must be used within a LanguageProvider");
    
    // Provide a minimal fallback context to prevent crashes
    return {
      language: "en" as LanguageCode,
      setLanguage: (lang: LanguageCode) => {
        console.warn("Language provider not found, but tried to set language to:", lang);
        // Try to persist in localStorage as fallback
        try {
          localStorage.setItem('preferred_language', lang);
        } catch (e) {
          // Silent fail
        }
      },
      t: (key: string) => {
        if (!key) return '';
        
        try {
          const parts = key.split('.');
          let value: any = translations.en;
          
          for (const part of parts) {
            if (value && typeof value === 'object' && part in value) {
              value = value[part];
            } else {
              return key; // Key not found in fallbacks
            }
          }
          
          return typeof value === 'string' ? value : key;
        } catch (error) {
          console.error("Error in fallback translation:", error);
          return key;
        }
      },
      rtl: false,
      isLoading: false,
      availableLanguages: ["en"] as LanguageCode[],
      
      // Extended utilities with safe fallbacks
      formatDate: (date: Date) => {
        try {
          return date.toLocaleDateString();
        } catch (e) {
          return String(date);
        }
      },
      formatNumber: (num: number) => {
        try {
          return num.toString();
        } catch (e) {
          return String(num);
        }
      },
      isRtl: false,
      getLanguageName: (code: LanguageCode) => code
    };
  }

  // Extend the context with additional i18n utilities
  return {
    ...context,
    
    // Format a date according to the current language
    formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => {
      try {
        return formatDate(date, context.language as LanguageCode, options);
      } catch (error) {
        console.error("Error formatting date:", error);
        return date.toLocaleDateString();
      }
    },
    
    // Format a number according to the current language
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) => {
      try { 
        return formatNumber(num, context.language as LanguageCode, options);
      } catch (error) {
        console.error("Error formatting number:", error);
        return num.toString();
      }
    },
    
    // Is the current language RTL?
    isRtl: context.rtl,
    
    // Return localized language name
    getLanguageName: (code: LanguageCode): string => {
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
    }
  };
};
