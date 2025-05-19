
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Helper to map subscription tier to user role
const mapTierToRole = (tier: string | null): string => {
  if (!tier) return 'flame_seeker';
  
  switch(tier?.toLowerCase()) {
    case 'professional':
      return 'scroll_advocate';
    case 'enterprise':
      return 'elder_judge';
    case 'basic':
    default:
      return 'flame_seeker';
  }
};

serve(async (req) => {
  // Add timeout to prevent hanging requests
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error("Request timed out after 5 seconds")), 5000)
  );
  
  try {
    // Race the main function against the timeout
    return await Promise.race([
      processCheckSubscription(req),
      timeoutPromise
    ]) as Response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { 
      message: errorMessage,
      responseBody: {
        error: errorMessage,
        subscribed: false,
        subscription_tier: "basic",
        user_role: "flame_seeker",
        subscription_end: null
      },
      status: 200
    });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      subscribed: false,
      subscription_tier: "basic",
      user_role: "flame_seeker",
      subscription_end: null 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // Return 200 with error info instead of 500 to prevent frontend blocking
    });
  }
});

// Main function to process the subscription check
async function processCheckSubscription(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Use the service role key for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Client for authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    let userId: string;
    let userEmail: string;

    // Check if this is a direct request with user_id in the body
    if (req.method === "POST") {
      try {
        const requestBody = await req.json();
        userId = requestBody.user_id;
        
        if (!userId) {
          throw new Error("No user_id provided in request body");
        }
        
        // Get user email
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (userError) throw new Error(`User lookup error: ${userError.message}`);
        if (!userData?.user) throw new Error(`User not found with ID: ${userId}`);
        
        userEmail = userData.user.email || "";
        logStep("Using user_id from request body", { userId, userEmail });
      } catch (err) {
        logStep("Failed to parse request body or find user", { error: String(err) });
        throw new Error("Invalid request body or user not found");
      }
    } else {
      // Regular authentication via header
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) throw new Error("No authorization header provided");
      logStep("Authorization header found");

      const token = authHeader.replace("Bearer ", "");
      const { data, error } = await supabaseClient.auth.getUser(token);
      
      if (error) throw new Error(`Authentication error: ${error.message}`);
      const user = data.user;
      
      if (!user?.email) {
        throw new Error("User not authenticated or email not available");
      }

      userId = user.id;
      userEmail = user.email;
      logStep("User authenticated", { userId, email: userEmail });
    }
    
    // First check if we already have a valid subscription in the database
    // This provides a quicker response without waiting for Stripe API
    const { data: existingSubscription, error: dbError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
      
    if (!dbError && existingSubscription && existingSubscription.status === "active") {
      // If we have a cached valid subscription that hasn't expired yet, return it immediately
      const currentTime = new Date();
      const subEndTime = existingSubscription.current_period_end ? new Date(existingSubscription.current_period_end) : null;
      
      if (subEndTime && currentTime < subEndTime) {
        logStep("Returning cached subscription data", { 
          subscription: existingSubscription,
          role: mapTierToRole(existingSubscription.tier)
        });
        
        // Background refresh with Stripe - don't wait for this to complete
        const updatePromise = updateSubscriptionFromStripe(userId, userEmail, supabaseAdmin)
          .catch(err => logStep("Background subscription update failed", { error: String(err) }));
        
        return new Response(JSON.stringify({ 
          subscribed: true,
          subscription_tier: existingSubscription.tier,
          user_role: mapTierToRole(existingSubscription.tier),
          subscription_end: existingSubscription.current_period_end 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    // If we don't have a valid cached subscription or it's expired, check with Stripe
    const result = await updateSubscriptionFromStripe(userId, userEmail, supabaseAdmin);
    logStep("Returning fresh subscription data from Stripe", result);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { 
      message: errorMessage,
      responseBody: {
        error: errorMessage,
        subscribed: false,
        subscription_tier: "basic",
        user_role: "flame_seeker",
        subscription_end: null
      },
      status: 200
    });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      subscribed: false,
      subscription_tier: "basic",
      user_role: "flame_seeker",
      subscription_end: null 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // Return 200 with error info instead of 500 to prevent frontend blocking
    });
  }
}

// Extract the Stripe check into a separate function for reuse
async function updateSubscriptionFromStripe(userId: string, userEmail: string, supabaseAdmin: any) {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
  
  const stripe = new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
  });

  // Find the customer in Stripe
  const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
  
  if (customers.data.length === 0) {
    // No Stripe customer found for this user
    logStep("No Stripe customer found");
    
    // Update subscription in database as inactive with flame_seeker role
    await supabaseAdmin.from("subscriptions").upsert({
      user_id: userId,
      status: "inactive",
      tier: "basic",
      customer_id: null,
      price_id: null,
      current_period_end: null,
      created_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    
    // Update user_roles table with flame_seeker role
    await supabaseAdmin.from("user_roles").upsert({
      user_id: userId,
      role: "flame_seeker",
      last_role_change: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    
    logStep("Updated user as flame_seeker (free tier)");
    
    return { 
      subscribed: false,
      subscription_tier: "basic",
      user_role: "flame_seeker",
      subscription_end: null 
    };
  }

  const customerId = customers.data[0].id;
  logStep("Found Stripe customer", { customerId });
  
  try {
    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = "basic";
    let userRole = "flame_seeker"; // Default role
    let subscriptionEnd = null;
    let priceId = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      
      // Get price ID from subscription
      if (subscription.items.data.length > 0) {
        priceId = subscription.items.data[0].price.id;
      
        // Map price ID to subscription tier
        if (priceId.includes('professional')) {
          subscriptionTier = "professional";
          userRole = "scroll_advocate";
        } else if (priceId.includes('enterprise')) {
          subscriptionTier = "enterprise";
          userRole = "elder_judge";
        } else {
          subscriptionTier = "basic";
          userRole = "flame_seeker";
        }
      }
      
      logStep("Active subscription found", { 
        subscriptionId: subscription.id, 
        tier: subscriptionTier,
        role: userRole,
        endDate: subscriptionEnd 
      });
    } else {
      logStep("No active subscription");
    }
    
    // Update subscription in database
    await supabaseAdmin.from("subscriptions").upsert({
      user_id: userId,
      status: hasActiveSub ? "active" : "inactive",
      tier: subscriptionTier,
      customer_id: customerId,
      price_id: priceId,
      current_period_end: subscriptionEnd,
      created_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    
    // Update user_roles table with appropriate role
    await supabaseAdmin.from("user_roles").upsert({
      user_id: userId,
      role: userRole,
      last_role_change: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    
    logStep("Database updated", { 
      userId,
      status: hasActiveSub ? "active" : "inactive",
      tier: subscriptionTier,
      role: userRole
    });

    return {
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      user_role: userRole,
      subscription_end: subscriptionEnd
    };
  } catch (stripeError: any) {
    logStep("Stripe API error", { error: stripeError.message });
    
    // Return default free tier info even when Stripe fails
    return { 
      subscribed: false,
      subscription_tier: "basic",
      user_role: "flame_seeker",
      subscription_end: null,
      error: stripeError.message
    };
  }
}
