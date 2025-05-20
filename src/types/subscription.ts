
export type SubscriptionTier = "basic" | "professional" | "enterprise";

export type SubscriptionStatus = "active" | "inactive" | "pending" | "canceled" | "past_due";

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_end: string | null;
  created_at: string;
  customer_id?: string;
  price_id?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  recommended?: boolean;
  tier: SubscriptionTier;
  billingCycle?: "monthly" | "yearly"; // Added the missing billingCycle property
}
