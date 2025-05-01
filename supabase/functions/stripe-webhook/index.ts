
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      logStep("WARNING: STRIPE_WEBHOOK_SECRET not set, skipping signature verification");
    }
    
    // Use the service role key for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Get the raw request body for signature verification
    const body = await req.text();
    let event: Stripe.Event;
    
    if (webhookSecret) {
      // Verify webhook signature
      const signature = req.headers.get("stripe-signature");
      if (!signature) {
        throw new Error("Missing Stripe signature");
      }
      
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        logStep("Webhook signature verified");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logStep("Webhook signature verification failed", { error: errorMessage });
        return new Response(JSON.stringify({ error: errorMessage }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    } else {
      // If no webhook secret is set, parse the body directly
      try {
        event = JSON.parse(body);
        logStep("Event parsed without signature verification");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logStep("Failed to parse webhook body", { error: errorMessage });
        return new Response(JSON.stringify({ error: errorMessage }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    }
    
    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Checkout session completed", { sessionId: session.id });
      
      // Extract metadata
      const userId = session.metadata?.user_id;
      const role = session.metadata?.role || 'flame_seeker';
      
      if (!userId) {
        logStep("Missing user_id in metadata");
        return new Response(JSON.stringify({ error: "Missing user_id in metadata" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      
      logStep("Processing role update", { userId, role });
      
      // Update user_roles table with the new role
      const { error: roleError } = await supabaseAdmin.from("user_roles").upsert({
        user_id: userId,
        role: role,
        last_role_change: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      
      if (roleError) {
        logStep("Error updating user role", { error: roleError });
        return new Response(JSON.stringify({ error: roleError.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
      
      logStep("Successfully updated user role", { userId, role });
      
      // Trigger subscription check to update subscription table
      try {
        await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/check-subscription`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user_id: userId })
        });
        logStep("Triggered subscription check");
      } catch (err) {
        logStep("Failed to trigger subscription check", { error: String(err) });
      }
    }
    
    // Handle customer.subscription.updated event
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      logStep("Subscription updated", { subscriptionId: subscription.id });
      
      const customerId = subscription.customer as string;
      logStep("Looking up customer", { customerId });
      
      // Get customer details to find the associated user
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted) {
        logStep("Customer has been deleted");
        return new Response(JSON.stringify({ status: "Customer deleted" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      // Find the user associated with this customer
      const { data: subscriptions, error: fetchError } = await supabaseAdmin
        .from("subscriptions")
        .select("user_id")
        .eq("customer_id", customerId)
        .limit(1);
        
      if (fetchError || !subscriptions || subscriptions.length === 0) {
        logStep("Could not find user for customer", { customerId });
        return new Response(JSON.stringify({ status: "User not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      const userId = subscriptions[0].user_id;
      logStep("Found user for subscription update", { userId });
      
      // Determine the subscription status and tier
      const status = subscription.status === "active" ? "active" : "inactive";
      let tier = "basic";
      
      if (subscription.items.data.length > 0) {
        const priceId = subscription.items.data[0].price.id;
        
        if (priceId.includes('professional')) {
          tier = "professional";
        } else if (priceId.includes('enterprise')) {
          tier = "enterprise";
        }
      }
      
      // Map tier to role
      let role = "flame_seeker";
      if (tier === "professional") {
        role = "scroll_advocate";
      } else if (tier === "enterprise") {
        role = "elder_judge";
      }
      
      logStep("Updating user subscription", { userId, status, tier, role });
      
      // Update subscription in database
      await supabaseAdmin.from("subscriptions").upsert({
        user_id: userId,
        status: status,
        tier: tier,
        customer_id: customerId,
        current_period_end: subscription.current_period_end ? 
          new Date(subscription.current_period_end * 1000).toISOString() : null
      }, { onConflict: 'user_id' });
      
      // Update user role
      await supabaseAdmin.from("user_roles").upsert({
        user_id: userId,
        role: role,
        last_role_change: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      
      logStep("Successfully updated user subscription and role", { userId, status, tier, role });
    }
    
    // Handle customer.subscription.deleted event
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      logStep("Subscription deleted", { subscriptionId: subscription.id });
      
      const customerId = subscription.customer as string;
      
      // Find the user associated with this customer
      const { data: subscriptions } = await supabaseAdmin
        .from("subscriptions")
        .select("user_id")
        .eq("customer_id", customerId)
        .limit(1);
        
      if (!subscriptions || subscriptions.length === 0) {
        logStep("Could not find user for deleted subscription");
        return new Response(JSON.stringify({ status: "User not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      const userId = subscriptions[0].user_id;
      logStep("Found user for subscription deletion", { userId });
      
      // Update subscription status to inactive and reset tier
      await supabaseAdmin.from("subscriptions").upsert({
        user_id: userId,
        status: "inactive",
        tier: "basic",
        customer_id: customerId,
        current_period_end: null
      }, { onConflict: 'user_id' });
      
      // Reset user role to flame_seeker
      await supabaseAdmin.from("user_roles").upsert({
        user_id: userId,
        role: "flame_seeker",
        last_role_change: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      
      logStep("Successfully updated user to free tier after subscription deletion", { userId });
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
