
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { openCustomerPortal } from "@/lib/stripe";
import { useLanguage } from "@/contexts/language";

const SubscriptionSuccess = () => {
  const [refreshing, setRefreshing] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Refresh subscription status when the page loads
  useEffect(() => {
    const refreshSubscription = async () => {
      setRefreshing(true);
      try {
        // Call check-subscription edge function to refresh status
        const { data, error } = await supabase.functions.invoke("check-subscription");
        
        if (error) {
          console.error("Error refreshing subscription:", error);
          throw error;
        }
        
        if (data?.subscribed) {
          setSubscriptionDetails({
            tier: data.subscription_tier,
            endDate: data.subscription_end ? new Date(data.subscription_end) : null
          });
        }
      } catch (err) {
        console.error("Failed to refresh subscription:", err);
      } finally {
        setRefreshing(false);
      }
    };
    
    refreshSubscription();
  }, []);

  const getPlanName = (tierCode: string) => {
    switch (tierCode?.toLowerCase()) {
      case 'basic':
        return "Flame Seeker";
      case 'professional':
        return "Scroll Advocate";
      case 'enterprise':
        return "Elder Judge";
      default:
        return tierCode || "Unknown Plan";
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { url } = await openCustomerPortal(`${window.location.origin}/subscription/plans`);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
    }
  };

  return (
    <div className="container max-w-2xl py-12">
      <Card className="bg-black/40 border-justice-secondary">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-justice-primary">
            Sacred Subscription Activated
          </CardTitle>
          <CardDescription>
            Thank you for supporting the ScrollJustice.AI mission.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center">
          {refreshing ? (
            <div className="flex flex-col items-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-justice-primary mb-2" />
              <p className="text-justice-light/70">Confirming your sacred covenant...</p>
            </div>
          ) : subscriptionDetails ? (
            <div className="text-center">
              <div className="mb-4 py-2 px-4 bg-justice-primary/10 border border-justice-primary/30 rounded-lg inline-block">
                <h3 className="text-xl font-bold text-justice-primary">
                  {getPlanName(subscriptionDetails.tier)}
                </h3>
              </div>
              
              <p className="text-justice-light mb-6">
                Your sacred powers have been bestowed. You now have access to all
                {' '}{subscriptionDetails.tier} tier features.
              </p>
              
              <div className="space-y-2 text-left bg-black/30 p-4 rounded-lg border border-justice-tertiary/30">
                <h4 className="font-medium text-justice-light">Your subscription includes:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li className="text-justice-light/80 text-sm">Enhanced petition processing</li>
                  <li className="text-justice-light/80 text-sm">Advanced integrity analysis</li>
                  <li className="text-justice-light/80 text-sm">Priority access to ancient precedents</li>
                  {subscriptionDetails.tier.toLowerCase() === 'professional' && (
                    <li className="text-justice-light/80 text-sm">Sacred scroll recovery tools</li>
                  )}
                  {subscriptionDetails.tier.toLowerCase() === 'enterprise' && (
                    <>
                      <li className="text-justice-light/80 text-sm">Sacred scroll recovery tools</li>
                      <li className="text-justice-light/80 text-sm">Full judicial authority</li>
                      <li className="text-justice-light/80 text-sm">Cross-jurisdictional verdict capabilities</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-justice-light">
                Your subscription has been processed, but we're still waiting for confirmation.
                Please check your dashboard later to see your subscription status.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto"
          >
            Go to Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleManageSubscription}
            className="w-full sm:w-auto"
          >
            Manage Subscription
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
