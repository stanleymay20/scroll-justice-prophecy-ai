
// Stripe configuration

// Store the publishable key for client-side use
export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51Pl2vZJYFIBeCvefE5zLvl5IPtDWeciQob8uUNYjnCXMfhICYEvZv6sSfQ74oOukbbEVLMr6bHe1Rg4lwqma4quR00YQlgIaHI';

// Helper to check if Stripe is configured
export const isStripeConfigured = () => {
  return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
};

// Create a Stripe checkout session
export const createCheckoutSession = async (priceId: string, returnUrl: string) => {
  try {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        priceId,
        returnUrl
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};

// Check subscription status
export const checkSubscription = async () => {
  try {
    const { data, error } = await supabase.functions.invoke("check-subscription");
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error checking subscription:", error);
    throw error;
  }
};

// Open customer portal for subscription management
export const openCustomerPortal = async (returnUrl?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke("customer-portal", {
      body: { returnUrl }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error opening customer portal:", error);
    throw error;
  }
};

// Helper to determine if a subscription tier has access to a feature
export const hasAccess = (userTier: string | null, requiredTier: "basic" | "professional" | "enterprise") => {
  if (!userTier) return false;
  
  const tierHierarchy = ["basic", "professional", "enterprise"];
  const userTierIndex = tierHierarchy.indexOf(userTier.toLowerCase());
  const requiredTierIndex = tierHierarchy.indexOf(requiredTier);
  
  return userTierIndex >= requiredTierIndex;
};

// Import supabase client for making API calls
import { supabase } from './supabase';
