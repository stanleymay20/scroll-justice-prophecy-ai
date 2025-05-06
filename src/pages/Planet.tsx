
import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Users, Map, Layers } from "lucide-react";
import { CompactEHourClock } from "@/components/scroll-time/CompactEHourClock";

interface TribeData {
  id: string;
  name: string;
  color: string;
  members: number;
  regions: string[];
}

// Simulation data
const mockTribes: TribeData[] = [
  { id: "tribe1", name: "Dawn Seekers", color: "#f59e0b", members: 37, regions: ["North America", "Europe"] },
  { id: "tribe2", name: "Light Bearers", color: "#10b981", members: 28, regions: ["South America", "Africa"] },
  { id: "tribe3", name: "Sun Walkers", color: "#3b82f6", members: 45, regions: ["Asia", "Australia"] },
  { id: "tribe4", name: "Fire Keepers", color: "#ef4444", members: 19, regions: ["Europe", "Middle East"] },
  { id: "tribe5", name: "Star Gazers", color: "#8b5cf6", members: 33, regions: ["North America", "Asia"] },
];

export default function PlanetPage() {
  const [selectedTribe, setSelectedTribe] = useState<string | null>(null);
  
  const handleTribeSelect = (tribeId: string) => {
    setSelectedTribe(tribeId === selectedTribe ? null : tribeId);
  };
  
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
              <div className="w-full h-[600px] flex flex-col items-center justify-center bg-black/50">
                <Globe className="h-16 w-16 text-justice-primary/50 mb-4" />
                <h3 className="text-lg font-medium text-justice-light mb-2">ScrollPlanet Map</h3>
                <p className="text-sm text-gray-400 text-center max-w-md mb-4">
                  To enable the interactive ScrollPlanet Map, please install mapbox-gl via SQL in the Supabase dashboard.
                </p>
                <Badge variant="outline" className="mb-6">
                  Map Loading Placeholder
                </Badge>
                
                <Button 
                  variant="outline"
                  onClick={() => alert('Please add mapbox-gl dependency to enable this feature')}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Configure Map
                </Button>
              </div>
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
                    <div className="space-y-3">
                      <p className="text-sm text-gray-300 mb-2">
                        Select a tribe to highlight their territory on the map:
                      </p>
                      
                      {mockTribes.map(tribe => (
                        <div 
                          key={tribe.id}
                          className={`p-3 rounded-lg cursor-pointer border transition-all ${
                            selectedTribe === tribe.id 
                              ? 'bg-black/50 border-justice-primary' 
                              : 'bg-black/20 border-transparent hover:border-justice-primary/30'
                          }`}
                          onClick={() => handleTribeSelect(tribe.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-white flex items-center">
                              <span 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: tribe.color }}
                              ></span>
                              {tribe.name}
                            </h3>
                            <Badge variant="outline" className="bg-black/40">
                              {tribe.members} members
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-400">
                            Regions: {tribe.regions.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="gates">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-300 mb-2">
                        Active gates around the ScrollPlanet:
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-black/20 rounded-lg border border-scroll-dawn/30">
                          <div className="flex items-center mb-1">
                            <span className="w-3 h-3 rounded-full bg-scroll-dawn mr-2"></span>
                            <span className="text-scroll-dawn text-sm font-medium">Dawn Gate</span>
                          </div>
                          <div className="text-xs text-gray-400">12 active judges</div>
                        </div>
                        
                        <div className="p-2 bg-black/20 rounded-lg border border-scroll-rise/30">
                          <div className="flex items-center mb-1">
                            <span className="w-3 h-3 rounded-full bg-scroll-rise mr-2"></span>
                            <span className="text-scroll-rise text-sm font-medium">Light Gate</span>
                          </div>
                          <div className="text-xs text-gray-400">9 active judges</div>
                        </div>
                        
                        <div className="p-2 bg-black/20 rounded-lg border border-scroll-ascend/30">
                          <div className="flex items-center mb-1">
                            <span className="w-3 h-3 rounded-full bg-scroll-ascend mr-2"></span>
                            <span className="text-scroll-ascend text-sm font-medium">Sun Gate</span>
                          </div>
                          <div className="text-xs text-gray-400">7 active judges</div>
                        </div>
                        
                        <div className="p-2 bg-black/20 rounded-lg border border-justice-tertiary/30">
                          <div className="flex items-center mb-1">
                            <span className="w-3 h-3 rounded-full bg-justice-tertiary mr-2"></span>
                            <span className="text-justice-tertiary text-sm font-medium">Fire Gate</span>
                          </div>
                          <div className="text-xs text-gray-400">5 active judges</div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-xs text-gray-400 mb-1">Legend:</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-white mr-1"></span>
                            <span className="text-xs text-gray-300">Active</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-white opacity-30 mr-1"></span>
                            <span className="text-xs text-gray-300">Inactive</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 border border-justice-primary/30">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-justice-light mb-2">ScrollGate Pulse</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Dawn Gate:</span>
                    <div className="w-1/2 bg-black/40 rounded-full h-1.5">
                      <div className="bg-scroll-dawn h-1.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Light Gate:</span>
                    <div className="w-1/2 bg-black/40 rounded-full h-1.5">
                      <div className="bg-scroll-rise h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Sun Gate:</span>
                    <div className="w-1/2 bg-black/40 rounded-full h-1.5">
                      <div className="bg-scroll-ascend h-1.5 rounded-full animate-pulse" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Fire Gate:</span>
                    <div className="w-1/2 bg-black/40 rounded-full h-1.5">
                      <div className="bg-justice-tertiary h-1.5 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-justice-primary/20">
                  <p className="text-xs text-gray-400 mb-2">Active Scroll Judges: 38</p>
                  <p className="text-xs text-gray-400">Gates Open: 7/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
