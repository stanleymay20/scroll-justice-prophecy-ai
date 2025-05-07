
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { formatDistanceToNow } from "date-fns";
import { EnhancedScrollPetition, PetitionStatus } from "@/types/scroll-petition";
import { VerdictForm } from "./verdict/VerdictForm";
import SacredOathScreen from "./SacredOathScreen";

export const PetitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isJudge } = useAuth();
  const { toast } = useToast();
  
  const [petition, setPetition] = useState<EnhancedScrollPetition | null>(null);
  const [loading, setLoading] = useState(true);
  const [oathCompleted, setOathCompleted] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchPetition(id);
    }
  }, [id]);
  
  const fetchPetition = async (petitionId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('scroll_petitions')
        .select(`
          *,
          petitioner:petitioner_id(username),
          judge:assigned_judge_id(username)
        `)
        .eq('id', petitionId)
        .single();
        
      if (error) throw error;
      
      const timeAgo = formatDistanceToNow(new Date(data.created_at), { addSuffix: true });
      const petitionerName = data.petitioner?.username || "Anonymous";
      const judgeName = data.judge?.username || "Unassigned";
      
      setPetition({
        ...data,
        timeAgo,
        petitionerName,
        judgeName,
        status: data.status as PetitionStatus,
        reasoning: data.verdict_reasoning
      });
    } catch (error) {
      console.error("Error fetching petition:", error);
      toast({
        title: t("error.loading"),
        description: t("error.tryAgain"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAssignToMe = async () => {
    if (!user || !petition) return;
    
    try {
      const { error } = await supabase
        .from('scroll_petitions')
        .update({
          assigned_judge_id: user.id,
          status: 'in_review',
          updated_at: new Date().toISOString()
        })
        .eq('id', petition.id);
        
      if (error) throw error;
      
      toast({
        title: t("petition.assigned"),
        description: t("petition.assignedToYou"),
        variant: "success"
      });
      
      // Refresh the petition data
      fetchPetition(petition.id);
    } catch (error) {
      console.error("Error assigning petition:", error);
      toast({
        title: t("error.assigning"),
        description: t("error.tryAgain"),
        variant: "destructive"
      });
    }
  };
  
  const handleVerdictSubmitted = () => {
    fetchPetition(id!);
  };
  
  const handleScrollSealed = () => {
    fetchPetition(id!);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-justice-primary" />
      </div>
    );
  }
  
  if (!petition) {
    return (
      <Card className="bg-black/40 border-justice-secondary">
        <CardContent className="pt-6 text-center">
          <p>{t("petition.notFound")}</p>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mt-4"
          >
            {t("button.back")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {isJudge && petition.status === 'pending' && !oathCompleted && (
        <SacredOathScreen onComplete={() => setOathCompleted(true)} />
      )}
      
      <Card className="bg-black/40 border-justice-secondary">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-justice-primary text-2xl">
              {petition.title}
            </CardTitle>
            <Badge variant={
              petition.status === 'pending' ? 'outline' :
              petition.status === 'in_review' ? 'secondary' :
              petition.status === 'verdict_delivered' ? 'default' :
              petition.status === 'sealed' ? 'destructive' :
              'outline'
            }>
              {t(`petition.status.${petition.status}`)}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {t("petition.submittedBy", {
              name: petition.petitionerName,
              time: petition.timeAgo
            })}
          </div>
          {petition.judgeName && petition.judgeName !== "Unassigned" && (
            <div className="text-sm text-muted-foreground">
              {t("petition.assignedTo", { name: petition.judgeName })}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="whitespace-pre-wrap bg-black/20 p-4 rounded">
            {petition.description}
          </div>
          
          {petition.verdict && petition.status !== 'pending' && (
            <>
              <div className="border-t border-justice-secondary my-4"></div>
              <h3 className="text-xl font-semibold text-justice-gold">
                {t("verdict.verdict")}:
              </h3>
              <div className="font-bold text-lg">
                {petition.verdict}
              </div>
              
              <h3 className="text-xl font-semibold text-justice-gold mt-4">
                {t("verdict.reasoning")}:
              </h3>
              <div className="whitespace-pre-wrap bg-black/20 p-4 rounded">
                {petition.reasoning}
              </div>
            </>
          )}
          
          {isJudge && petition.status === 'pending' && oathCompleted && (
            <Button 
              onClick={handleAssignToMe} 
              className="w-full mt-4"
            >
              {t("button.assignToMe")}
            </Button>
          )}
          
          {isJudge && user?.id === petition.assigned_judge_id && 
           ['in_review', 'verdict_delivered'].includes(petition.status) && (
            <div className="mt-6 border-t border-justice-secondary pt-4">
              <h3 className="text-xl font-semibold mb-4">
                {t("verdict.deliverVerdict")}
              </h3>
              <VerdictForm 
                petition={petition}
                onVerdictSubmitted={handleVerdictSubmitted} 
                onScrollSealed={handleScrollSealed}
              />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
          >
            {t("button.back")}
          </Button>
          
          {petition.status === 'verdict_delivered' && (
            <Button 
              variant="secondary"
              onClick={() => {
                // Share functionality
              }}
            >
              {t("button.share")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
};
