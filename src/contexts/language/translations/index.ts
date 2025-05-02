
import { TranslationsType } from '../types';
import en from './en';
import fr from './fr';
import es from './es';
import de from './de';
import minimalTranslations from './minimal-translations';

// Combine all translations into one object
const translations: TranslationsType = {
  en,
  fr,
  es,
  de,
  ...minimalTranslations
};

export default translations;
