
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/language';
import { LanguageGroup } from './LanguageGroup';

const languages = [
  { code: 'en' as const, name: 'English', flag: '🇺🇸', group: 'primary' },
  { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪', group: 'primary' },
  { code: 'fr' as const, name: 'Français', flag: '🇫🇷', group: 'primary' },
  { code: 'es' as const, name: 'Español', flag: '🇪🇸', group: 'primary' },
  { code: 'ar' as const, name: 'العربية', flag: '🇸🇦', group: 'extended' },
  { code: 'he' as const, name: 'עברית', flag: '🇮🇱', group: 'extended' },
  { code: 'hi' as const, name: 'हिन्दी', flag: '🇮🇳', group: 'extended' },
  { code: 'zh' as const, name: '中文', flag: '🇨🇳', group: 'extended' },
  { code: 'pt' as const, name: 'Português', flag: '🇧🇷', group: 'extended' },
  { code: 'sw' as const, name: 'Kiswahili', flag: '🇰🇪', group: 'sacred' },
  { code: 'am' as const, name: 'አማርኛ', flag: '🇪🇹', group: 'sacred' },
];

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);
  
  const primaryLanguages = languages.filter(lang => lang.group === 'primary');
  const extendedLanguages = languages.filter(lang => lang.group === 'extended');
  const sacredLanguages = languages.filter(lang => lang.group === 'sacred');

  const handleLanguageSelect = (code: any) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-justice-light hover:text-white">
          <Languages className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline-block">{currentLanguage?.flag}</span>
          <span className="ml-1 hidden md:inline-block">{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-justice-dark border-justice-light/20 w-48">
        <LanguageGroup
          title={t('language.primary')}
          languages={primaryLanguages}
          currentLanguage={language}
          onLanguageSelect={handleLanguageSelect}
        />
        
        <LanguageGroup
          title={t('language.extended')}
          languages={extendedLanguages}
          currentLanguage={language}
          onLanguageSelect={handleLanguageSelect}
        />
        
        <LanguageGroup
          title={t('language.sacred')}
          languages={sacredLanguages}
          currentLanguage={language}
          onLanguageSelect={handleLanguageSelect}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
