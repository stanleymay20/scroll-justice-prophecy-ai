
import React from 'react';
import { useLanguage } from '@/contexts/language';
import { EmailPreferencesType } from '@/types/onboarding';
import PreferenceToggle from './PreferenceToggle';

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
  
  const preferenceItems = [
    {
      key: 'receiveWelcome' as keyof EmailPreferencesType,
      label: t('preferences.email.welcomeEmail') || 'Welcome Email'
    },
    {
      key: 'receivePetition' as keyof EmailPreferencesType,
      label: t('preferences.email.petitionEmail') || 'Petition Filing Guide'
    },
    {
      key: 'receiveSubscription' as keyof EmailPreferencesType,
      label: t('preferences.email.subscriptionEmail') || 'Subscription Information'
    },
    {
      key: 'receivePrivacy' as keyof EmailPreferencesType,
      label: t('preferences.email.privacyEmail') || 'Privacy Policy Updates'
    },
    {
      key: 'receiveCommunity' as keyof EmailPreferencesType,
      label: t('preferences.email.communityEmail') || 'Community Announcements'
    }
  ];
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-justice-light">
        {t('preferences.email.preferences') || 'Email Preferences'}
      </h2>
      
      {preferenceItems.map((item) => (
        <PreferenceToggle
          key={item.key}
          label={item.label}
          checked={preferences[item.key]}
          onChange={() => onTogglePreference(item.key)}
          disabled={saving}
        />
      ))}
    </div>
  );
};

export default EmailPreferencesList;
