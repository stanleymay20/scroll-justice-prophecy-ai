
import React, { useEffect } from 'react';
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { useLanguage } from "@/contexts/language";
import { useAuth } from "@/contexts/auth";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const { t } = useLanguage();
  const { refreshSession, checkSubscriptionStatus } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Refresh the auth session to make sure we get updated subscription info
    const updateAuthData = async () => {
      await refreshSession();
      await checkSubscriptionStatus();
    };
    
    updateAuthData();
  }, [refreshSession, checkSubscriptionStatus]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("subscription.success.title") || "Subscription Success"} />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-lg mx-auto">
          <Card className="border-justice-tertiary/50 bg-black/40 overflow-hidden">
            <div className="bg-justice-tertiary/20 p-8 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-justice-tertiary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            
            <CardContent className="p-8 text-center">
              <h1 className="text-3xl font-bold text-justice-light mb-4">Subscription Successful</h1>
              <p className="text-justice-light/70 mb-6">
                Your sacred scroll subscription has been activated. You now have access to enhanced sacred knowledge and petition filing abilities.
              </p>
              
              <div className="p-4 border border-justice-tertiary/30 rounded-md bg-justice-tertiary/5 mb-6">
                <p className="text-justice-light text-sm">
                  "The true seeker of justice must possess not only the wisdom to understand the scrolls, but also the humility to be guided by them."
                </p>
                <p className="text-justice-light/50 text-xs mt-2">
                  — Ancient Scroll Wisdom
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="bg-black/40 px-8 py-6 flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1 bg-justice-tertiary hover:bg-justice-tertiary/80 text-black"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-justice-secondary/30 hover:bg-justice-secondary/10"
                onClick={() => navigate('/subscription/manage')}
              >
                Manage Subscription
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Success;
