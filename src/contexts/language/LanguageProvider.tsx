
import React, { createContext, useState, useEffect } from "react";
import { 
  normalizeLanguageCode, 
  isRtlLanguage, 
  getSavedLanguagePreference, 
  getBrowserLanguage, 
  applyLanguageDirection, 
  saveLanguagePreference,
  getSupportedLanguages
} from "@/utils/languageUtils";
import { 
  loadTranslations, 
  getNestedValue, 
  formatTranslation, 
  syncLanguageWithRouter,
  mergeWithFallback
} from "@/services/i18n/i18nService";
import type { LanguageCode, LanguageContextType } from "./types";
import fallbackTranslations from "./translations";

const defaultLanguage: LanguageCode = "en";

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    try {
      // Try to get language from URL first
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = normalizeLanguageCode(urlParams.get('lang') || '') as LanguageCode | null;
        
        // Get supported languages and ensure it's a valid one
        const supportedLangs = getSupportedLanguages();
        if (urlLang && supportedLangs.includes(urlLang)) {
          console.log(`Language set from URL: ${urlLang}`);
          return urlLang;
        }

        // Try to get language from localStorage next
        const savedLanguage = getSavedLanguagePreference();
        if (savedLanguage) {
          console.log(`Language set from localStorage: ${savedLanguage}`);
          return savedLanguage;
        }
        
        // Try to detect browser language if no saved preference
        const browserLang = getBrowserLanguage();
        console.log(`Language set from browser: ${browserLang}`);
        return browserLang;
      }
      
      return defaultLanguage;
    } catch (error) {
      console.error("Error determining initial language:", error);
      return defaultLanguage;
    }
  });

  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations when language changes
  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        console.log(`Loading translations for ${language}...`);
        
        // First try to load translations from JSON file
        const loadedTranslations = await loadTranslations(language);
        
        // Load English translations as fallback
        let englishTranslations = {};
        if (language !== 'en') {
          try {
            englishTranslations = await loadTranslations('en');
          } catch (error) {
            console.warn("Failed to load English fallback translations:", error);
          }
        }
        
        // Merge translations with fallbacks for missing keys
        const mergedTranslations = language === 'en' ? 
          loadedTranslations : 
          mergeWithFallback(loadedTranslations, englishTranslations);
        
        console.log(`Loaded translations for ${language}:`, 
          Object.keys(mergedTranslations).length > 0 ? 
          `${Object.keys(mergedTranslations).length} keys found` : 
          'No keys found, using fallback'
        );
        
        setTranslations(mergedTranslations);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fall back to in-memory translations
        const fallback = fallbackTranslations[language] || fallbackTranslations.en || {};
        console.log(`Using in-memory fallback translations for ${language}`);
        setTranslations(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [language]);

  // Apply language effects when language changes
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      // Save language preference to localStorage
      saveLanguagePreference(language);
      
      // Sync language with URL
      syncLanguageWithRouter(language);
      
      // Update document language attributes for accessibility and RTL
      applyLanguageDirection(language);

      // Dispatch a custom event that components can listen for
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
      
      console.log(`Language set to: ${language}`);
    } catch (error) {
      console.error("Error applying language effects:", error);
    }
  }, [language]);
  
  // Enhanced translation function with better fallbacks
  const t = (key: string, ...args: any[]): string => {
    if (!key) return '';
    
    try {
      // Try to get the translation from loaded translations
      if (translations && Object.keys(translations).length > 0) {
        const translation = getNestedValue(translations, key);
        
        // If we found a valid translation (not the key itself)
        if (translation !== key) {
          return formatTranslation(translation, args);
        }
      }
      
      // Fallback to in-memory translations for current language
      const fallbackTranslation = getNestedValue((fallbackTranslations[language] || {}), key);
      if (fallbackTranslation !== key) {
        return formatTranslation(fallbackTranslation, args);
      }
      
      // Fallback to English if translation doesn't exist in current language
      const englishTranslation = getNestedValue((fallbackTranslations.en || {}), key);
      if (englishTranslation !== key) {
        return formatTranslation(englishTranslation, args);
      }
      
      // Last resort: return the key itself with formatting applied
      console.warn(`Missing translation for key: ${key} in language: ${language}`);
      return formatTranslation(key, args);
    } catch (error) {
      console.error(`Error translating key ${key}:`, error);
      return key; // Return key as ultimate fallback
    }
  };
  
  // Method to reload translations manually
  const reloadTranslations = async () => {
    setIsLoading(true);
    try {
      const loadedTranslations = await loadTranslations(language);
      setTranslations(loadedTranslations);
    } catch (error) {
      console.error(`Failed to reload translations for ${language}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Method to change language with validation
  const changeLanguage = (newLanguage: LanguageCode) => {
    try {
      // Ensure we have a valid supported languages array
      const supportedLangs = getSupportedLanguages();
      
      if (Array.isArray(supportedLangs) && supportedLangs.includes(newLanguage)) {
        setLanguage(newLanguage);
      } else {
        console.error(`Unsupported language: ${newLanguage}`);
        setLanguage(defaultLanguage); // Fallback to default language
      }
    } catch (error) {
      console.error(`Error changing language to ${newLanguage}:`, error);
      setLanguage(defaultLanguage); // Fallback to default language on error
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: changeLanguage, 
      t, 
      isLoading, 
      reloadTranslations 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
