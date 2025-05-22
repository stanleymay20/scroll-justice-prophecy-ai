
import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/language";
import { MetaTags } from "@/components/MetaTags";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { ScrollAgent } from "@/components/animated/ScrollAgent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Scale, Scroll, Plus } from "lucide-react";
import { ScrollTribunalCase } from "@/types/tribunal";
import { toast } from "@/hooks/use-toast";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";

// Mock data for demo purposes
const mockTribunalCases: ScrollTribunalCase[] = [
  {
    id: "tc-001",
    nation: "United Kingdom",
    institution: "British Museum",
    crime_type: "Artifact Theft",
    summary: "Illegal acquisition and refusal to return Benin Bronzes",
    evidence: ["historical_records_1897.pdf", "un_resolution_2019.pdf"],
    reparations_issued: false,
    created_at: new Date().toISOString()
  },
  {
    id: "tc-002",
    nation: "Belgium",
    institution: "Royal Belgian Government",
    crime_type: "Colonialism",
    summary: "Exploitation and atrocities in Congo Free State",
    evidence: ["congo_commission_report.pdf", "testimony_archives.pdf"],
    reparations_issued: false,
    created_at: new Date().toISOString()
  }
];

const TribunalDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [cases, setCases] = useState<ScrollTribunalCase[]>(mockTribunalCases);
  const [selectedCase, setSelectedCase] = useState<ScrollTribunalCase | null>(null);
  const [agentState, setAgentState] = useState<'idle' | 'judging' | 'complete'>('idle');
  const [agentMessage, setAgentMessage] = useState<string | null>(null);

  const handleJudgment = (caseId: string) => {
    const tribunalCase = cases.find(c => c.id === caseId);
    if (!tribunalCase) return;
    
    setSelectedCase(tribunalCase);
    setAgentState('judging');
    setAgentMessage(`Analyzing historical evidence for ${tribunalCase.nation}`);
    
    // Simulate judgment process
    setTimeout(() => {
      setAgentState('complete');
      setAgentMessage(`Judgment rendered for ${tribunalCase.nation}`);
      
      toast({
        title: "Tribunal Verdict Rendered",
        description: `Reparations ordered for ${tribunalCase.crime_type} case`
      });
      
      // Update case with mock verdict
      setCases(prev => prev.map(c => {
        if (c.id === caseId) {
          return {
            ...c,
            verdict_id: "vrd-" + Date.now(),
            reparations_issued: true
          };
        }
        return c;
      }));
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("tribunal.title", "Global Historical Court")} />
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="mr-3 p-2 rounded-full bg-justice-primary/20">
            <Scale className="h-6 w-6 text-justice-light" />
            <Scroll className="h-6 w-6 text-justice-light mt-1" />
          </div>
          <h1 className="text-3xl font-cinzel text-white text-center">
            {t("tribunal.title", "ScrollTribunal: Global Historical Court")}
          </h1>
        </div>
        
        <Tabs defaultValue="active" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="bg-black/30">
              <TabsTrigger value="active">Active Cases</TabsTrigger>
              <TabsTrigger value="judged">Judged Cases</TabsTrigger>
              <TabsTrigger value="file">File New Case</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="active" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {cases.filter(c => !c.reparations_issued).map((tribunalCase) => (
                <GlassCard key={tribunalCase.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-2 py-1 text-xs bg-justice-primary/20 text-justice-light rounded-full mb-2">
                        {tribunalCase.crime_type}
                      </span>
                      <h3 className="text-xl font-semibold text-white">{tribunalCase.nation}</h3>
                      <p className="text-sm text-justice-light/80">
                        Institution: {tribunalCase.institution}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-justice-light mb-4">{tribunalCase.summary}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-justice-light/70">
                      Evidence: {tribunalCase.evidence.length} documents
                    </div>
                    <Button 
                      onClick={() => handleJudgment(tribunalCase.id)} 
                      className="bg-justice-primary hover:bg-justice-primary/90"
                    >
                      Render Judgment
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="judged" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {cases.filter(c => c.reparations_issued).map((tribunalCase) => (
                <GlassCard key={tribunalCase.id} className="p-6 border-green-500/30">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-2 py-1 text-xs bg-green-900/30 text-green-300 rounded-full mb-2">
                        Reparations Ordered
                      </span>
                      <h3 className="text-xl font-semibold text-white">{tribunalCase.nation}</h3>
                      <p className="text-sm text-justice-light/80">
                        Institution: {tribunalCase.institution}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-justice-light mb-4">{tribunalCase.summary}</p>
                  
                  <div className="p-3 bg-black/40 rounded">
                    <h4 className="font-medium text-white mb-1">Verdict:</h4>
                    <p className="text-justice-light/90">
                      Compensation and artifact return required within 180 days
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="file" className="space-y-6">
            <GlassCard className="p-6 max-w-2xl mx-auto">
              <h2 className="text-xl font-cinzel text-white mb-4">File New Tribunal Case</h2>
              <p className="text-justice-light mb-6">
                This feature allows filing of historical injustice cases to the global tribunal.
                Full evidence documentation required.
              </p>
              <Button className="w-full bg-justice-primary/90 hover:bg-justice-primary">
                <Plus className="h-4 w-4 mr-2" />
                Begin Case Filing Process
              </Button>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
      
      <ScrollAgent 
        state={agentState} 
        position="bottom-right" 
        withParticles={agentState === 'judging'} 
        size="md"
        message={agentMessage || undefined}
      />
    </div>
  );
};

export default TribunalDashboard;
