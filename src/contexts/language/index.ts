
// Direct imports of runtime components
import { LanguageProvider, LanguageContext } from './LanguageProvider';
import { useLanguage } from './useLanguage';
// Import types separately 
import type { LanguageCode, LanguageContextType } from './types';

// Export runtime values
export { useLanguage, LanguageProvider, LanguageContext };

// Export types with explicit 'export type' syntax
export type { LanguageCode, LanguageContextType };
