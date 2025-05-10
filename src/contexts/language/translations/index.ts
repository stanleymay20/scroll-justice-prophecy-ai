
import en from './en';
import fr from './fr';
import es from './es';
import de from './de';
import { TranslationsType } from '../types';
import { LanguageCode } from '../types';

// Import minimal translations as fallback
import minimalTranslations from './minimal-translations';

// Merge all translations into one object
const translations: TranslationsType = {
  en,
  fr,
  es,
  de,
};

// Add fallback for other languages
const supportedLanguages: LanguageCode[] = ['en', 'fr', 'es', 'de', 'zh', 'ar', 'hi', 'pt', 'he', 'sw', 'am'];

// For languages without dedicated translation files, use minimal fallbacks
supportedLanguages.forEach(lang => {
  if (!translations[lang]) {
    translations[lang] = minimalTranslations[lang] || {};
  }
});

export default translations;
