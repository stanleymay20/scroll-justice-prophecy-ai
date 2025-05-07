
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/auth';
import { LanguageCode, LanguageContextType } from './types';
import { translations } from './translations';
import { minimalTranslations } from './translations/minimal-translations';

// Helper to get saved language preference
const getSavedLanguagePreference = (): LanguageCode => {
  try {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      return savedLanguage as LanguageCode;
    }
  } catch (e) {
    console.warn('Error accessing localStorage:', e);
  }
  return 'en';
};

// Helper to save language preference
const saveLanguagePreference = (language: LanguageCode): void => {
  try {
    localStorage.setItem('language', language);
  } catch (e) {
    console.warn('Error saving to localStorage:', e);
  }
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  translations: {},
  availableLanguages: [],
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(getSavedLanguagePreference());
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentTranslations, setCurrentTranslations] = useState<Record<string, string>>({});
  const { user } = useAuth();
  
  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Start with minimal translations to avoid blank UI
        setCurrentTranslations(minimalTranslations[language] || minimalTranslations.en);

        // Load full translations
        if (translations[language]) {
          setCurrentTranslations(translations[language]);
        } else {
          console.warn(`Translations for ${language} not found, using English as fallback`);
          setCurrentTranslations(translations.en);
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading translations:', error);
        setCurrentTranslations(minimalTranslations.en);
        setIsLoaded(true);
      }
    };

    loadTranslations();
  }, [language]);

  // Save user preference
  useEffect(() => {
    if (user && isLoaded) {
      // Update user preference in database
      // This would typically update a user_preferences table
      console.log(`Language preference for user ${user.id} set to ${language}`);
    }
  }, [user, language, isLoaded]);

  const setLanguage = (newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
    saveLanguagePreference(newLanguage);
  };

  // Translation function with fallbacks
  const t = (key: string): string => {
    if (!key) return '';
    
    // Check if key exists in current language
    if (currentTranslations && currentTranslations[key]) {
      return currentTranslations[key];
    }
    
    // Try English as fallback
    if (language !== 'en' && translations.en && translations.en[key]) {
      console.warn(`Translation key "${key}" missing in ${language}, using English fallback`);
      return translations.en[key];
    }
    
    // Return key as last resort
    console.warn(`Translation key "${key}" not found in any language`);
    return key;
  };
  
  // Get list of available languages
  const availableLanguages = Object.keys(translations) as LanguageCode[];

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t, 
        translations: currentTranslations,
        availableLanguages
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
