
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useLanguage } from '@/contexts/language';
import { supabase } from '@/integrations/supabase/client';
import { updateOnboardingPreferences, optOutOfOnboarding } from '@/services/onboardingService';
import { useToast } from '@/hooks/use-toast';

// Define interface for email preferences
interface EmailPreferencesType {
  receiveWelcome: boolean;
  receivePetition: boolean;
  receiveSubscription: boolean;
  receivePrivacy: boolean;
  receiveCommunity: boolean;
}

const EmailPreferences = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState<EmailPreferencesType>({
    receiveWelcome: true,
    receivePetition: true,
    receiveSubscription: true,
    receivePrivacy: true,
    receiveCommunity: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.email) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_onboarding')
          .select('preferences')
          .eq('user_email', user.email)
          .maybeSingle();
        
        if (data?.preferences && typeof data.preferences === 'object') {
          // Type assertion to safely access properties
          const prefs = data.preferences as Record<string, boolean>;
          
          setPreferences({
            receiveWelcome: prefs.receiveWelcome ?? true,
            receivePetition: prefs.receivePetition ?? true,
            receiveSubscription: prefs.receiveSubscription ?? true,
            receivePrivacy: prefs.receivePrivacy ?? true,
            receiveCommunity: prefs.receiveCommunity ?? true,
          });
        }
      } catch (err) {
        console.error('Error loading email preferences:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, [user]);
  
  const handleTogglePreference = (key: keyof EmailPreferencesType) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleSave = async () => {
    if (!user?.email) return;
    
    setSaving(true);
    try {
      const success = await updateOnboardingPreferences(user.email, preferences);
      
      if (success) {
        toast({
          title: t('preferences.updated'),
          description: t('preferences.email.savedSuccess') || 'Your email preferences have been saved.',
        });
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (err) {
      console.error('Error saving email preferences:', err);
      toast({
        variant: 'destructive',
        title: t('error.title'),
        description: t('error.preferences.save') || 'Failed to save preferences. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleOptOut = async () => {
    if (!user?.email) return;
    
    setSaving(true);
    try {
      const success = await optOutOfOnboarding(user.email);
      
      if (success) {
        toast({
          title: t('preferences.optedOut'),
          description: t('preferences.email.optOutSuccess') || 'You have been opted out of all onboarding emails.',
        });
        
        // Update local state to reflect opt-out
        setPreferences({
          receiveWelcome: false,
          receivePetition: false,
          receiveSubscription: false,
          receivePrivacy: false,
          receiveCommunity: false,
        });
      } else {
        throw new Error('Failed to opt out');
      }
    } catch (err) {
      console.error('Error opting out of emails:', err);
      toast({
        variant: 'destructive',
        title: t('error.title'),
        description: t('error.preferences.optOut') || 'Failed to opt out. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="py-4 text-justice-light">
        {t('common.loading') || 'Loading...'}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <p className="text-justice-light">
        {t('preferences.email.description') || 
          'Manage which types of emails you receive during your onboarding journey.'}
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-justice-light">
            {t('preferences.email.welcome') || 'Welcome emails'}
          </label>
          <Switch 
            checked={preferences.receiveWelcome}
            onCheckedChange={() => handleTogglePreference('receiveWelcome')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-justice-light">
            {t('preferences.email.petition') || 'Petition guidance'}
          </label>
          <Switch 
            checked={preferences.receivePetition}
            onCheckedChange={() => handleTogglePreference('receivePetition')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-justice-light">
            {t('preferences.email.subscription') || 'Subscription information'}
          </label>
          <Switch 
            checked={preferences.receiveSubscription}
            onCheckedChange={() => handleTogglePreference('receiveSubscription')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-justice-light">
            {t('preferences.email.privacy') || 'Privacy updates'}
          </label>
          <Switch 
            checked={preferences.receivePrivacy}
            onCheckedChange={() => handleTogglePreference('receivePrivacy')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-justice-light">
            {t('preferences.email.community') || 'Community events'}
          </label>
          <Switch 
            checked={preferences.receiveCommunity}
            onCheckedChange={() => handleTogglePreference('receiveCommunity')}
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 pt-4">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-justice-accent hover:bg-justice-accent-hover"
        >
          {saving ? (t('common.saving') || 'Saving...') : (t('common.save') || 'Save Preferences')}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleOptOut}
          disabled={saving}
          className="border-justice-accent text-justice-accent hover:bg-justice-accent/10"
        >
          {t('preferences.email.optOut') || 'Opt out of all emails'}
        </Button>
      </div>
    </div>
  );
};

export default EmailPreferences;
