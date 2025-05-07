
// This file is now just a bridge for backward compatibility
// It re-exports everything from the new modular structure
import { LanguageProvider, useLanguage } from './language';
import type { LanguageCode, LanguageContextType } from './language/types';

export { LanguageProvider, useLanguage };
export type { LanguageCode, LanguageContextType };
