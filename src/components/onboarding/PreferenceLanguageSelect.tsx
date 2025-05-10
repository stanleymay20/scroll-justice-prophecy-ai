
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from '@/contexts/language';
import { LanguageCode } from '@/contexts/language/types';

interface PreferenceLanguageSelectProps {
  onChange?: (language: LanguageCode) => void;
}

const PreferenceLanguageSelect = ({
  onChange
}: PreferenceLanguageSelectProps) => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: string) => {
    const languageCode = value as LanguageCode;
    setLanguage(languageCode);
    if (onChange) {
      onChange(languageCode);
    }
  };

  // Define language options
  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' },
    { code: 'pt', name: 'Português' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'he', name: 'עברית' },
    { code: 'am', name: 'አማርኛ' }
  ];

  return (
    <div className="mb-4">
      <label className="block text-justice-light mb-2">
        {t('preferences.language') || 'Language Preference'}
      </label>
      <Select 
        value={language || 'en'} 
        onValueChange={handleLanguageChange}
        defaultValue="en"
      >
        <SelectTrigger className="w-full bg-black/30 text-justice-light border-justice-accent/30">
          <SelectValue placeholder={t('preferences.selectLanguage') || 'Select Language'} />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border-justice-accent/30">
          {languageOptions.map(option => (
            <SelectItem 
              key={option.code} 
              value={option.code}
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PreferenceLanguageSelect;
