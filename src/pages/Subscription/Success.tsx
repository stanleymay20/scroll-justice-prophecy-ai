
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";
import { Check } from "lucide-react";

const SubscriptionSuccess = () => {
  const { user, checkSubscription } = useAuth();
  const [loading, setLoading] = useState(true);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
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
        
        const { data, error } = await supabase.functions.invoke("check-subscription");
        
        if (error) {
          console.error("Error invoking check-subscription function:", error);
          throw error;
        }
        
        console.log("Subscription verification response:", data);
        
        if (data?.subscribed) {
          setVerificationSuccess(true);
          checkSubscription(); // Update the global auth context
        } else if (verificationAttempts < 3) {
          // Try again after a delay - subscription info might take time to propagate
          setTimeout(() => {
            setVerificationAttempts(prev => prev + 1);
          }, 2000);
        }
      } catch (error) {
        console.error("Error verifying subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, [user, navigate, verificationAttempts, checkSubscription]);

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
              Please wait while we align your scroll subscription with the sacred principles.
            </p>
          </>
        ) : verificationSuccess ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-sacred-pulse">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-transparent bg-clip-text">
                Sacred Subscription Activated
              </span>
            </h2>
            <p className="text-justice-light/80 mb-8">
              Your ScrollJustice.AI subscription has been successfully activated. You now have access to sacred premium features.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => navigate("/dashboard")} 
                className="w-full bg-gradient-to-r from-justice-primary to-justice-secondary hover:opacity-90 transition-opacity"
              >
                Enter Sacred Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/subscription/manage")}
                className="w-full"
              >
                Manage Sacred Subscription
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">Sacred Alignment Error</h2>
            <p className="text-justice-light/80 mb-8">
              We couldn't verify your subscription status. Your payment might have been processed, but our sacred systems haven't updated yet.
            </p>
            <div className="space-y-4">
              <Button onClick={() => navigate("/dashboard")} className="w-full">
                Return to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/subscription/plans")}
                className="w-full"
              >
                View Subscription Plans
              </Button>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
};

export default SubscriptionSuccess;
