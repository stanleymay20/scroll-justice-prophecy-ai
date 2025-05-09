
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language';

interface EmailPreferencesActionsProps {
  saving: boolean;
  onSave: () => void;
  onOptOut: () => void;
}

const EmailPreferencesActions = ({
  saving,
  onSave,
  onOptOut
}: EmailPreferencesActionsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 pt-4">
      <Button 
        onClick={onSave} 
        disabled={saving}
        className="bg-justice-accent hover:bg-justice-accent-hover"
      >
        {saving ? (t('common.saving') || 'Saving...') : (t('common.save') || 'Save Preferences')}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onOptOut}
        disabled={saving}
        className="border-justice-accent text-justice-accent hover:bg-justice-accent/10"
      >
        {t('preferences.email.optOut') || 'Opt out of all emails'}
      </Button>
    </div>
  );
};

export default EmailPreferencesActions;
