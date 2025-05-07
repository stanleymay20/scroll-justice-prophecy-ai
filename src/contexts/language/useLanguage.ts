
import { useContext } from "react";
import { LanguageContext } from "./LanguageProvider";
import { formatDate, formatNumber } from "@/services/i18n/i18nService";
import { LanguageCode } from "./types";

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  // Extend the context with additional i18n utilities
  return {
    ...context,
    // Format a date according to the current language
    formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => 
      formatDate(date, context.language as LanguageCode, options),
    
    // Format a number according to the current language
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) => 
      formatNumber(num, context.language as LanguageCode, options),
    
    // Is the current language RTL?
    isRtl: ["ar", "he"].includes(context.language),
    
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
