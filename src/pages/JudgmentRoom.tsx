
import { useEffect, useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/language";
import { MetaTags } from "@/components/MetaTags";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ScrollPetition } from "@/types/petition";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const JudgmentRoom = () => {
  const { user, userRole } = useAuth();
  const { t } = useLanguage();
  const [selectedPetition, setSelectedPetition] = useState<ScrollPetition | null>(null);
  const [verdict, setVerdict] = useState<string>("");
  const [verdictReasoning, setVerdictReasoning] = useState<string>("");
  const [isJudging, setIsJudging] = useState(false);
  
  // Check if user is a judge
  const isJudge = userRole === "elder_judge" || userRole === "admin";
  
  // Fetch petitions
  const { data: petitions, isLoading, refetch } = useQuery({
    queryKey: ['petitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scroll_petitions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ScrollPetition[];
    },
  });
  
  // Submit verdict
  const handleSubmitVerdict = async () => {
    if (!selectedPetition) return;
    
    try {
      setIsJudging(true);
      
      const { error } = await supabase
        .from('scroll_petitions')
        .update({
          status: verdict === 'rejected' ? 'rejected' : 'verdict_delivered',
          verdict,
          verdict_reasoning: verdictReasoning,
          verdict_timestamp: new Date().toISOString(),
        })
        .eq('id', selectedPetition.id);
      
      if (error) throw error;
      
      toast({
        title: "Justice Released",
        description: "The verdict has been entered in the sacred scrolls",
      });
      
      // Reset and refetch
      setSelectedPetition(null);
      setVerdict("");
      setVerdictReasoning("");
      refetch();
      
    } catch (error) {
      console.error("Error submitting verdict:", error);
      toast({
        title: "Error submitting verdict",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsJudging(false);
    }
  };

  // Filter petitions by status
  const pendingPetitions = petitions?.filter(petition => petition.status === 'pending') || [];
  const judgedPetitions = petitions?.filter(petition => 
    petition.status === 'verdict_delivered' || petition.status === 'rejected'
  ) || [];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("judgmentRoom.title", "Judgment Room")} />
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-cinzel text-white text-center mb-8">
          {t("judgmentRoom.title", "Sacred Scroll Judgment Room")}
        </h1>
        
        <Tabs defaultValue="pending" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="bg-black/30">
              <TabsTrigger value="pending">Pending Petitions</TabsTrigger>
              <TabsTrigger value="judged">Judged Petitions</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="pending" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <PulseEffect color="bg-justice-primary" size="lg" />
              </div>
            ) : pendingPetitions.length === 0 ? (
              <GlassCard className="p-6 text-center">
                <p className="text-justice-light">No pending petitions found</p>
              </GlassCard>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  {pendingPetitions.map((petition) => (
                    <GlassCard 
                      key={petition.id} 
                      className={`p-6 cursor-pointer transition-all ${
                        selectedPetition?.id === petition.id 
                          ? "border-justice-primary bg-justice-primary/10" 
                          : ""
                      }`}
                      onClick={() => setSelectedPetition(petition)}
                    >
                      <h3 className="text-xl font-semibold text-white mb-2">{petition.title}</h3>
                      <p className="text-sm text-justice-light/80 mb-4">
                        Filed on {new Date(petition.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-justice-light mb-4 line-clamp-3">{petition.description}</p>
                      {isJudge && (
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPetition(petition);
                          }}
                          className="bg-justice-primary hover:bg-justice-primary/90"
                        >
                          Review Petition
                        </Button>
                      )}
                    </GlassCard>
                  ))}
                </div>
                
                {isJudge && selectedPetition && (
                  <GlassCard className="p-6 mt-8">
                    <h2 className="text-2xl font-cinzel text-white mb-4">Render Judgment</h2>
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{selectedPetition.title}</h3>
                      <p className="text-justice-light whitespace-pre-line">{selectedPetition.description}</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-justice-light">
                          Verdict
                        </label>
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            onClick={() => setVerdict("granted")}
                            variant={verdict === "granted" ? "default" : "outline"}
                            className={verdict === "granted" ? "bg-green-600" : "border-green-600/50"}
                          >
                            Grant Petition
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setVerdict("rejected")}
                            variant={verdict === "rejected" ? "default" : "outline"}
                            className={verdict === "rejected" ? "bg-red-600" : "border-red-600/50"}
                          >
                            Reject Petition
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="reasoning" className="block text-sm font-medium text-justice-light">
                          Verdict Reasoning
                        </label>
                        <Textarea
                          id="reasoning"
                          value={verdictReasoning}
                          onChange={(e) => setVerdictReasoning(e.target.value)}
                          placeholder="Provide your reasoning for this verdict"
                          className="min-h-32 bg-black/30"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleSubmitVerdict}
                        className="bg-justice-primary hover:bg-justice-primary/90"
                        disabled={!verdict || !verdictReasoning || isJudging}
                      >
                        {isJudging ? (
                          <>
                            <PulseEffect color="bg-white" size="sm" />
                            <span className="ml-2">Delivering Judgment...</span>
                          </>
                        ) : (
                          "Deliver Sacred Verdict"
                        )}
                      </Button>
                    </div>
                  </GlassCard>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="judged" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <PulseEffect color="bg-justice-primary" size="lg" />
              </div>
            ) : judgedPetitions.length === 0 ? (
              <GlassCard className="p-6 text-center">
                <p className="text-justice-light">No judged petitions found</p>
              </GlassCard>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {judgedPetitions.map((petition) => (
                  <GlassCard 
                    key={petition.id} 
                    className={`p-6 ${
                      petition.status === 'rejected' 
                        ? "border-red-500/30" 
                        : "border-green-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">{petition.title}</h3>
                      <span className={`text-sm px-2 py-1 rounded ${
                        petition.status === 'rejected'
                          ? "bg-red-900/50 text-red-200"
                          : "bg-green-900/50 text-green-200"
                      }`}>
                        {petition.status === 'rejected' ? "Rejected" : "Granted"}
                      </span>
                    </div>
                    <p className="text-sm text-justice-light/80 mb-4">
                      Judged on {petition.verdict_timestamp ? 
                        new Date(petition.verdict_timestamp).toLocaleDateString() : 'Unknown date'}
                    </p>
                    <p className="text-justice-light mb-4 line-clamp-3">{petition.description}</p>
                    {petition.verdict_reasoning && (
                      <div className="mt-4 p-3 bg-black/40 rounded">
                        <h4 className="font-medium text-white mb-1">Verdict Reasoning:</h4>
                        <p className="text-justice-light/90">{petition.verdict_reasoning}</p>
                      </div>
                    )}
                  </GlassCard>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JudgmentRoom;
