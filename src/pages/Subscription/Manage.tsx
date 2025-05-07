
import React from 'react';
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { useLanguage } from "@/contexts/language";
import { useAuth } from "@/contexts/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Manage = () => {
  const { t } = useLanguage();
  const { user, subscription } = useAuth();
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("subscription.manage.title") || "Manage Subscription"} />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <h1 className="text-3xl font-bold text-justice-light mb-8 text-center">Manage Your Sacred Scroll Subscription</h1>
        
        <div className="max-w-3xl mx-auto">
          {subscription && subscription.active ? (
            <>
              <Card className="border-justice-secondary/30 bg-black/40 mb-6">
                <CardHeader>
                  <CardTitle className="text-justice-light">Current Subscription</CardTitle>
                  <CardDescription>
                    Your sacred scroll membership details and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between border-b border-justice-light/10 pb-2">
                    <span className="text-justice-light/70">Plan</span>
                    <span className="font-medium text-justice-light capitalize">{subscription.tier || 'Basic'}</span>
                  </div>
                  <div className="flex justify-between border-b border-justice-light/10 pb-2">
                    <span className="text-justice-light/70">Status</span>
                    <span className="font-medium text-justice-tertiary capitalize">{subscription.status || 'Active'}</span>
                  </div>
                  <div className="flex justify-between border-b border-justice-light/10 pb-2">
                    <span className="text-justice-light/70">Renewal Date</span>
                    <span className="font-medium text-justice-light">{formatDate(subscription.current_period_end)}</span>
                  </div>
                  
                  <div className="pt-4 flex justify-center">
                    <Button className="bg-justice-tertiary hover:bg-justice-tertiary/80 text-black">
                      Manage Payment Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-justice-primary/20 bg-black/40">
                <CardHeader>
                  <CardTitle className="text-justice-light">Subscription Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-3">
                    <Button variant="outline" className="border-justice-secondary/30 hover:bg-justice-secondary/10">
                      Upgrade Plan
                    </Button>
                    <Button variant="outline" className="border-justice-secondary/30 hover:bg-justice-secondary/10">
                      Change Payment Method
                    </Button>
                    <Button variant="outline" className="border-justice-danger/30 hover:bg-justice-danger/10 text-justice-danger">
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-justice-secondary/30 bg-black/40">
              <CardHeader>
                <CardTitle className="text-justice-light">No Active Subscription</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-6">
                <p className="text-justice-light/70 mb-6">
                  You don't currently have an active Sacred Scroll subscription. 
                  Subscribe to gain access to enhanced scroll features and sacred knowledge.
                </p>
                <Button asChild className="bg-justice-tertiary hover:bg-justice-tertiary/80 text-black">
                  <a href="/subscription/plans">View Subscription Plans</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Manage;
