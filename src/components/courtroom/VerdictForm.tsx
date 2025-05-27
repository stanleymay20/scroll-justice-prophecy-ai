
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getAiSuggestedVerdict } from "@/services/integrityService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/language";

interface VerdictFormProps {
  petitionId: string;
  petitionTitle: string;
  petitionDescription: string;
  onVerdictSubmitted: () => void;
}

export const VerdictForm = ({ 
  petitionId, 
  petitionTitle, 
  petitionDescription, 
  onVerdictSubmitted 
}: VerdictFormProps) => {
  const [verdict, setVerdict] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestingVerdict, setSuggestingVerdict] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleGetAiSuggestion = async () => {
    setSuggestingVerdict(true);
    setError(null);
    
    try {
      const aiVerdict = await getAiSuggestedVerdict(petitionTitle, petitionDescription);
      
      if (aiVerdict) {
        toast({
          title: "AI Suggestion Generated",
          description: "The AI has analyzed the case and provided a suggested verdict.",
        });
        
        // Update database with AI suggestion
        await supabase
          .from('scroll_petitions')
          .update({ ai_suggested_verdict: aiVerdict.suggested_verdict })
          .eq('id', petitionId);
          
        // Set the reasoning field with AI's reasoning
        setReasoning(aiVerdict.reasoning || "");
        setVerdict(aiVerdict.suggested_verdict || "");
      } else {
        setError("Failed to generate AI suggestion");
      }
    } catch (err) {
      console.error("Error getting AI verdict:", err);
      setError("AI analysis failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSuggestingVerdict(false);
    }
  };
  
  const handleSubmitVerdict = async (approved: boolean) => {
    if (!reasoning) {
      toast({
        title: "Missing Reasoning",
        description: "Please provide reasoning for your verdict.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const verdictText = approved ? "APPROVED" : "REJECTED";
      
      const { error } = await supabase
        .from('scroll_petitions')
        .update({
          verdict: verdictText,
          verdict_reasoning: reasoning,
          verdict_timestamp: new Date().toISOString(),
          status: approved ? 'verdict_delivered' : 'rejected'
        })
        .eq('id', petitionId);
      
      if (error) throw error;
      
      // Log the verdict in scroll_integrity_logs
      await supabase
        .from('scroll_integrity_logs')
        .insert({
          action_type: approved ? 'VERDICT_APPROVED' : 'VERDICT_REJECTED',
          integrity_impact: approved ? 10 : -5,
          description: `Verdict delivered: ${verdictText}`,
          petition_id: petitionId,
        });
      
      toast({
        title: approved ? "Petition Approved" : "Petition Rejected",
        description: "The verdict has been recorded in the sacred scrolls.",
      });
      
      onVerdictSubmitted();
    } catch (err) {
      console.error("Error submitting verdict:", err);
      setError("Failed to submit verdict: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4 bg-black/20 p-4 rounded-lg border border-justice-primary/30">
      <h3 className="text-lg font-medium text-white">Sacred Verdict</h3>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-justice-light">Legal Reasoning</label>
          <Textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            placeholder="Provide detailed legal reasoning for your verdict..."
            className="mt-1 h-32"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            onClick={handleGetAiSuggestion}
            disabled={suggestingVerdict}
            className="flex-1"
          >
            {suggestingVerdict ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Consulting AI...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Get AI Suggestion
              </>
            )}
          </Button>
        </div>
        
        <div className="p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg">
          <p className="text-amber-200 text-sm">
            <strong>Judicial Responsibility:</strong> AI suggestions are advisory only. 
            As a judge, you are responsible for the final verdict and must ensure it complies 
            with applicable law and ethical standards.
          </p>
        </div>
        
        <div className="flex space-x-4">
          <Button
            variant="default"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => handleSubmitVerdict(true)}
            disabled={loading || !reasoning}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve Petition
          </Button>
          
          <Button
            variant="default"
            className="flex-1 bg-red-600 hover:bg-red-700"
            onClick={() => handleSubmitVerdict(false)}
            disabled={loading || !reasoning}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject Petition
          </Button>
        </div>
      </div>
    </div>
  );
};
