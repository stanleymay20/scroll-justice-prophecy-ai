
import React, { createContext, useState, useEffect } from "react";
import { 
  normalizeLanguageCode, 
  isRtlLanguage, 
  getSavedLanguagePreference, 
  getBrowserLanguage, 
  applyLanguageDirection, 
  saveLanguagePreference 
} from "@/utils/languageUtils";
import { loadTranslations, getNestedValue, formatTranslation, syncLanguageWithRouter } from "@/services/i18n/i18nService";
import type { LanguageCode, LanguageContextType } from "./types";
import fallbackTranslations from "./translations";

const defaultLanguage: LanguageCode = "en";

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    // Try to get language from URL first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') as LanguageCode | null;
    if (urlLang) {
      return urlLang;
    }

    // Try to get language from localStorage next
    const savedLanguage = getSavedLanguagePreference();
    if (savedLanguage) {
      return savedLanguage;
    }
    
    // Try to detect browser language if no saved preference
    return getBrowserLanguage();
  });

  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations when language changes
  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        const loadedTranslations = await loadTranslations(language);
        setTranslations(loadedTranslations);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fall back to in-memory translations
        setTranslations(fallbackTranslations[language] || fallbackTranslations.en);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [language]);

  // Apply language effects when language changes
  useEffect(() => {
    // Save language preference to localStorage
    saveLanguagePreference(language);
    
    // Sync language with URL
    syncLanguageWithRouter(language);
    
    // Update document language attributes for accessibility and RTL
    applyLanguageDirection(language);

    // Dispatch a custom event that components can listen for
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
    
    console.log(`Language set to: ${language}`);
  }, [language]);
  
  // Translation function with fallbacks
  const t = (key: string, ...args: any[]): string => {
    // Try to get the translation from loaded JSON file
    if (translations && Object.keys(translations).length > 0) {
      const translation = getNestedValue(translations, key);
      
      // If we found a valid translation (not the key itself)
      if (translation !== key) {
        return formatTranslation(translation, args);
      }
    }
    
    // Fallback to in-memory translations
    const fallbackTranslation = getNestedValue(fallbackTranslations[language] || {}, key);
    if (fallbackTranslation !== key) {
      return formatTranslation(fallbackTranslation, args);
    }
    
    // Fallback to English if translation doesn't exist
    const englishTranslation = getNestedValue(fallbackTranslations.en || {}, key);
    if (englishTranslation !== key) {
      return formatTranslation(englishTranslation, args);
    }
    
    // Return the key itself as a last resort
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};
