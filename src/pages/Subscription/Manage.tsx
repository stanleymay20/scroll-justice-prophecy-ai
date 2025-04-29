
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { ExternalLink, Info, Loader2, RefreshCw } from "lucide-react";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";

const ManageSubscription = () => {
  const { user, subscriptionTier, subscriptionStatus, subscriptionEnd, checkSubscriptionStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin?redirect=/subscription/manage");
    }
  }, [user, navigate]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTier = (tier: string | null) => {
    if (!tier) return "None";
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const formatStatus = (status: string | null) => {
    if (!status) return "Not subscribed";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleOpenPortal = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        body: { returnUrl: window.location.href }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error: any) {
      console.error("Customer portal error:", error);
      toast({
        title: "Error opening customer portal",
        description: error.message || "There was a problem accessing your subscription details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    try {
      setCheckingStatus(true);
      await checkSubscriptionStatus();
      toast({
        title: "Subscription status updated",
        description: "Your subscription information has been refreshed.",
      });
    } catch (error: any) {
      console.error("Error refreshing subscription:", error);
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your subscription status.",
        variant: "destructive",
      });
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Sacred Subscription Management</h1>
          <p className="text-justice-light/80">
            View and manage your ScrollJustice.AI subscription details.
          </p>
        </div>

        <GlassCard className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Subscription Overview</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-justice-light/70 mb-1">Current Plan</h3>
              <p className="text-xl font-semibold text-white">{formatTier(subscriptionTier) || "Free"}</p>
            </div>
            
            <div>
              <h3 className="text-justice-light/70 mb-1">Status</h3>
              <div className="flex items-center">
                {subscriptionStatus === "active" ? (
                  <div className="flex items-center">
                    <PulseEffect color="bg-green-500" size="sm" className="mr-2" />
                    <span className="text-white">Active</span>
                  </div>
                ) : (
                  <span className="text-white">{formatStatus(subscriptionStatus)}</span>
                )}
              </div>
            </div>
            
            {subscriptionEnd && (
              <div>
                <h3 className="text-justice-light/70 mb-1">Renews On</h3>
                <p className="text-white">{formatDate(subscriptionEnd)}</p>
              </div>
            )}
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleOpenPortal}
                  className="flex-1"
                  disabled={loading || subscriptionStatus !== "active"}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opening Portal...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Manage Billing
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={refreshSubscriptionStatus}
                  className="flex-1"
                  disabled={checkingStatus}
                >
                  {checkingStatus ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Status
                    </>
                  )}
                </Button>
              </div>

              {subscriptionStatus !== "active" && (
                <div className="mt-4 flex">
                  <Button 
                    onClick={() => navigate("/subscription/plans")}
                    className="flex-1"
                  >
                    View Subscription Plans
                  </Button>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {subscriptionStatus === "active" && (
          <GlassCard className="p-6">
            <div className="flex items-start mb-4">
              <Info className="h-5 w-5 text-justice-light mr-2 shrink-0 mt-0.5" />
              <p className="text-justice-light/80 text-sm">
                You can manage your subscription through the Billing Portal, where you can:
              </p>
            </div>
            <ul className="space-y-2 text-sm text-justice-light/80 ml-7 mb-4 list-disc">
              <li>Update your payment method</li>
              <li>Change your billing cycle</li>
              <li>Upgrade or downgrade your plan</li>
              <li>Cancel your subscription</li>
              <li>View your billing history</li>
            </ul>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default ManageSubscription;
