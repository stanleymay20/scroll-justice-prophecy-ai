
import { useContext } from "react";
import { LanguageContext } from "./LanguageProvider";
import { formatDate, formatNumber } from "@/services/i18n/i18nService";
import { LanguageCode } from "./types";
import { getLanguageDisplayName, isRtlLanguage } from "@/utils/languageUtils";

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.error("useLanguage was used outside of LanguageProvider");
    // Provide a fallback minimal implementation to prevent crashes
    return {
      language: "en" as LanguageCode,
      setLanguage: () => console.error("Language provider not available"),
      t: (key: string) => key,
      isLoading: false,
      reloadTranslations: async () => {},
      formatDate: (date: Date) => date.toISOString(),
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
        return formatDate(date, context.language, options);
      } catch (error) {
        console.error("Error formatting date:", error);
        return date.toISOString();
      }
    },
    
    // Format a number according to the current language
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) => {
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
      try {
        return getLanguageDisplayName(code);
      } catch (error) {
        console.error(`Error getting language name for ${code}:`, error);
        return code;
      }
    }
  };
};
