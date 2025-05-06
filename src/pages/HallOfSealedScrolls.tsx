
import { useEffect, useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/language";
import { Loader2, Gavel, Scroll, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AudioVerdictPlayer } from "@/components/audio/AudioVerdictPlayer";
import { SealedPetition } from "@/types/petitions";

// Scroll breaking animation component
const ScrollBreakingAnimation = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    // Trigger completion after animation time
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="text-center">
        <div className="flex justify-center">
          <Scroll className="h-20 w-20 text-justice-primary animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-justice-light mt-6 mb-2">Breaking the Scroll Seal</h2>
        <p className="text-justice-light/70">
          The sacred scroll is being unsealed for viewing...
        </p>
      </div>
    </div>
  );
};

export default function HallOfSealedScrolls() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [sealedPetitions, setSealedPetitions] = useState<SealedPetition[]>([]);
  const [selectedPetition, setSelectedPetition] = useState<SealedPetition | null>(null);
  const [breakingSeal, setBreakingSeal] = useState(false);
  
  useEffect(() => {
    const fetchSealedPetitions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("scroll_petitions")
          .select(`
            *,
            petitioner:petitioner_id(username),
            judge:assigned_judge_id(username)
          `)
          .eq("status", "sealed")
          .eq("is_sealed", true)
          .order("verdict_timestamp", { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Transform data to match the SealedPetition interface
        const transformedData = data.map(item => ({
          ...item,
          petitioner_username: item.petitioner ? item.petitioner.username : "Unknown",
          judge_username: item.judge ? item.judge.username : "Unknown",
          status: item.status as "pending" | "in_review" | "verdict_delivered" | "sealed" | "rejected"
        })) as SealedPetition[];
        
        setSealedPetitions(transformedData);
      } catch (error: any) {
        console.error("Error fetching sealed petitions:", error);
        toast({
          title: "Error",
          description: "Failed to load sealed scrolls. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSealedPetitions();
  }, [toast]);
  
  const handleViewSealed = (petition: SealedPetition) => {
    setBreakingSeal(true);
    setSelectedPetition(petition);
  };
  
  const handleSealBroken = () => {
    setBreakingSeal(false);
    // In a real app, you might log this access or perform other actions
    toast({
      title: "Scroll Seal Broken",
      description: "You now have access to view this sacred sealed scroll.",
    });
  };
  
  // Format timestamp for display
  const formatDate = (timestamp: string) => {
    if (!timestamp) return "Unknown";
    
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
        <NavBar />
        <div className="container mx-auto px-4 pt-20 pb-16 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-justice-primary animate-spin mb-4 mx-auto" />
            <p className="text-justice-light">Loading the Hall of Sealed Scrolls...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="Hall of Sealed Scrolls" />
      <NavBar />
      
      {breakingSeal && <ScrollBreakingAnimation onComplete={handleSealBroken} />}
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <h1 className="text-3xl font-bold text-justice-light mb-2">Hall of Sealed Scrolls</h1>
        <p className="text-justice-light/70 mb-8 max-w-3xl">
          Browse the sacred repository of sealed petitions that have been judged and preserved for posterity.
          These scrolls contain the wisdom and decisions of the ScrollJustice community.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of sealed scrolls */}
          <div className="lg:col-span-1">
            <Card className="bg-black/20 border-justice-primary/20">
              <CardHeader>
                <CardTitle className="text-justice-light">Sealed Scrolls</CardTitle>
                <CardDescription>
                  {sealedPetitions.length} sealed verdicts available
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[70vh] overflow-y-auto space-y-4">
                {sealedPetitions.length === 0 ? (
                  <p className="text-center text-justice-light/50 py-8">
                    No sealed scrolls are currently available.
                  </p>
                ) : (
                  sealedPetitions.map((petition) => (
                    <div 
                      key={petition.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedPetition?.id === petition.id
                          ? "bg-justice-primary/30 border-justice-primary/70 border"
                          : "bg-black/30 hover:bg-justice-primary/10 border border-transparent"
                      }`}
                      onClick={() => handleViewSealed(petition)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-medium text-justice-light">{petition.title}</h3>
                        <Badge className="text-[10px] ml-2">
                          {petition.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-justice-light/60 gap-1 mb-2">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(petition.verdict_timestamp || '')}</span>
                      </div>
                      <p className="text-sm text-justice-light/70 line-clamp-2">
                        {petition.description}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Selected scroll details */}
          <div className="lg:col-span-2">
            {selectedPetition ? (
              <Card className="bg-black/20 border-justice-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="mb-2" variant="outline">
                        Scroll #{selectedPetition.id.substring(0, 8).toUpperCase()}
                      </Badge>
                      <CardTitle className="text-justice-light">{selectedPetition.title}</CardTitle>
                      <CardDescription>
                        Sealed on {formatDate(selectedPetition.verdict_timestamp || '')}
                      </CardDescription>
                    </div>
                    {selectedPetition?.scroll_gate && (
                      <Badge variant="secondary" className="bg-justice-primary/20">
                        {selectedPetition.scroll_gate}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <Tabs defaultValue="petition">
                    <TabsList className="bg-black/30">
                      <TabsTrigger value="petition">Petition</TabsTrigger>
                      <TabsTrigger value="verdict">Verdict</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="petition" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-justice-light/70">Petitioner</h3>
                        <p className="bg-black/30 p-3 rounded text-justice-light">
                          {selectedPetition.petitioner_username}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-justice-light/70">Description</h3>
                        <div className="bg-black/30 p-3 rounded text-justice-light whitespace-pre-wrap">
                          {selectedPetition.description}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="verdict" className="mt-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-justice-light/70">Judge</h3>
                          <p className="bg-black/30 p-2 rounded text-justice-light">
                            {selectedPetition.judge_username || "No judge assigned"}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium text-justice-light/70 mb-2">Verdict</div>
                          <Badge className={selectedPetition.verdict === "approved" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                            {selectedPetition.verdict || "No verdict"}
                          </Badge>
                        </div>
                      </div>
                      
                      {selectedPetition.verdict_reasoning && (
                        <div className="space-y-2 mt-4">
                          <h3 className="text-sm font-medium text-justice-light/70">Reasoning</h3>
                          <div className="bg-black/30 p-3 rounded text-justice-light whitespace-pre-wrap">
                            {selectedPetition.verdict_reasoning}
                          </div>
                        </div>
                      )}
                      
                      {/* Audio verdict player (would connect to a real audio source) */}
                      <AudioVerdictPlayer audioUrl="/audio/sample-verdict.mp3" />
                      
                      <div className="flex items-center p-4 bg-justice-primary/10 border border-justice-primary/30 rounded-md">
                        <Gavel className="h-8 w-8 text-justice-primary mr-4" />
                        <div>
                          <h3 className="text-justice-light font-medium">Immutable Verdict Record</h3>
                          <p className="text-justice-light/70 text-sm">
                            This verdict has been permanently recorded on the Sacred Scroll Chain and cannot be altered.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-black/20 rounded-lg border border-justice-primary/20 p-8">
                <Scroll className="h-16 w-16 text-justice-primary/30 mb-4" />
                <h3 className="text-xl font-medium text-justice-light mb-2">Select a Sealed Scroll</h3>
                <p className="text-justice-light/60 text-center max-w-md">
                  Choose a sealed scroll from the list to view its contents and the sacred verdict.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
