
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from '@/contexts/language';

interface AIConsentToggleProps {
  userRole?: string;
  onConsentChange: (consent: boolean) => void;
  defaultConsent?: boolean;
}

export const AIConsentToggle = ({ 
  userRole = "user", 
  onConsentChange, 
  defaultConsent = true 
}: AIConsentToggleProps) => {
  const [hasConsented, setHasConsented] = useState(defaultConsent);
  const { t } = useLanguage();
  
  const handleConsentChange = (checked: boolean) => {
    setHasConsented(checked);
    onConsentChange(checked);
  };
  
  return (
    <div className="flex items-center justify-between space-x-2 p-3 border border-justice-tertiary/20 rounded-md bg-black/20">
      <div className="flex items-center space-x-2">
        <Label htmlFor="ai-consent" className="text-sm flex items-center">
          {t('ai.consentLabel')}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircledIcon className="h-3.5 w-3.5 ml-1 text-justice-light/50" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  {t('ai.consentTooltip')}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
      </div>
      <Switch 
        id="ai-consent" 
        checked={hasConsented} 
        onCheckedChange={handleConsentChange}
      />
    </div>
  );
};
