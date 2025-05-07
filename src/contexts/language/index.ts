
// Direct imports of runtime components
import { LanguageProvider } from './LanguageProvider';
import { useLanguage } from './useLanguage';
// Import types separately 
import type { LanguageCode } from './types';

// Export runtime values
export { useLanguage, LanguageProvider };

// Export types with explicit 'export type' syntax
export type { LanguageCode };
// Re-export additional types
export type { LanguageContextType } from './types';
