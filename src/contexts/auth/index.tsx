
// Export both the provider and hook for use in the application
// This is now the main auth module export point
export { AuthProvider } from './AuthProvider';
export { useAuth } from './useAuth';

// Re-export types if needed
export type { AuthContextType } from './types';
