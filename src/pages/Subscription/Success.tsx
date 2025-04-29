
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { useAuth } from "@/contexts/AuthContext";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";
import { Check } from "lucide-react";

const SubscriptionSuccess = () => {
  const { user, checkSubscriptionStatus, subscriptionStatus, subscriptionTier } = useAuth();
  const [loading, setLoading] = useState(true);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySubscription = async () => {
      if (!user) {
        // No user logged in, redirect to sign in
        navigate("/signin?redirect=/subscription/plans");
        return;
      }

      try {
        setLoading(true);
        console.log("Verifying subscription for user:", user.id);
        
        await checkSubscriptionStatus();
        
        if (subscriptionStatus !== "active" && verificationAttempts < 5) {
          // Try again after a delay - subscription info might take time to propagate
          setTimeout(() => {
            setVerificationAttempts(prev => prev + 1);
          }, 2000);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error verifying subscription:", error);
        setLoading(false);
      }
    };

    verifySubscription();
  }, [user, navigate, verificationAttempts, checkSubscriptionStatus, subscriptionStatus]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-justice-dark to-black p-4">
      <GlassCard className="w-full max-w-md p-8 text-center">
        {loading ? (
          <>
            <h2 className="text-2xl font-semibold text-white mb-6">Verifying your sacred subscription...</h2>
            <div className="flex justify-center mb-6">
              <PulseEffect color="bg-justice-primary" size="lg" />
            </div>
            <p className="text-justice-light/80">
              Please wait while we confirm your subscription details in the sacred database.
            </p>
          </>
        ) : subscriptionStatus === "active" ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Sacred Subscription Activated!</h2>
            <p className="text-justice-light/80 mb-8">
              Thank you for subscribing to ScrollJustice.AI. Your account has been blessed with {subscriptionTier} access and you now have access to premium features.
            </p>
            <div className="space-y-4">
              <Button onClick={() => navigate("/")} className="w-full">
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/subscription/manage")}
                className="w-full"
              >
                Manage Subscription
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">Verification in progress</h2>
            <p className="text-justice-light/80 mb-8">
              Your payment is being processed. Your subscription should be activated shortly. If your subscription is not activated within a few minutes, please try refreshing the page.
            </p>
            <div className="space-y-4">
              <Button onClick={() => navigate("/")} className="w-full">
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setLoading(true);
                  setVerificationAttempts(0);
                }}
                className="w-full"
              >
                Check Again
              </Button>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
};

export default SubscriptionSuccess;
