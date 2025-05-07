
import React, { useState, useEffect } from 'react';
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { useLanguage } from "@/contexts/language";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { optOutOfOnboarding } from '@/services/onboardingService';
import { Loader2 } from "lucide-react";

const Unsubscribe = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  const handleUnsubscribe = async () => {
    if (!email) return;

    setLoading(true);
    const result = await optOutOfOnboarding(email);
    setLoading(false);
    
    setSuccess(result);
    
    if (result) {
      toast({
        title: "Unsubscribed Successfully",
        description: "You have been unsubscribed from all scroll communications.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Unsubscribe Failed",
        description: "There was an error processing your unsubscribe request.",
      });
    }
  };
  
  const handleManagePreferences = () => {
    navigate('/preferences');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="Unsubscribe" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-md mx-auto">
          <Card className="border-justice-secondary/30 bg-black/40">
            <CardHeader>
              <CardTitle className="text-justice-light">Unsubscribe from Sacred Communications</CardTitle>
              <CardDescription>
                You are about to silence the scrolls. This action will stop all onboarding messages.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {success === null ? (
                <div className="space-y-4">
                  <p className="text-justice-light/80">
                    {email ? (
                      <>Unsubscribe <strong>{email}</strong> from all scroll communications?</>
                    ) : (
                      <>Unsubscribe from all scroll communications?</>
                    )}
                  </p>
                  
                  <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                    <Button
                      variant="destructive"
                      onClick={handleUnsubscribe}
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Unsubscribe All"
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleManagePreferences}
                      disabled={loading}
                      className="flex-1"
                    >
                      Manage Preferences Instead
                    </Button>
                  </div>
                </div>
              ) : success ? (
                <div className="text-center space-y-4">
                  <div className="bg-green-900/20 text-green-400 p-3 rounded-md">
                    <p className="font-semibold">Unsubscribe Successful</p>
                    <p className="text-sm">
                      You have been unsubscribed from all scroll communications.
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/')}
                    >
                      Return to Home
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-red-900/20 text-red-400 p-3 rounded-md">
                    <p className="font-semibold">Unsubscribe Failed</p>
                    <p className="text-sm">
                      There was an error processing your request. Please try again.
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={handleUnsubscribe}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;
