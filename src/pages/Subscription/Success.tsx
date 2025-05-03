
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/layout/NavBar';
import { MetaTags } from '@/components/MetaTags';
import { CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const { checkSubscriptionStatus } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const processSuccess = async () => {
      try {
        setLoading(true);
        
        // Update subscription status in the context
        await checkSubscriptionStatus();
        
        // Wait a bit for animation
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        
        // Redirect to blessing page after another delay
        setTimeout(() => {
          navigate('/blessing');
        }, 4000);
      } catch (error) {
        console.error('Error processing subscription success:', error);
        setLoading(false);
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
            ) : (
              <>
                <div className="h-24 w-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mt-6">Subscription Successful!</h2>
                <p className="text-justice-light mt-2">
                  Your access to the sacred scrolls has been elevated.
                  Redirecting you to receive your sacred blessings...
                </p>
                
                <div className="mt-8">
                  <Button onClick={() => navigate('/blessing')} className="bg-justice-tertiary hover:bg-justice-tertiary/80">
                    Continue to Blessings
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
