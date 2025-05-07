
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ContentAnalyzer } from "@/components/integrity/ContentAnalyzer";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AIDisclosure } from "@/components/compliance/AIDisclosure";
import { useLanguage } from "@/contexts/language";
import { ScrollPetition } from "@/types/petition";

interface PetitionFormProps {
  onSubmit?: (data: any) => void;
  onPetitionCreated?: (petition: ScrollPetition) => void;
  onCancel?: () => void;
}

export const PetitionForm = ({ 
  onSubmit,
  onPetitionCreated,
  onCancel
}: PetitionFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [integrityResult, setIntegrityResult] = useState<null | { score: number; issues: string[] }>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Validate the form whenever inputs change
  useEffect(() => {
    const valid = 
      title.trim().length >= 10 && 
      description.trim().length >= 50 &&
      (!integrityResult || integrityResult.score >= 50);
    
    setIsFormValid(valid);
  }, [title, description, integrityResult]);

  const handleIntegrityAnalysis = (result: any) => {
    // Update to match the ContentAnalyzer return type (score and issues)
    setIntegrityResult(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast({
        title: t("petition.invalidForm"),
        description: t("petition.checkFields"),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: t("auth.required"),
          description: t("auth.loginRequired"),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Create the petition in Supabase
      const { data: petition, error } = await supabase
        .from('scroll_petitions')
        .insert({
          title,
          description,
          petitioner_id: user.id,
          scroll_integrity_score: integrityResult?.score || 100,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: t("petition.submitted"),
        description: t("petition.successMessage"),
      });
      
      // Invoke the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(petition);
      }
      
      // Call the onPetitionCreated callback if provided
      if (onPetitionCreated) {
        onPetitionCreated(petition as ScrollPetition);
      }
      
      // Navigate to the petition detail page if no callbacks provided
      if (!onSubmit && !onPetitionCreated) {
        navigate(`/petition/${petition.id}`);
      }
    } catch (error) {
      console.error('Error submitting petition:', error);
      toast({
        title: t("error.submission"),
        description: t("error.tryAgain"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-black/40 border-justice-secondary">
      <CardHeader>
        <CardTitle className="text-justice-primary">{t("petition.new")}</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">{t("petition.title")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("petition.titlePlaceholder")}
              minLength={10}
              required
            />
            {title && title.length < 10 && (
              <p className="text-sm text-red-500 mt-1">{t("petition.titleTooShort")}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description">{t("petition.description")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("petition.descriptionPlaceholder")}
              className="min-h-[150px]"
              minLength={50}
              required
            />
            {description && description.length < 50 && (
              <p className="text-sm text-red-500 mt-1">{t("petition.descriptionTooShort")}</p>
            )}
          </div>
          
          <ContentAnalyzer
            initialContent={`${title}\n${description}`}
            onAnalysisComplete={handleIntegrityAnalysis}
          />
          
          <AIDisclosure />
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button 
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              {t("button.cancel")}
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={!isFormValid || isSubmitting}
            className={onCancel ? "" : "w-full"}
          >
            {isSubmitting ? t("button.submitting") : t("button.submit")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
