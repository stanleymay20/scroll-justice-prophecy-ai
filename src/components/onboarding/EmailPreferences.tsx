
import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/auth';
import { useLanguage } from '@/contexts/language';
import { supabase } from '@/integrations/supabase/client';
import { updateOnboardingPreferences, optOutOfOnboarding } from '@/services/onboardingService';

const EmailPreferences = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    receiveWelcome: true,
    receivePetition: true,
    receiveSubscription: true,
    receivePrivacy: true,
    receiveCommunity: true,
  });
  
  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);
  
  const loadPreferences = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('preferences')
        .eq('user_email', user?.email)
        .maybeSingle();
        
      if (!error && data?.preferences) {
        setPreferences({
          receiveWelcome: data.preferences.receiveWelcome ?? true,
          receivePetition: data.preferences.receivePetition ?? true,
          receiveSubscription: data.preferences.receiveSubscription ?? true,
          receivePrivacy: data.preferences.receivePrivacy ?? true,
          receiveCommunity: data.preferences.receiveCommunity ?? true,
        });
      }
    } catch (error) {
      console.error("Error loading email preferences:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    const success = await updateOnboardingPreferences(user.email, preferences);
    setLoading(false);
    
    if (success) {
      toast({
        title: "Preferences Updated",
        description: "Your sacred scroll communication preferences have been saved.",
        duration: 3000,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update your scroll preferences.",
        duration: 5000,
      });
    }
  };
  
  const handleUnsubscribe = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    const success = await optOutOfOnboarding(user.email);
    setLoading(false);
    
    if (success) {
      setPreferences({
        receiveWelcome: false,
        receivePetition: false,
        receiveSubscription: false,
        receivePrivacy: false,
        receiveCommunity: false,
      });
      
      toast({
        title: "Unsubscribed",
        description: "You have been unsubscribed from all scroll communications.",
        duration: 3000,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Unsubscribe Failed",
        description: "Could not unsubscribe you from scroll communications.",
        duration: 5000,
      });
    }
  };
  
  if (!user) {
    return (
      <Card className="border-justice-secondary/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-justice-light">Sacred Communication Preferences</CardTitle>
          <CardDescription>
            You must be signed in to manage your scroll communication preferences.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="border-justice-secondary/30 bg-black/40">
      <CardHeader>
        <CardTitle className="text-justice-light">Sacred Communication Preferences</CardTitle>
        <CardDescription>
          Control how the scrolls communicate with you on your journey.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="welcome">Welcome Message</Label>
              <p className="text-xs text-muted-foreground">
                Initial greeting from the Chief Scroll Keeper
              </p>
            </div>
            <Switch
              id="welcome"
              checked={preferences.receiveWelcome}
              disabled={loading}
              onCheckedChange={(checked) => handlePreferenceChange('receiveWelcome', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="petition">Petition Instructions</Label>
              <p className="text-xs text-muted-foreground">
                Guidance on filing your first sacred petition
              </p>
            </div>
            <Switch
              id="petition"
              checked={preferences.receivePetition}
              disabled={loading} 
              onCheckedChange={(checked) => handlePreferenceChange('receivePetition', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="subscription">Subscription Benefits</Label>
              <p className="text-xs text-muted-foreground">
                Sacred tiers and their exclusive privileges
              </p>
            </div>
            <Switch
              id="subscription"
              checked={preferences.receiveSubscription}
              disabled={loading}
              onCheckedChange={(checked) => handlePreferenceChange('receiveSubscription', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="privacy">Privacy & AI Covenant</Label>
              <p className="text-xs text-muted-foreground">
                Our sacred promises regarding your data
              </p>
            </div>
            <Switch
              id="privacy"
              checked={preferences.receivePrivacy}
              disabled={loading}
              onCheckedChange={(checked) => handlePreferenceChange('receivePrivacy', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="community">Community Invitations</Label>
              <p className="text-xs text-muted-foreground">
                Gather with fellow seekers in sacred assemblies
              </p>
            </div>
            <Switch
              id="community"
              checked={preferences.receiveCommunity}
              disabled={loading}
              onCheckedChange={(checked) => handlePreferenceChange('receiveCommunity', checked)}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleUnsubscribe}
          disabled={loading}
        >
          Unsubscribe from All
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-justice-tertiary hover:bg-justice-tertiary/80"
        >
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailPreferences;
