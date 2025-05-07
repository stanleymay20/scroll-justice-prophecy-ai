
import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Layers } from "lucide-react";
import { CompactEHourClock } from "@/components/scroll-time/CompactEHourClock";
import { MapBox } from "@/components/map/MapBox";
import { ScrollPlanetCard } from "@/components/scroll-time/ScrollPlanetCard";
import { PlanetRegionsPanel } from "@/components/planet/PlanetRegionsPanel";
import { PlanetTribesPanel } from "@/components/planet/PlanetTribesPanel";
import { PlanetGatesPanel } from "@/components/planet/PlanetGatesPanel";

export default function PlanetPage() {
  const [selectedTribe, setSelectedTribe] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="ScrollPlanet Map" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-justice-light">ScrollPlanet & Tribe Map</h1>
          <CompactEHourClock />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="bg-black/30 border border-justice-primary/30 overflow-hidden">
              <MapBox selectedTribeId={selectedTribe} />
            </Card>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-black/30 border border-justice-primary/30">
              <CardContent className="p-4">
                <Tabs defaultValue="tribes" className="w-full">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="tribes" className="flex-1">
                      <Users className="w-4 h-4 mr-2" />
                      Tribes
                    </TabsTrigger>
                    <TabsTrigger value="gates" className="flex-1">
                      <Layers className="w-4 h-4 mr-2" />
                      Gates
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tribes">
                    <PlanetTribesPanel
                      selectedTribe={selectedTribe}
                      onTribeSelect={setSelectedTribe}
                    />
                  </TabsContent>
                  
                  <TabsContent value="gates">
                    <PlanetGatesPanel />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <ScrollPlanetCard />
            
            <PlanetRegionsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
