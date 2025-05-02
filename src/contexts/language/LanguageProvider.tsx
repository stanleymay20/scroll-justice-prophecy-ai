
import React, { createContext, useState, useEffect } from "react";
import { 
  normalizeLanguageCode, 
  isRtlLanguage, 
  getSavedLanguagePreference, 
  getBrowserLanguage, 
  applyLanguageDirection, 
  saveLanguagePreference 
} from "@/utils/languageUtils";
import type { LanguageCode, LanguageContextType } from "./types";
import translations from "./translations";

const defaultLanguage: LanguageCode = "en";

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    // Try to get language from localStorage first
    const savedLanguage = getSavedLanguagePreference();
    if (savedLanguage) {
      return savedLanguage;
    }
    
    // Try to detect browser language if no saved preference
    return getBrowserLanguage();
  });

  // Apply language effects when language changes
  useEffect(() => {
    // Save language preference to localStorage
    saveLanguagePreference(language);
    
    // Update document language attributes for accessibility and RTL
    applyLanguageDirection(language);

    // Dispatch a custom event that components can listen for
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
    
    console.log(`Language set to: ${language}`);
  }, [language]);
  
  // Translation function with fallbacks
  const t = (key: string): string => {
    // Try to get the translation for the current language
    const translation = translations[language]?.[key];
    
    if (translation) {
      return translation;
    }
    
    // Fallback to English if translation doesn't exist
    const englishTranslation = translations.en[key];
    
    // Return the key itself as a last resort
    return englishTranslation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
