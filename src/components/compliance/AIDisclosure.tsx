
import { useState } from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/language';

interface AIDisclosureProps {
  modelName?: string;
  compact?: boolean;
}

export const AIDisclosure = ({ 
  modelName = "GPT-4o", 
  compact = false 
}: AIDisclosureProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border border-justice-tertiary/30 rounded-md p-3 bg-black/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <InfoCircledIcon className="h-4 w-4 text-justice-light/50" />
          <span className="text-sm text-justice-light/80">
            {t('ai.disclosureLabel')}
          </span>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? t('button.hide') : t('button.show')}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="mt-3 space-y-2">
        {!compact && (
          <>
            <p className="text-sm text-justice-light/70">
              {t('ai.disclosureIntro', modelName)}
            </p>
            
            <h4 className="text-sm font-medium text-justice-light mt-2">
              {t('ai.disclosureRightsHeading')}
            </h4>
            <ul className="text-sm text-justice-light/70 list-disc pl-5 space-y-1">
              <li>{t('ai.disclosureRightOptOut')}</li>
              <li>{t('ai.disclosureRightAccess')}</li>
              <li>{t('ai.disclosureRightDelete')}</li>
              <li>{t('ai.disclosureRightCorrect')}</li>
            </ul>
            
            <p className="text-sm text-justice-light/70 mt-2">
              {t('ai.disclosureLimitations')}
            </p>
          </>
        )}
        
        <p className="text-xs text-justice-light/50">
          {t('ai.disclosureFooter')}
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
};
