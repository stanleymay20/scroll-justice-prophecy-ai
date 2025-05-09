
import React from 'react';
import { useLanguage } from '@/contexts/language';
import PreferenceToggle from './PreferenceToggle';
import { EmailPreferencesType } from '@/types/onboarding';

interface EmailPreferencesListProps {
  preferences: EmailPreferencesType;
  saving: boolean;
  onTogglePreference: (key: keyof EmailPreferencesType) => void;
}

const EmailPreferencesList = ({
  preferences,
  saving,
  onTogglePreference
}: EmailPreferencesListProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <PreferenceToggle
        label={t('preferences.email.welcome') || 'Welcome emails'}
        checked={preferences.receiveWelcome}
        onChange={() => onTogglePreference('receiveWelcome')}
        disabled={saving}
      />
      
      <PreferenceToggle
        label={t('preferences.email.petition') || 'Petition guidance'}
        checked={preferences.receivePetition}
        onChange={() => onTogglePreference('receivePetition')}
        disabled={saving}
      />
      
      <PreferenceToggle
        label={t('preferences.email.subscription') || 'Subscription information'}
        checked={preferences.receiveSubscription}
        onChange={() => onTogglePreference('receiveSubscription')}
        disabled={saving}
      />
      
      <PreferenceToggle
        label={t('preferences.email.privacy') || 'Privacy updates'}
        checked={preferences.receivePrivacy}
        onChange={() => onTogglePreference('receivePrivacy')}
        disabled={saving}
      />
      
      <PreferenceToggle
        label={t('preferences.email.community') || 'Community events'}
        checked={preferences.receiveCommunity}
        onChange={() => onTogglePreference('receiveCommunity')}
        disabled={saving}
      />
    </div>
  );
};

export default EmailPreferencesList;
