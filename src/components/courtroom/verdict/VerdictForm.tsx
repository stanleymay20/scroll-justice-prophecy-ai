
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedScrollPetition } from "@/types/scroll-petition";
import { AIDisclosure } from "@/components/compliance/AIDisclosure";
import { ReasoningField } from "./ReasoningField";
import { VerdictButtons } from "./VerdictButtons";
import { AiSuggestionButton } from "./AiSuggestionButton";

export interface VerdictFormProps {
  petition: EnhancedScrollPetition;
  petitionId?: string;
  onVerdictSubmitted: () => void;
  onScrollSealed?: () => void;
}

export const VerdictForm = ({
  petition,
  petitionId,
  onVerdictSubmitted,
  onScrollSealed
}: VerdictFormProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [verdict, setVerdict] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSealing, setIsSealing] = useState(false);

  const id = petition?.id || petitionId;

  const handleSubmitVerdict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verdict || !reasoning || !id || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('scroll_petitions')
        .update({
          verdict,
          reasoning,
          status: 'verdict_delivered',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t("verdict.submitted"),
        description: t("verdict.submittedDescription"),
      });

      // Notify the parent component
      onVerdictSubmitted();
    } catch (error) {
      console.error("Error submitting verdict:", error);
      toast({
        title: t("verdict.error"),
        description: t("verdict.errorDescription"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSealScroll = async () => {
    if (!id || !user) return;

    setIsSealing(true);
    try {
      const { error } = await supabase
        .from('scroll_petitions')
        .update({
          is_sealed: true,
          status: 'sealed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t("scroll.sealed"),
        description: t("scroll.sealedDescription"),
      });

      // Notify the parent component
      if (onScrollSealed) {
        onScrollSealed();
      }
    } catch (error) {
      console.error("Error sealing scroll:", error);
      toast({
        title: t("scroll.sealError"),
        description: t("scroll.sealErrorDescription"),
        variant: "destructive"
      });
    } finally {
      setIsSealing(false);
    }
  };

  return (
    <form onSubmit={handleSubmitVerdict} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="verdict">{t("verdict.verdict")}</Label>
        <VerdictButtons 
          selectedVerdict={verdict} 
          onVerdictSelect={setVerdict} 
        />
      </div>

      <ReasoningField 
        reasoning={reasoning}
        setReasoning={setReasoning}
      />

      <div className="flex justify-between items-center">
        <AiSuggestionButton 
          petitionId={id!}
          setVerdict={setVerdict}
          setReasoning={setReasoning}
        />
        
        <div className="flex space-x-2">
          {petition?.status === 'verdict_delivered' && (
            <Button
              type="button"
              onClick={handleSealScroll}
              disabled={isSealing}
              variant="outline"
            >
              {isSealing ? t("button.sealing") : t("button.sealScroll")}
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={!verdict || !reasoning || isSubmitting || petition?.status === 'sealed'}
          >
            {isSubmitting ? t("button.submitting") : t("button.submitVerdict")}
          </Button>
        </div>
      </div>
      
      <AIDisclosure />
    </form>
  );
};
