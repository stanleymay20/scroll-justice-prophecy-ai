
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/layout/NavBar';
import { MetaTags } from '@/components/MetaTags';
import { CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const { checkSubscriptionStatus, subscriptionStatus, subscriptionTier } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const processSuccess = async () => {
      try {
        setLoading(true);
        
        console.log("Processing subscription success");
        // Update subscription status in the context
        await checkSubscriptionStatus();
        console.log("Subscription status updated:", { subscriptionStatus, subscriptionTier });
        
        // Wait a bit for animation
        setTimeout(() => {
          setLoading(false);
          
          // If no active subscription was found, show an error
          if (subscriptionStatus !== "active") {
            setError("Subscription could not be processed. Please try again later or contact support.");
            return;
          }
        }, 1500);
        
        // Redirect to dashboard after another delay if subscription is active
        if (subscriptionStatus === "active") {
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        }
      } catch (error) {
        console.error('Error processing subscription success:', error);
        setLoading(false);
        setError("Subscription could not be processed. Please try again later or contact support.");
        toast({
          title: "Subscription Error",
          description: "There was an issue processing your subscription. Please contact support.",
          variant: "destructive",
        });
      }
    };
    
    processSuccess();
  }, [navigate, checkSubscriptionStatus]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="Subscription Success" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-2xl mx-auto mt-12 bg-black/30 p-8 rounded-lg border border-justice-primary/30">
          <div className="text-center">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-24 w-24 mx-auto bg-justice-primary/20 rounded-full flex items-center justify-center">
                  <Loader className="h-12 w-12 text-justice-primary animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-white mt-6">Processing Your Subscription</h2>
                <p className="text-justice-light mt-2">
                  The sacred scrolls are activating your new membership...
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-600/30 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Subscription Error</h2>
                <p className="text-red-300 mb-6">{error}</p>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => window.location.reload()} className="bg-justice-primary hover:bg-justice-primary/80">
                    Try Again
                  </Button>
                  <Button onClick={() => navigate("/subscription/plans")} variant="outline" className="border-justice-primary text-justice-primary">
                    View Plans
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="h-24 w-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mt-6">Subscription Successful!</h2>
                <p className="text-justice-light mt-2">
                  Your access to the sacred scrolls has been elevated.
                  Redirecting you to the dashboard...
                </p>
                
                <div className="mt-8">
                  <Button onClick={() => navigate('/dashboard')} className="bg-justice-tertiary hover:bg-justice-tertiary/80">
                    Go to Dashboard
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
