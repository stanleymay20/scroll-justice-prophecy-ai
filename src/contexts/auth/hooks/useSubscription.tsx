
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useSubscription(user: User | null) {
  const [subscription, setSubscription] = useState<any | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    } else {
      setSubscription(null);
      setSubscriptionTier(null);
      setSubscriptionStatus(null);
      setSubscriptionEnd(null);
    }
  }, [user]);

  // Check subscription status
  const checkSubscriptionStatus = async () => {
    try {
      if (!user) return;
      
      // Call check-subscription edge function
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        return;
      }
      
      if (data?.subscribed) {
        console.log("Active subscription found:", data);
        setSubscription(data);
        setSubscriptionTier(data.tier);
        setSubscriptionStatus(data.status);
        setSubscriptionEnd(data.current_period_end);
      } else {
        setSubscription(null);
        setSubscriptionTier(null);
        setSubscriptionStatus("inactive");
        setSubscriptionEnd(null);
      }
    } catch (error) {
      console.error("Subscription check failed:", error);
    }
  };

  return {
    subscription,
    subscriptionTier,
    subscriptionStatus,
    subscriptionEnd,
    checkSubscriptionStatus
  };
}
