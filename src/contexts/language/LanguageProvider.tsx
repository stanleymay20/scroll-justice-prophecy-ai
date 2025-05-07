
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
    // Try to get language from URL first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = normalizeLanguageCode(urlParams.get('lang') || '') as LanguageCode | null;
    
    if (urlLang && getSupportedLanguages().includes(urlLang)) {
      console.log(`Language set from URL: ${urlLang}`);
      return urlLang;
    }

    // Try to get language from localStorage next
    const savedLanguage = getSavedLanguagePreference();
    if (savedLanguage) {
      console.log(`Language set from localStorage: ${savedLanguage}`);
      return savedLanguage as LanguageCode;
    }
    
    // Try to detect browser language if no saved preference
    const browserLang = getBrowserLanguage();
    console.log(`Language set from browser: ${browserLang}`);
    return browserLang as LanguageCode;
  });

  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const rtl = isRtlLanguage(language);

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
          englishTranslations = await loadTranslations('en');
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
        setTranslations(fallbackTranslations[language as keyof typeof fallbackTranslations] || fallbackTranslations.en);
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
  
  // Enhanced translation function with better fallbacks
  const t = (key: string, ...args: any[]): string => {
    // Try to get the translation from loaded translations
    if (translations && Object.keys(translations).length > 0) {
      const translation = getNestedValue(translations, key);
      
      // If we found a valid translation (not the key itself)
      if (translation !== key) {
        return formatTranslation(translation, args);
      }
    }
    
    // Fallback to in-memory translations for current language
    const fallbackTranslation = getNestedValue(fallbackTranslations[language as keyof typeof fallbackTranslations] || {}, key);
    if (fallbackTranslation !== key) {
      return formatTranslation(fallbackTranslation, args);
    }
    
    // Fallback to English if translation doesn't exist in current language
    const englishTranslation = getNestedValue(fallbackTranslations.en || {}, key);
    if (englishTranslation !== key) {
      return formatTranslation(englishTranslation, args);
    }
    
    // Last resort: return the key itself with formatting applied
    console.warn(`Missing translation for key: ${key} in language: ${language}`);
    return formatTranslation(key, args);
  };
  
  // Method to reload translations manually
  const reloadTranslations = async () => {
    setIsLoading(true);
    try {
      const loadedTranslations = await loadTranslations(language);
      setTranslations(loadedTranslations);
      return Promise.resolve();
    } catch (error) {
      console.error(`Failed to reload translations for ${language}:`, error);
      return Promise.resolve();
    } finally {
      setIsLoading(false);
    }
  };

  // Method to change language with validation
  const changeLanguage = (newLanguage: LanguageCode) => {
    if (getSupportedLanguages().includes(newLanguage)) {
      setLanguage(newLanguage);
    } else {
      console.error(`Unsupported language: ${newLanguage}`);
      setLanguage(defaultLanguage); // Fallback to default language
    }
  }

  const availableLanguages = getSupportedLanguages() as LanguageCode[];

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: changeLanguage, 
      t, 
      rtl,
      isLoading,
      reloadTranslations,
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
