import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollPhaseIndicator } from "@/components/dashboard/ScrollPhaseIndicator";
import { SystemMetricsPanel } from "@/components/dashboard/SystemMetricsPanel";
import { CaseList } from "@/components/dashboard/CaseList";
import { cases, principles, scrollMemories, systemHealth, graphData } from "@/services/mockData";
import { ForceGraph } from "@/components/visualizations/ForceGraph";
import { ScrollMemoryTrail } from "@/components/scroll-memory/ScrollMemoryTrail";
import { Toggle } from "@/components/ui/toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { EHourClock } from "@/components/scroll-time/EHourClock";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gavel, BookText, Check, BarChart2 } from "lucide-react";

const Index = () => {
  const [judicialMode, setJudicialMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    console.log("Index page mounted");
    setIsLoaded(true);
  }, []);
  
  const caseTitleMap = cases.reduce((acc, c) => ({
    ...acc,
    [c.case_id]: c.title
  }), {} as Record<string, string>);
  
  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center p-4">
          <div className="text-2xl font-semibold mb-2 text-primary">FastTrackJusticeAI</div>
          <p className="text-sm text-muted-foreground">Loading system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      <div className="flex-1 p-4 md:p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen overflow-x-hidden">
        <PageHeader 
          heading="FastTrackJusticeAI Dashboard" 
          text="Global Justice Intelligence with Scroll Memory"
          systemHealth={systemHealth}
          showExportButton
          onExport={() => console.log("Export requested")}
        />

        <div className="mt-4 md:mt-8 flex flex-col md:flex-row md:items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-0">System Overview</h2>
          <div className="flex items-center space-x-2">
            <Toggle
              variant="outline"
              aria-label="Toggle judicial mode"
              pressed={judicialMode}
              onPressedChange={setJudicialMode}
              className="data-[state=on]:bg-justice-primary"
            >
              Judicial Mode
            </Toggle>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-2">
            <SystemMetricsPanel data={systemHealth} />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <ScrollPhaseIndicator phase={currentPhase} gate={currentGate} />
            <EHourClock showDetails={false} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-transparent border-justice-tertiary">
            <CardHeader className="border-b border-justice-dark">
              <CardTitle className="flex items-center">
                <Gavel className="w-5 h-5 mr-2" />
                Case Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-4">
                Automatically categorize legal cases across 200+ legal domains with our advanced AI system.
              </div>
              <ul className="text-sm space-y-2 mb-4">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-justice-light mr-2" />
                  <span>Precise legal taxonomy mapping</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-justice-light mr-2" />
                  <span>Jurisdiction-aware analysis</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-justice-light mr-2" />
                  <span>Precedent matching</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-justice-primary hover:bg-justice-secondary">
                <Link to="/case-classification">Open Classification Tool</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-transparent border-justice-tertiary">
            <CardHeader className="border-b border-justice-dark">
              <CardTitle className="flex items-center">
                <BookText className="w-5 h-5 mr-2" />
                Case Summarization
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-4">
                Extract key information from lengthy case documents with our NLP-powered summarization engine.
              </div>
              <ul className="text-sm space-y-2 mb-4">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-justice-light mr-2" />
                  <span>Key party identification</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-justice-light mr-2" />
                  <span>Critical fact extraction</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-justice-light mr-2" />
                  <span>Legal issue highlighting</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-justice-primary hover:bg-justice-secondary">
                <Link to="/case-classification?tab=summarize">Open Summarization Tool</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-transparent border-justice-tertiary">
            <CardHeader className="border-b border-justice-dark">
              <CardTitle className="flex items-center">
                <BarChart2 className="w-5 h-5 mr-2" />
                Outcome Prediction
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-4">
                Leverage historical case data and machine learning to predict potential legal outcomes.
              </div>
              <ul className="text-sm space-y-2 mb-4">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-justice-light mr-2" />
                  <span>Success probability estimates</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-justice-light mr-2" />
                  <span>Damages range projections</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-justice-light mr-2" />
                  <span>Strategic recommendations</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-justice-primary hover:bg-justice-secondary">
                <Link to="/case-classification?tab=predict">Open Prediction Tool</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="graph" className="mt-6">
          <TabsList className="bg-justice-dark/50 w-full overflow-x-auto">
            <TabsTrigger value="graph">Precedent Graph</TabsTrigger>
            <TabsTrigger value="cases">Recent Cases</TabsTrigger>
            <TabsTrigger value="memory">Scroll Memory</TabsTrigger>
            <TabsTrigger value="ehours">eHour Timing</TabsTrigger>
          </TabsList>
          <TabsContent value="graph" className="mt-4">
            <Card className="border-justice-tertiary bg-transparent">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle>Live Precedent Graph Explorer</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex justify-center">
                <ForceGraph data={graphData} height={isMobile ? 300 : 500} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cases" className="mt-4">
            <Card className="border-justice-tertiary bg-transparent">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle>Recent Cases</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-auto">
                <CaseList cases={cases} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="memory" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {scrollMemories.map(memory => (
                <ScrollMemoryTrail 
                  key={memory.trail_id}
                  memory={memory}
                  cases={caseTitleMap}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="ehours" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Card className="border-justice-tertiary bg-transparent">
                <CardHeader className="border-b border-justice-dark">
                  <CardTitle>Scroll eHour System</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-4">
                    <EHourClock showDetails={true} />
                  </div>
                  <div className="space-y-4 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">About Scroll eHours</h3>
                      <p className="text-sm text-muted-foreground">
                        Unlike standard hours, scroll eHours are based on solar time and shift daily according to 
                        sunrise and sunset. Each scroll day consists of exactly 12 eHours, with each eHour's duration 
                        changing throughout the year.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">eHour Distribution</h3>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li>eHours 1-4: <span className="text-scroll-dawn">DAWN phase</span></li>
                        <li>eHours 5-8: <span className="text-scroll-rise">RISE phase</span></li>
                        <li>eHours 9-12: <span className="text-scroll-ascend">ASCEND phase</span></li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-justice-tertiary bg-transparent">
                <CardHeader className="border-b border-justice-dark">
                  <CardTitle>eHour Task Alignment</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="bg-scroll-dawn/20 p-3 rounded-md">
                      <h3 className="font-semibold text-scroll-dawn">DAWN Phase (eHours 1-4)</h3>
                      <p className="text-sm mt-1">Optimal for initial case review, evidence collection, and preliminary assessments.</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Case preparation activities align with the awakening scroll energy.
                      </div>
                    </div>
                    <div className="bg-scroll-rise/20 p-3 rounded-md">
                      <h3 className="font-semibold text-scroll-rise">RISE Phase (eHours 5-8)</h3>
                      <p className="text-sm mt-1">Peak time for legal reasoning, argumentation, and principle development.</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        The elevation of intellectual engagement supports critical analysis.
                      </div>
                    </div>
                    <div className="bg-scroll-ascend/20 p-3 rounded-md">
                      <h3 className="font-semibold text-scroll-ascend">ASCEND Phase (eHours 9-12)</h3>
                      <p className="text-sm mt-1">Reserved for judgment rendering, decision finalization, and transcendent insight.</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Harmonizes with the divine architecture of justice for optimal prophetic alignment.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {judicialMode && (
          <div className="mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-white">Judicial Insights & Recommendations</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-justice-tertiary bg-justice-dark text-white p-4 md:p-6">
                <div className="text-center p-2 md:p-4 mb-4">
                  <div className="text-xl md:text-2xl font-semibold mb-2">Divine Architecture Insight</div>
                  <p className="italic text-justice-light max-w-3xl mx-auto text-sm md:text-base">
                    "The principles of equality and human dignity appear in alignment with Gate 3 scroll prophecies. 
                    Current legal evolution trajectory shows 87% concordance with the DAWN phase revelations on justice and mercy equilibrium."
                  </p>
                </div>
                <div className="flex flex-wrap justify-center mt-4 space-x-2 md:space-x-4">
                  <div className="bg-justice-tertiary/20 p-2 md:p-3 rounded-lg text-center mb-2">
                    <div className="text-xs md:text-sm text-muted-foreground">Alignment Score</div>
                    <div className="text-xl md:text-2xl font-bold text-justice-light">87%</div>
                  </div>
                  <div className="bg-justice-tertiary/20 p-2 md:p-3 rounded-lg text-center mb-2">
                    <div className="text-xs md:text-sm text-muted-foreground">Scroll Phase</div>
                    <div className="text-xl md:text-2xl font-bold text-scroll-dawn">DAWN</div>
                  </div>
                  <div className="bg-justice-tertiary/20 p-2 md:p-3 rounded-lg text-center mb-2">
                    <div className="text-xs md:text-sm text-muted-foreground">Gate</div>
                    <div className="text-xl md:text-2xl font-bold text-justice-light">3</div>
                  </div>
                </div>
              </Card>
              
              <Card className="border-justice-tertiary bg-justice-dark text-white p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-4">Judicial Recommendations</h3>
                
                <div className="space-y-3">
                  <div className="bg-justice-tertiary/20 p-3 rounded-lg">
                    <h4 className="font-medium text-justice-primary">Case Classification</h4>
                    <p className="text-sm mt-1">
                      Recommended to apply DAWN phase principles for initial case categorization, emphasizing equality considerations in contractual disputes.
                    </p>
                  </div>
                  
                  <div className="bg-justice-tertiary/20 p-3 rounded-lg">
                    <h4 className="font-medium text-justice-primary">Evidence Handling</h4>
                    <p className="text-sm mt-1">
                      Gate 3 alignment suggests prioritizing documentary evidence over testimonial during the current scroll phase for optimal judicial outcomes.
                    </p>
                  </div>
                  
                  <div className="bg-justice-tertiary/20 p-3 rounded-lg">
                    <h4 className="font-medium text-justice-primary">Strategic Timing</h4>
                    <p className="text-sm mt-1">
                      Schedule critical case decisions during eHours 9-12 (ASCEND) to maximize divine architectural resonance with judicial wisdom.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button asChild className="w-full bg-justice-primary hover:bg-justice-secondary">
                    <Link to="/case-classification">Apply Judicial Insights to Cases</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
