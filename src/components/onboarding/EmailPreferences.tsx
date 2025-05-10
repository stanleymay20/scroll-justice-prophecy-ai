
import React from 'react';
import { useLanguage } from '@/contexts/language';
import { useEmailPreferences } from '@/hooks/useEmailPreferences';
import EmailPreferencesList from './EmailPreferencesList';
import EmailPreferencesActions from './EmailPreferencesActions';
import PreferenceLanguageSelect from './PreferenceLanguageSelect';
import { Loader2 } from 'lucide-react';

const EmailPreferences = () => {
  const { t, language } = useLanguage();
  const {
    preferences,
    loading,
    saving,
    handleTogglePreference,
    handleSave,
    handleOptOut
  } = useEmailPreferences();
  
  // Enhanced loading state with animation and fallback for language
  if (loading) {
    return (
      <div className="flex flex-col items-center py-8 text-justice-light">
        <Loader2 className="h-8 w-8 animate-spin text-justice-accent mb-4" />
        <p>{language ? (t('common.loading') || 'Loading...') : 'Loading preferences...'}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <p className="text-justice-light">
        {t('preferences.email.description') || 
          'Manage which types of emails you receive during your onboarding journey.'}
      </p>
      
      <PreferenceLanguageSelect />
      
      <EmailPreferencesList
        preferences={preferences}
        saving={saving}
        onTogglePreference={handleTogglePreference}
      />
      
      <EmailPreferencesActions
        saving={saving}
        onSave={handleSave}
        onOptOut={handleOptOut}
      />
    </div>
  );
};

export default EmailPreferences;
