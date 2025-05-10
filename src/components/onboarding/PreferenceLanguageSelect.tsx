
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

  return (
    <div className="mb-4">
      <label className="block text-justice-light mb-2">
        {t('preferences.language') || 'Language Preference'}
      </label>
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full bg-black/30 text-justice-light border-justice-accent/30">
          <SelectValue placeholder={t('preferences.selectLanguage') || 'Select Language'} />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border-justice-accent/30">
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="es">Español</SelectItem>
          <SelectItem value="de">Deutsch</SelectItem>
          <SelectItem value="zh">中文</SelectItem>
          <SelectItem value="ar">العربية</SelectItem>
          <SelectItem value="pt">Português</SelectItem>
          <SelectItem value="hi">हिन्दी</SelectItem>
          <SelectItem value="sw">Kiswahili</SelectItem>
          <SelectItem value="he">עברית</SelectItem>
          <SelectItem value="am">አማርኛ</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PreferenceLanguageSelect;
