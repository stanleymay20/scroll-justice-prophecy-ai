
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");
    
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check if the user already has a Stripe customer record
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No customer found, will create one during checkout");
    }

    // Parse request body to get price ID, return URL and metadata
    const requestBody = await req.json();
    const { priceId, returnUrl, metadata = {} } = requestBody;
    logStep("Request parsed", { priceId, returnUrl, metadata });

    if (!priceId) {
      throw new Error("Price ID is required");
    }
    
    // Determine role name based on the metadata role
    let roleName = metadata.role || 'basic';
    
    if (roleName === 'professional') {
      roleName = 'scroll_advocate';
    } else if (roleName === 'enterprise') {
      roleName = 'elder_judge';
    }
    
    logStep("Using price ID and setting role", { priceId, role: roleName });
    
    // Combine default metadata with any additional metadata
    const sessionMetadata = {
      user_id: user.id,
      role: roleName,
      ...metadata
    };

    logStep("Creating checkout session with metadata", sessionMetadata);
    
    try {
      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: returnUrl || `${req.headers.get("origin")}/subscription/success`,
        cancel_url: `${req.headers.get("origin")}/subscription/plans`,
        metadata: sessionMetadata
      });
      
      logStep("Checkout session created", { 
        sessionId: session.id, 
        url: session.url,
        status: 200,
        responseBody: { url: session.url }
      });

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (stripeError) {
      logStep("Stripe error", { 
        error: stripeError.message, 
        code: stripeError.code,
        status: 500,
        responseBody: { error: stripeError.message }
      });
      return new Response(JSON.stringify({ 
        error: "Subscription could not be processed. Please try again later or contact support.",
        details: stripeError.message
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { 
      message: errorMessage,
      status: 500,
      responseBody: { error: "Subscription could not be processed. Please try again later or contact support." }
    });
    
    return new Response(JSON.stringify({ 
      error: "Subscription could not be processed. Please try again later or contact support.",
      details: errorMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
