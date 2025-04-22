
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { principles, scrollMemories, systemHealth } from "@/services/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrincipleEvolutionChart } from "@/components/principles/PrincipleEvolutionChart";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PrinciplesPage = () => {
  // Get the current scroll phase and gate from the first memory
  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;
  
  // Group principles by strength
  const strongPrinciples = principles.filter(p => p.strength === "strong");
  const mediumPrinciples = principles.filter(p => p.strength === "medium");
  const weakPrinciples = principles.filter(p => p.strength === "weak");

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      {/* Main content */}
      <div className="flex-1 p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="Principle Evolution Viewer" 
          text="Track the evolution of legal principles across cases and time"
          systemHealth={systemHealth}
          showExportButton
          onExport={() => console.log("Export principles requested")}
        />

        <Card className="mt-6 bg-justice-dark text-white border-justice-tertiary">
          <CardHeader>
            <CardTitle className="text-justice-light">Principle Strength Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-b from-principle-strong/20 to-transparent rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Strong Principles</h3>
                  <Badge className="bg-principle-strong text-justice-dark">{strongPrinciples.length}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Principles with extensive precedent backing and high alignment
                </div>
              </div>
              <div className="bg-gradient-to-b from-principle-medium/20 to-transparent rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Medium Principles</h3>
                  <Badge className="bg-principle-medium text-justice-dark">{mediumPrinciples.length}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Principles with moderate precedent support and growing influence
                </div>
              </div>
              <div className="bg-gradient-to-b from-principle-weak/20 to-transparent rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Weak Principles</h3>
                  <Badge className="bg-principle-weak text-white">{weakPrinciples.length}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Emerging principles with limited precedent or weakening support
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="mt-8">
          <TabsList className="bg-justice-dark/50">
            <TabsTrigger value="all">All Principles</TabsTrigger>
            <TabsTrigger value="strong">Strong</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="weak">Weak</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {principles.map(principle => (
                <PrincipleEvolutionChart key={principle.id} principle={principle} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="strong" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {strongPrinciples.map(principle => (
                <PrincipleEvolutionChart key={principle.id} principle={principle} />
              ))}
            </div>
            {strongPrinciples.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No strong principles found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="medium" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediumPrinciples.map(principle => (
                <PrincipleEvolutionChart key={principle.id} principle={principle} />
              ))}
            </div>
            {mediumPrinciples.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No medium principles found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="weak" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {weakPrinciples.map(principle => (
                <PrincipleEvolutionChart key={principle.id} principle={principle} />
              ))}
            </div>
            {weakPrinciples.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No weak principles found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PrinciplesPage;
