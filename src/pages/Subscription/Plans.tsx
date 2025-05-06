
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlanCard, SubscriptionPlan } from "@/components/subscription/PlanCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle, ShieldCheck, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createCheckoutSession, openCustomerPortal, stripePriceIds } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/language";

const Plans = () => {
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Define the plans
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: t("subscription.basic"),
      description: "Essential access to the sacred scrolls of justice",
      priceId: stripePriceIds.basic,
      price: 0,
      currency: "usd",
      billing: selectedBillingCycle,
      features: [
        { name: "Access to petition submission", included: true },
        { name: "View public precedents", included: true },
        { name: "AI integrity analysis (basic)", included: true },
        { name: "Scroll witness participation", included: true },
        { name: "Enhanced AI verdict analysis", included: false },
        { name: "Priority case assignment", included: false },
        { name: "Sacred archive access", included: false },
        { name: "Voice-based recovery keys", included: false },
        { name: "Advanced jurisdiction access", included: false },
        { name: "Automatic case forwarding", included: false },
      ],
      currentPlan: currentSubscription?.tier === 'basic'
    },
    {
      id: "professional",
      name: t("subscription.professional"),
      description: "Advanced tools for dedicated petitioners and witnesses",
      priceId: stripePriceIds.professional,
      price: 49.99,
      currency: "usd",
      billing: selectedBillingCycle,
      features: [
        { name: "Access to petition submission", included: true },
        { name: "View public precedents", included: true },
        { name: "AI integrity analysis (advanced)", included: true },
        { name: "Scroll witness participation", included: true },
        { name: "Enhanced AI verdict analysis", included: true },
        { name: "Priority case assignment", included: true },
        { name: "Sacred archive access", included: true },
        { name: "Voice-based recovery keys", included: true },
        { name: "Advanced jurisdiction access", included: false },
        { name: "Automatic case forwarding", included: false },
      ],
      highlighted: true,
      currentPlan: currentSubscription?.tier === 'professional'
    },
    {
      id: "enterprise",
      name: t("subscription.enterprise"),
      description: "Full access for Scroll Judges and institutional users",
      priceId: stripePriceIds.enterprise,
      price: 99.99,
      currency: "usd",
      billing: selectedBillingCycle,
      features: [
        { name: "Access to petition submission", included: true },
        { name: "View public precedents", included: true },
        { name: "AI integrity analysis (comprehensive)", included: true },
        { name: "Scroll witness participation", included: true },
        { name: "Enhanced AI verdict analysis", included: true },
        { name: "Priority case assignment", included: true },
        { name: "Sacred archive access", included: true },
        { name: "Voice-based recovery keys", included: true },
        { name: "Advanced jurisdiction access", included: true },
        { name: "Automatic case forwarding", included: true },
      ],
      currentPlan: currentSubscription?.tier === 'enterprise'
    }
  ];

  // Check if user has an active subscription
  useEffect(() => {
    const checkSubscription = async () => {
      setCheckingSubscription(true);
      try {
        // Make sure user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setCheckingSubscription(false);
          return;
        }
        
        // Call check-subscription edge function
        const { data, error } = await supabase.functions.invoke("check-subscription");
        
        if (error) {
          console.error("Error checking subscription:", error);
          throw error;
        }
        
        if (data?.subscribed) {
          setCurrentSubscription({
            tier: data.subscription_tier?.toLowerCase(),
            endDate: data.subscription_end ? new Date(data.subscription_end) : null
          });
        } else {
          // Default to basic tier if no subscription
          setCurrentSubscription({
            tier: 'basic',
            endDate: null
          });
        }
      } catch (err) {
        console.error("Subscription check failed:", err);
        setError("Failed to check subscription status. Please try again later.");
      } finally {
        setCheckingSubscription(false);
      }
    };
    
    checkSubscription();
  }, []);

  // Handle subscription
  const handleSubscribe = async (planId: string, priceId: string) => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirect to login if not authenticated
        navigate("/login", { state: { returnUrl: "/subscription/plans" } });
        return;
      }
      
      // Create checkout session for the selected plan
      const { url, error } = await createCheckoutSession(
        priceId, 
        `${window.location.origin}/subscription/success`
      );
      
      if (error) throw new Error(error);
      
      if (url) {
        // Redirect to Stripe checkout
        window.location.href = url;
      } else {
        throw new Error("Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription Error",
        description: "There was a problem processing your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle manage subscription
  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirect to login if not authenticated
        navigate("/login", { state: { returnUrl: "/subscription/plans" } });
        return;
      }
      
      // Open customer portal
      const { url, error } = await openCustomerPortal(
        `${window.location.origin}/subscription/plans`
      );
      
      if (error) throw new Error(error);
      
      if (url) {
        // Redirect to Stripe customer portal
        window.location.href = url;
      } else {
        throw new Error("Failed to open customer portal.");
      }
    } catch (error) {
      console.error("Customer portal error:", error);
      toast({
        title: "Portal Access Error",
        description: "There was a problem accessing the subscription portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-justice-primary mb-2">
          {t("subscription.title")}
        </h1>
        <p className="text-justice-light/70 mb-8">
          Choose a sacred subscription plan to access enhanced features and support the ScrollJustice.AI mission.
        </p>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {currentSubscription && currentSubscription.tier !== 'basic' && (
          <Alert className="mb-6 bg-justice-primary/10 border-justice-primary/30">
            <ShieldCheck className="h-4 w-4 text-justice-primary" />
            <AlertTitle className="text-justice-primary">Active Subscription</AlertTitle>
            <AlertDescription>
              You currently have an active {currentSubscription.tier} subscription
              {currentSubscription.endDate && ` until ${currentSubscription.endDate.toLocaleDateString()}`}.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="monthly" className="mb-8">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger 
                value="monthly"
                onClick={() => setSelectedBillingCycle("monthly")}
              >
                Monthly Billing
              </TabsTrigger>
              <TabsTrigger 
                value="yearly"
                onClick={() => setSelectedBillingCycle("yearly")}
              >
                Yearly Billing
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="monthly">
            {checkingSubscription ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-justice-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onSubscribe={handleSubscribe}
                    onManage={handleManageSubscription}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="yearly">
            <div className="flex justify-center items-center py-12">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Coming Soon</AlertTitle>
                <AlertDescription>
                  Yearly subscription options will be available in a future update.
                  Please use monthly billing for now.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-black/30 border border-justice-tertiary/30 rounded-lg p-6">
          <h3 className="text-lg font-medium text-justice-light mb-4">
            Subscription FAQs
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-justice-primary mb-1">What happens if I cancel my subscription?</h4>
              <p className="text-justice-light/70 text-sm">
                Your access to premium features will continue until the end of your current billing period.
                After that, your account will revert to the free Basic tier.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-justice-primary mb-1">Can I change my subscription plan?</h4>
              <p className="text-justice-light/70 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated
                difference. If you downgrade, the change will take effect at the end of your current billing period.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-justice-primary mb-1">Is my payment information secure?</h4>
              <p className="text-justice-light/70 text-sm">
                Yes, all payments are processed securely through Stripe. We never store your payment information
                on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
