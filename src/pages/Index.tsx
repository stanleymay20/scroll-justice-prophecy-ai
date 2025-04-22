
import { useState } from "react";
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

const Index = () => {
  // Initial state setup
  const [judicialMode, setJudicialMode] = useState(false);
  
  // Helper to map case IDs to titles for display
  const caseTitleMap = cases.reduce((acc, c) => ({
    ...acc,
    [c.case_id]: c.title
  }), {} as Record<string, string>);
  
  // Get the current scroll phase and gate from the first memory
  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      {/* Main content */}
      <div className="flex-1 p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="FastTrackJusticeAI Dashboard" 
          text="Global Justice Intelligence with Scroll Memory"
          systemHealth={systemHealth}
          showExportButton
          onExport={() => console.log("Export requested")}
        />

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">System Overview</h2>
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
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SystemMetricsPanel data={systemHealth} />
          </div>
          <div>
            <ScrollPhaseIndicator phase={currentPhase} gate={currentGate} />
          </div>
        </div>

        <Tabs defaultValue="graph" className="mt-8">
          <TabsList className="bg-justice-dark/50">
            <TabsTrigger value="graph">Precedent Graph</TabsTrigger>
            <TabsTrigger value="cases">Recent Cases</TabsTrigger>
            <TabsTrigger value="memory">Scroll Memory</TabsTrigger>
          </TabsList>
          <TabsContent value="graph" className="mt-4">
            <Card className="border-justice-tertiary bg-transparent">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle>Live Precedent Graph Explorer</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex justify-center">
                <ForceGraph data={graphData} height={500} />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {scrollMemories.map(memory => (
                <ScrollMemoryTrail 
                  key={memory.trail_id}
                  memory={memory}
                  cases={caseTitleMap}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {judicialMode && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Prophetic Alignment</h2>
            </div>
            <Card className="border-justice-tertiary bg-justice-dark text-white p-6">
              <div className="text-center p-4">
                <div className="text-2xl font-semibold mb-2">Divine Architecture Insight</div>
                <p className="italic text-justice-light max-w-3xl mx-auto">
                  "The principles of equality and human dignity appear in alignment with Gate 3 scroll prophecies. 
                  Current legal evolution trajectory shows 87% concordance with the DAWN phase revelations on justice and mercy equilibrium."
                </p>
              </div>
              <div className="flex justify-center mt-4 space-x-4">
                <div className="bg-justice-tertiary/20 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Alignment Score</div>
                  <div className="text-2xl font-bold text-justice-light">87%</div>
                </div>
                <div className="bg-justice-tertiary/20 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Scroll Phase</div>
                  <div className="text-2xl font-bold text-scroll-dawn">DAWN</div>
                </div>
                <div className="bg-justice-tertiary/20 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Gate</div>
                  <div className="text-2xl font-bold text-justice-light">3</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
