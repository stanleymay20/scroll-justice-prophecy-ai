
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { requestAIDataDeletion } from '@/services/aiAuditService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/language';

interface AIDisclosureProps {
  aiModel?: string;
  compact?: boolean;
}

export const AIDisclosure = ({ 
  aiModel = 'ScrollJustice-AI-Assistant-1.0',
  compact = false
}: AIDisclosureProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleRequestDeletion = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: t('error.authRequired'),
          description: t('error.loginToRequest'),
          variant: 'destructive'
        });
        return;
      }
      
      const success = await requestAIDataDeletion(user.id);
      
      if (success) {
        toast({
          title: t('ai.dataDeleteRequested'),
          description: t('ai.dataDeleteProcessing'),
        });
      } else {
        throw new Error('Failed to process request');
      }
    } catch (err) {
      toast({
        title: t('error.requestFailed'),
        description: t('error.tryAgain'),
        variant: 'destructive'
      });
    }
  };
  
  if (compact) {
    return (
      <div className="flex items-center text-xs text-justice-light/50 mb-1">
        <InfoCircledIcon className="h-3 w-3 mr-1" />
        {t('ai.poweredBy')} {aiModel}
      </div>
    );
  }
  
  return (
    <Alert className="bg-black/30 border-justice-tertiary/30">
      <InfoCircledIcon className="h-4 w-4" />
      <AlertTitle>{t('ai.disclosureTitle')}</AlertTitle>
      <AlertDescription>
        <div className="text-sm">
          <p>
            {t('ai.disclosureText', aiModel)}
          </p>
          
          {isExpanded && (
            <>
              <h4 className="font-medium mt-2 mb-1">{t('ai.dataUseTitle')}</h4>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>{t('ai.dataUseItem1')}</li>
                <li>{t('ai.dataUseItem2')}</li>
                <li>{t('ai.dataUseItem3')}</li>
              </ul>
              
              <h4 className="font-medium mt-2 mb-1">{t('ai.yourRightsTitle')}</h4>
              <p className="mb-2">
                {t('ai.yourRightsText')}
              </p>
              
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleRequestDeletion}
              >
                {t('ai.requestDeletion')}
              </Button>
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? t('ai.showLess') : t('ai.learnMore')}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
