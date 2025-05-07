
import { useContext } from "react";
import { LanguageContext } from "./LanguageProvider";
import { formatDate, formatNumber } from "@/services/i18n/i18nService";
import { LanguageCode } from "./types";
import fallbackTranslations from "./translations";

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.error("useLanguage must be used within a LanguageProvider");
    
    // Instead of throwing an error, provide a minimal fallback context
    // This prevents app crashes when used outside a provider
    return {
      language: "en" as LanguageCode,
      setLanguage: () => console.warn("Language provider not found"),
      t: (key: string) => {
        console.warn(`Translation attempted outside provider: ${key}`);
        
        // Try to get from fallback translations
        const parts = key.split('.');
        let value = fallbackTranslations.en;
        
        for (const part of parts) {
          if (value && typeof value === 'object' && part in value) {
            value = value[part];
          } else {
            return key; // Key not found in fallbacks
          }
        }
        
        return typeof value === 'string' ? value : key;
      },
      rtl: false,
      isLoading: false,
      reloadTranslations: () => Promise.resolve(),
      availableLanguages: ["en"] as LanguageCode[],
      
      // Extended utilities with safe fallbacks
      formatDate: (date: Date) => date.toLocaleDateString(),
      formatNumber: (num: number) => num.toString(),
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
    getLanguageName: (code: LanguageCode) => {
      const names: Record<LanguageCode, string> = {
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
      return names[code] || code;
    }
  };
};
