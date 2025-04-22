
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { cases, scrollMemories, systemHealth } from "@/services/mockData";
import { ScrollMemoryTrail } from "@/components/scroll-memory/ScrollMemoryTrail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollPhase } from "@/types";

const ScrollMemoryPage = () => {
  // Helper to map case IDs to titles for display
  const caseTitleMap = cases.reduce((acc, c) => ({
    ...acc,
    [c.case_id]: c.title
  }), {} as Record<string, string>);
  
  // Get the current scroll phase and gate from the first memory
  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;

  // Group memories by phase
  const memoriesByPhase: Record<ScrollPhase, typeof scrollMemories> = {
    "DAWN": scrollMemories.filter(m => m.scroll_phase === "DAWN"),
    "RISE": scrollMemories.filter(m => m.scroll_phase === "RISE"),
    "ASCEND": scrollMemories.filter(m => m.scroll_phase === "ASCEND")
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      {/* Main content */}
      <div className="flex-1 p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="Scroll Memory Intelligence" 
          text="Explore the prophetic memories and legal principle trails"
          systemHealth={systemHealth}
        />

        <div className="mt-8">
          <Card className="bg-justice-dark text-white border-justice-tertiary mb-8">
            <CardHeader>
              <CardTitle className="text-justice-light">Scroll Memory Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-justice-tertiary/10 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground">Total Trails</div>
                  <div className="text-3xl font-semibold mt-1">{scrollMemories.length}</div>
                </div>
                <div className="bg-justice-tertiary/10 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground">Connected Cases</div>
                  <div className="text-3xl font-semibold mt-1">
                    {new Set(scrollMemories.flatMap(m => m.case_ids)).size}
                  </div>
                </div>
                <div className="bg-justice-tertiary/10 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground">Average Confidence</div>
                  <div className="text-3xl font-semibold mt-1">
                    {(scrollMemories.reduce((acc, m) => acc + m.confidence, 0) / scrollMemories.length * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="text-sm font-medium mb-2">Memory Distribution by Phase</div>
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-scroll-dawn" 
                    style={{ width: `${memoriesByPhase.DAWN.length / scrollMemories.length * 100}%` }}
                  ></div>
                  <div 
                    className="bg-scroll-rise" 
                    style={{ width: `${memoriesByPhase.RISE.length / scrollMemories.length * 100}%` }}
                  ></div>
                  <div 
                    className="bg-scroll-ascend" 
                    style={{ width: `${memoriesByPhase.ASCEND.length / scrollMemories.length * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <div className="text-scroll-dawn">DAWN</div>
                  <div className="text-scroll-rise">RISE</div>
                  <div className="text-scroll-ascend">ASCEND</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="mt-6">
            <TabsList className="bg-justice-dark/50">
              <TabsTrigger value="all">All Memories</TabsTrigger>
              <TabsTrigger value="dawn">DAWN Phase</TabsTrigger>
              <TabsTrigger value="rise">RISE Phase</TabsTrigger>
              <TabsTrigger value="ascend">ASCEND Phase</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scrollMemories.map(memory => (
                  <ScrollMemoryTrail 
                    key={memory.trail_id}
                    memory={memory}
                    cases={caseTitleMap}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="dawn" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {memoriesByPhase.DAWN.map(memory => (
                  <ScrollMemoryTrail 
                    key={memory.trail_id}
                    memory={memory}
                    cases={caseTitleMap}
                  />
                ))}
              </div>
              {memoriesByPhase.DAWN.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No scroll memories found in DAWN phase
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rise" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {memoriesByPhase.RISE.map(memory => (
                  <ScrollMemoryTrail 
                    key={memory.trail_id}
                    memory={memory}
                    cases={caseTitleMap}
                  />
                ))}
              </div>
              {memoriesByPhase.RISE.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No scroll memories found in RISE phase
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ascend" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {memoriesByPhase.ASCEND.map(memory => (
                  <ScrollMemoryTrail 
                    key={memory.trail_id}
                    memory={memory}
                    cases={caseTitleMap}
                  />
                ))}
              </div>
              {memoriesByPhase.ASCEND.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No scroll memories found in ASCEND phase
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ScrollMemoryPage;
