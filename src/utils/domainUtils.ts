
/**
 * Domain utility functions for the application
 */

// List of supported domains
export const SUPPORTED_DOMAINS = ['scrollcourt.xyz', 'scrolljustice.xyz', 'lovable.dev'];

// Default domain to use
export const DEFAULT_DOMAIN = 'scrollcourt.xyz';

/**
 * Get the current site URL based on the browser's location
 * or default to the primary domain
 */
export const getCurrentSiteUrl = (): string => {
  // In browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Default to primary domain
  return `https://${DEFAULT_DOMAIN}`;
};

/**
 * Check if the current domain is in the list of supported domains
 */
export const isCurrentDomainSupported = (): boolean => {
  if (typeof window !== 'undefined') {
    return SUPPORTED_DOMAINS.some(domain => window.location.hostname.includes(domain));
  }
  return false;
};

/**
 * Get a fully qualified URL for authentication redirects
 * @param path - The path to append to the site URL
 */
export const getAuthRedirectUrl = (path: string = '/auth/callback'): string => {
  const baseUrl = getCurrentSiteUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

/**
 * Log domain configuration for debugging
 */
export const logDomainConfiguration = (): void => {
  console.log("Domain Configuration:");
  console.log(`- Current origin: ${window?.location?.origin || 'Unknown'}`);
  console.log(`- Current hostname: ${window?.location?.hostname || 'Unknown'}`);
  console.log(`- Default domain: ${DEFAULT_DOMAIN}`);
  console.log(`- Is current domain supported: ${isCurrentDomainSupported()}`);
  console.log(`- Auth redirect URL: ${getAuthRedirectUrl()}`);
};
