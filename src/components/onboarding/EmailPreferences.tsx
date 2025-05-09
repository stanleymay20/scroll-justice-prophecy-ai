
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language';
import { useEmailPreferences } from '@/hooks/useEmailPreferences';
import PreferenceToggle from './PreferenceToggle';

const EmailPreferences = () => {
  const { t } = useLanguage();
  const {
    preferences,
    loading,
    saving,
    handleTogglePreference,
    handleSave,
    handleOptOut
  } = useEmailPreferences();
  
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
        <PreferenceToggle
          label={t('preferences.email.welcome') || 'Welcome emails'}
          checked={preferences.receiveWelcome}
          onChange={() => handleTogglePreference('receiveWelcome')}
        />
        
        <PreferenceToggle
          label={t('preferences.email.petition') || 'Petition guidance'}
          checked={preferences.receivePetition}
          onChange={() => handleTogglePreference('receivePetition')}
        />
        
        <PreferenceToggle
          label={t('preferences.email.subscription') || 'Subscription information'}
          checked={preferences.receiveSubscription}
          onChange={() => handleTogglePreference('receiveSubscription')}
        />
        
        <PreferenceToggle
          label={t('preferences.email.privacy') || 'Privacy updates'}
          checked={preferences.receivePrivacy}
          onChange={() => handleTogglePreference('receivePrivacy')}
        />
        
        <PreferenceToggle
          label={t('preferences.email.community') || 'Community events'}
          checked={preferences.receiveCommunity}
          onChange={() => handleTogglePreference('receiveCommunity')}
        />
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
