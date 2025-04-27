
// Stripe configuration

// Store the publishable key for client-side use
export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51Pl2vZJYFIBeCvefE5zLvl5IPtDWeciQob8uUNYjnCXMfhICYEvZv6sSfQ74oOukbbEVLMr6bHe1Rg4lwqma4quR00YQlgIaHI';

// Helper to check if Stripe is configured
export const isStripeConfigured = () => {
  return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
};
