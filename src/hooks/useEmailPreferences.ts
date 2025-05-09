
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { EmailPreferencesType } from '@/types/onboarding';
import { updateOnboardingPreferences, optOutOfOnboarding } from '@/services/onboardingService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language';

export const useEmailPreferences = () => {
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

  return {
    preferences,
    loading,
    saving,
    handleTogglePreference,
    handleSave,
    handleOptOut
  };
};
