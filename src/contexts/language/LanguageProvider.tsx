
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { 
  normalizeLanguageCode, 
  isRtlLanguage, 
  getSavedLanguagePreference, 
  getBrowserLanguage, 
  applyLanguageDirection,
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

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: LanguageCode;
}

export const LanguageProvider = ({ 
  children,
  initialLanguage
}: LanguageProviderProps) => {
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

  const [translations, setTranslations] = useState<Record<string, any>>(fallbackTranslations.en || {});
  const [isLoading, setIsLoading] = useState(true);
  const [rtl, setRtl] = useState(isRtlLanguage(language));

  // Load translations when language changes
  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        console.info(`Loading translations for ${language}...`);
        
        // First try to load translations from JSON file
        const loadedTranslations = await loadTranslations(language);
        
        // Always load English translations as fallback
        let englishTranslations = {};
        if (language !== 'en') {
          englishTranslations = await loadTranslations('en').catch(() => fallbackTranslations.en || {});
        }
        
        // Merge translations with fallbacks for missing keys
        const mergedTranslations = language === 'en' ? 
          { ...fallbackTranslations.en, ...loadedTranslations } : 
          mergeWithFallback(loadedTranslations, englishTranslations);
        
        console.info(`Loaded translations for ${language}:`, 
          Object.keys(mergedTranslations).length > 0 ? 
          `${Object.keys(mergedTranslations).length} keys found` : 
          'No keys found, using fallback'
        );
        
        setTranslations(mergedTranslations);
        
        // Update RTL status
        const isRtl = isRtlLanguage(language);
        setRtl(isRtl);
        
        // Apply RTL direction to document
        applyLanguageDirection(language);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fall back to in-memory translations
        const fallbackData = fallbackTranslations[language as keyof typeof fallbackTranslations] || fallbackTranslations.en;
        console.warn(`Using in-memory fallback translations for ${language}`);
        setTranslations(fallbackData);
        
        // Make sure RTL is still applied correctly even with fallbacks
        const isRtl = isRtlLanguage(language);
        setRtl(isRtl);
        applyLanguageDirection(language);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
    
    // Save language preference to localStorage
    saveLanguagePreference(language);
    
    // Sync language with URL
    syncLanguageWithRouter(language);
    
    // Dispatch a custom event that components can listen for
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
    
    console.info(`Language set to: ${language} (RTL: ${isRtlLanguage(language) ? 'Yes' : 'No'})`);
  }, [language]);
  
  // Method to change language with validation
  const changeLanguage = (newLanguage: LanguageCode) => {
    if (getSupportedLanguages().includes(newLanguage)) {
      setLanguage(newLanguage);
    } else {
      console.error(`Unsupported language: ${newLanguage}`);
      setLanguage(defaultLanguage); // Fallback to default language
    }
  };

  // Enhanced translation function with better fallbacks and logging
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
      console.warn(`Missing translation for key: ${key} in language: ${language}, using English fallback`);
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

  const availableLanguages = getSupportedLanguages();

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
