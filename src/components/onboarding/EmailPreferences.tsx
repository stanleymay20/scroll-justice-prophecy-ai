
import React from 'react';
import { useLanguage } from '@/contexts/language';
import { useEmailPreferences } from '@/hooks/useEmailPreferences';
import EmailPreferencesList from './EmailPreferencesList';
import EmailPreferencesActions from './EmailPreferencesActions';
import PreferenceLanguageSelect from './PreferenceLanguageSelect';

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
  
  // Enhanced loading state with fallback for language
  if (loading) {
    return (
      <div className="py-4 text-justice-light">
        {language ? (t('common.loading') || 'Loading...') : 'Loading...'}
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
