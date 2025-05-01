
// Stripe configuration

// Store the publishable key for client-side use
export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Pl2vZJYFIBeCvefE5zLvl5IPtDWeciQob8uUNYjnCXMfhICYEvZv6sSfQ74oOukbbEVLMr6bHe1Rg4lwqma4quR00YQlgIaHI';

// Helper to check if Stripe is configured
export const isStripeConfigured = () => {
  return !!stripePublishableKey;
};

// Import supabase client for making API calls
import { supabase } from '@/lib/supabase';

// Define subscription tiers with their metadata
export const subscriptionTiers = {
  FLAME_SEEKER: 'basic',
  SCROLL_ADVOCATE: 'professional',
  ELDER_JUDGE: 'enterprise'
};

// Map friendly names to subscription tiers
export const tierNames = {
  'basic': 'Flame Seeker',
  'professional': 'Scroll Advocate',
  'enterprise': 'Elder Judge'
};

// Actual Stripe Price IDs (replace with your actual Stripe Price IDs)
export const stripePriceIds = {
  'basic': 'price_basic', // Free tier doesn't need a price ID
  'professional': 'price_1PlW1vJYFIBeCvefB7J5dIQb', // Replace with your professional tier price ID
  'enterprise': 'price_1PlW2NJYFIBeCvefVkrv0SOl'  // Replace with your enterprise tier price ID
};

// Create a Stripe checkout session
export const createCheckoutSession = async (priceId: string, returnUrl: string) => {
  try {
    // Get the current user to include in metadata
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be logged in to create a checkout session");
    }
    
    // Use the provided price ID directly (should be a valid Stripe price ID)
    console.log("Creating checkout with price ID:", {
      priceId,
      returnUrl,
      metadata: {
        user_id: user.id,
        email: user.email,
        role: priceId // Store the plan/tier in metadata
      }
    });
    
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        priceId, // Use the actual Stripe Price ID
        returnUrl,
        metadata: {
          user_id: user.id,
          email: user.email,
          role: priceId // Store the desired role in metadata
        }
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

// Generate a QR code ScrollPass for subscription users
export const generateScrollPass = async (userId: string, role: string, timestamp: string) => {
  // This would integrate with a QR code generation service
  // Placeholder for now
  return {
    userId,
    role,
    timestamp,
    qrCode: `scrollpass-${userId}-${role}-${Date.now()}` 
  };
};

// Function to map subscription tier to user role
export const mapTierToRole = (tier: string | null): string => {
  if (!tier) return 'guest';
  
  switch(tier.toLowerCase()) {
    case 'professional':
      return 'scroll_advocate';
    case 'enterprise':
      return 'elder_judge';
    case 'basic':
    default:
      return 'flame_seeker';
  }
};

// Function to map user role to subscription tier
export const mapRoleToTier = (role: string | null): string => {
  if (!role) return 'basic';
  
  switch(role.toLowerCase()) {
    case 'scroll_advocate':
      return 'professional';
    case 'elder_judge':
      return 'enterprise';
    case 'flame_seeker':
    default:
      return 'basic';
  }
};
