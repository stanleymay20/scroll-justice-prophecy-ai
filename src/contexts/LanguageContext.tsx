
// This file is now just a bridge for backward compatibility
// It re-exports everything from the new modular structure
import { LanguageProvider, LanguageContext } from './language';
import { useLanguage } from './language/useLanguage';
import type { LanguageCode, LanguageContextType } from './language/types';

export { LanguageProvider, useLanguage, LanguageContext };
export type { LanguageCode, LanguageContextType };
