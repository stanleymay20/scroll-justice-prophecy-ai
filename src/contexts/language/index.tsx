import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadTranslations, getNestedValue, formatTranslation } from '@/services/i18n/i18nService';
import { LanguageCode } from './types';
import { 
  isRtlLanguage,
  applyLanguageDirection,
  getSavedLanguagePreference,
  saveLanguagePreference,
  getBrowserLanguage 
} from '@/utils/languageUtils';

// Context interface
import type { LanguageContextType } from './types';

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: LanguageCode;
}

export const LanguageProvider = ({ 
  children, 
  initialLanguage 
}: LanguageProviderProps) => {
  // Try to use saved preference, then browser language, then default to English
  const initialLang = initialLanguage || 
    getSavedLanguagePreference() || 
    getBrowserLanguage() || 
    'en';
  
  const [language, setLanguageState] = useState<LanguageCode>(initialLang);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rtl, setRtl] = useState<boolean>(isRtlLanguage(initialLang));

  // Load translations whenever language changes
  useEffect(() => {
    const loadLanguage = async (lang: LanguageCode) => {
      setIsLoading(true);
      try {
        const translationData = await loadTranslations(lang);
        setTranslations(translationData);
        
        // Set RTL status
        const isRtl = isRtlLanguage(lang);
        setRtl(isRtl);
        
        // Apply language direction and other document attributes
        applyLanguageDirection(lang);
        
        // Save preference for later visits
        saveLanguagePreference(lang);
        
        console.log(`Language set to ${lang} (RTL: ${isRtl ? 'Yes' : 'No'})`);
      } catch (error) {
        console.error(`Failed to load translations for ${lang}:`, error);
        
        // Fallback to English if loading fails and current language isn't English
        if (lang !== 'en') {
          console.log('Falling back to English translations');
          loadLanguage('en');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage(language);
  }, [language]);

  // Set language with validation
  const setLanguage = (code: LanguageCode) => {
    if (code !== language) {
      setLanguageState(code);
    }
  };

  // Translation function
  const t = (key: string, ...args: any[]): string => {
    const translatedValue = getNestedValue(translations, key);
    
    if (typeof translatedValue !== 'string') {
      // If not found, return the key itself for visibility
      return key;
    }
    
    // If there are arguments, format the string
    if (args && args.length > 0) {
      return formatTranslation(translatedValue, args);
    }
    
    return translatedValue;
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    rtl,
    isLoading,
  };

  // Re-export the context for useLanguage
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Export the context for the useLanguage hook
export { LanguageContext };

// Export types explicitly
export type { LanguageCode, LanguageContextType };
