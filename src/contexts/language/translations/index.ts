
import en from './en';
import fr from './fr';
import es from './es';
import de from './de';
import minimalTranslations from './minimal-translations';

// Combine all translations into one object
const translations = {
  en,
  fr,
  es,
  de,
  ...minimalTranslations
};

export default translations;
