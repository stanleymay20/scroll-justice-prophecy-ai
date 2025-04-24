
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import type { SubscriptionPlan, SubscriptionTier } from "@/types/subscription";

const plans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Essential legal tools for individuals",
    price: 0,
    tier: "basic",
    features: [
      "Basic case search",
      "5 document uploads per month",
      "Limited precedent explorer",
      "Standard response time"
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Advanced features for legal professionals",
    price: 49.99,
    tier: "professional",
    recommended: true,
    features: [
      "Full case search capabilities",
      "Unlimited document uploads",
      "Complete precedent explorer access",
      "Trial simulation (limited)",
      "Priority support"
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Complete solution for law firms",
    price: 99.99,
    tier: "enterprise",
    features: [
      "All Professional features",
      "Advanced AI training",
      "Custom case classification",
      "Team collaboration features",
      "Dedicated account manager",
      "API access"
    ],
  }
];

const SubscriptionPlans = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { user, subscriptionTier, subscriptionStatus } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      navigate("/signin?redirect=/subscription/plans");
      return;
    }

    if (plan.id === "basic") {
      // Basic plan is free, no checkout needed
      toast({
        title: "You're on the Basic plan",
        description: "You're already using our free Basic plan.",
      });
      return;
    }

    try {
      setLoading(plan.id);
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: plan.id === "professional" ? "price_professional" : "price_enterprise",
          returnUrl: `${window.location.origin}/subscription/success`
        }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: error.message || "There was an error creating your checkout session.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const isCurrentPlan = (tier: SubscriptionTier) => {
    return tier === subscriptionTier && subscriptionStatus === "active";
  };

  const getButtonLabel = (plan: SubscriptionPlan) => {
    if (isCurrentPlan(plan.tier)) {
      return "Current Plan";
    }
    
    if (plan.id === "basic") {
      return "Free Plan";
    }
    
    if (loading === plan.id) {
      return "Processing...";
    }
    
    return "Subscribe";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-justice-light/80 max-w-2xl mx-auto">
            Select the subscription plan that best fits your needs. Upgrade anytime to access more features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <GlassCard 
              key={plan.id}
              className={`relative p-6 flex flex-col ${
                plan.recommended ? "border-justice-primary" : ""
              }`}
              intensity={plan.recommended ? "medium" : "light"}
              glow={plan.recommended}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-justice-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Recommended
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="text-justice-light/70 mt-1">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-end">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price === 0 ? "0" : plan.price.toFixed(2)}
                  </span>
                  <span className="text-justice-light/70 ml-2 mb-1">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-justice-primary shrink-0 mr-2" />
                    <span className="text-justice-light/90">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => handleSubscribe(plan)}
                className={`w-full ${
                  isCurrentPlan(plan.tier)
                    ? "bg-justice-light/20 border border-justice-primary text-white cursor-default"
                    : ""
                }`}
                disabled={loading !== null || isCurrentPlan(plan.tier)}
              >
                {getButtonLabel(plan)}
              </Button>
              
              {isCurrentPlan(plan.tier) && (
                <p className="text-center text-justice-primary text-sm mt-3">
                  Current active subscription
                </p>
              )}
            </GlassCard>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-white mb-6">Plan Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-justice-light/20">
                  <th className="p-4 text-left text-justice-light">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="p-4 text-center text-white">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-justice-light/10">
                  <td className="p-4 text-justice-light">Case Search</td>
                  <td className="p-4 text-center text-justice-light">Basic</td>
                  <td className="p-4 text-center text-justice-light">Advanced</td>
                  <td className="p-4 text-center text-justice-light">Advanced</td>
                </tr>
                <tr className="border-b border-justice-light/10">
                  <td className="p-4 text-justice-light">Document Uploads</td>
                  <td className="p-4 text-center text-justice-light">5/month</td>
                  <td className="p-4 text-center text-justice-light">Unlimited</td>
                  <td className="p-4 text-center text-justice-light">Unlimited</td>
                </tr>
                <tr className="border-b border-justice-light/10">
                  <td className="p-4 text-justice-light">Precedent Explorer</td>
                  <td className="p-4 text-center text-justice-light">Limited</td>
                  <td className="p-4 text-center text-justice-light">Full</td>
                  <td className="p-4 text-center text-justice-light">Full + Custom</td>
                </tr>
                <tr className="border-b border-justice-light/10">
                  <td className="p-4 text-justice-light">Trial Simulation</td>
                  <td className="p-4 text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center text-justice-light">Limited</td>
                  <td className="p-4 text-center text-justice-light">Full</td>
                </tr>
                <tr className="border-b border-justice-light/10">
                  <td className="p-4 text-justice-light">AI Training</td>
                  <td className="p-4 text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
