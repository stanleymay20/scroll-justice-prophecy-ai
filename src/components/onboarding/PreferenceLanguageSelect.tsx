
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

  // Define language options with proper typing
  const languageOptions = [
    { code: 'en' as LanguageCode, name: 'English' },
    { code: 'fr' as LanguageCode, name: 'Français' },
    { code: 'es' as LanguageCode, name: 'Español' },
    { code: 'de' as LanguageCode, name: 'Deutsch' },
    { code: 'zh' as LanguageCode, name: '中文' },
    { code: 'ar' as LanguageCode, name: 'العربية' },
    { code: 'pt' as LanguageCode, name: 'Português' },
    { code: 'hi' as LanguageCode, name: 'हिन्दी' },
    { code: 'sw' as LanguageCode, name: 'Kiswahili' },
    { code: 'he' as LanguageCode, name: 'עברית' },
    { code: 'am' as LanguageCode, name: 'አማርኛ' }
  ];

  return (
    <div className="mb-4">
      <label className="block text-justice-light mb-2">
        {t('preferences.language') || 'Language Preference'}
      </label>
      <Select 
        value={language} 
        onValueChange={handleLanguageChange} 
        defaultValue="en"
      >
        <SelectTrigger className="w-full bg-black/30 text-justice-light border-justice-accent/30">
          <SelectValue placeholder={t('preferences.selectLanguage') || 'Select Language'} />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border-justice-accent/30">
          {languageOptions.map(option => (
            <SelectItem key={option.code} value={option.code}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PreferenceLanguageSelect;
