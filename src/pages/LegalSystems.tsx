import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Check, Loader2, AlertTriangle, Globe, Database, Brain, BarChart3, BookOpen, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { scrollMemories, systemHealth, jurisdictions, trainingModels, globalLegalMetrics } from "@/services/mockData";
import { ModelTrainingStatus, Jurisdiction, TrainingParameters } from "@/types";
import { JurisdictionList } from "@/components/legal-systems/JurisdictionList";
import { ModelCard } from "@/components/legal-systems/ModelCard";
import { GlobalLegalMetrics } from "@/components/legal-systems/GlobalLegalMetrics";
import { EnhancedTrainingForm } from "@/components/legal-systems/EnhancedTrainingForm";
import { toast } from "@/components/ui/use-toast";

const LegalSystems = () => {
  // Get the current scroll phase and gate from the first memory
  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;
  
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | null>(null);
  
  // Function to start training
  const startTraining = (params: TrainingParameters) => {
    console.log("Starting global training with parameters:", params);
    toast({
      title: "Training Started",
      description: `Training model with ${params.case_count.toLocaleString()} cases across ${params.jurisdictions.length} jurisdictions.`,
    });
    // In a real app, this would call an API to start the training
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="Global Legal Systems & Model Training" 
          text="Manage jurisdictions and train AI models with expanded international legal frameworks"
          systemHealth={systemHealth}
        />

        <div className="mt-6">
          <GlobalLegalMetrics data={globalLegalMetrics} />
        </div>

        <Tabs defaultValue="jurisdictions" className="mt-6">
          <TabsList className="bg-justice-dark/50 w-full overflow-x-auto">
            <TabsTrigger value="jurisdictions">
              <Globe className="mr-1 h-4 w-4" />
              Global Jurisdictions
            </TabsTrigger>
            <TabsTrigger value="models">
              <Brain className="mr-1 h-4 w-4" />
              AI Models
            </TabsTrigger>
            <TabsTrigger value="training">
              <Database className="mr-1 h-4 w-4" />
              Advanced Training
            </TabsTrigger>
            <TabsTrigger value="frameworks">
              <Landmark className="mr-1 h-4 w-4" />
              Legal Frameworks
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="jurisdictions" className="mt-4">
            {selectedJurisdiction ? (
              <Card className="border-justice-tertiary bg-transparent">
                <CardHeader className="border-b border-justice-dark">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <Globe className="mr-2 h-5 w-5" />
                      {selectedJurisdiction.name} ({selectedJurisdiction.code})
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      className="border-justice-tertiary text-white"
                      onClick={() => setSelectedJurisdiction(null)}
                    >
                      Back to List
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Jurisdiction Details</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Code</div>
                            <div className="font-mono">{selectedJurisdiction.code}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Region</div>
                            <div>{selectedJurisdiction.region}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Legal System</div>
                          <div className="mt-1">
                            {selectedJurisdiction.legal_system === "common_law" && <Badge className="bg-blue-500/20 text-blue-300">Common Law</Badge>}
                            {selectedJurisdiction.legal_system === "civil_law" && <Badge className="bg-green-500/20 text-green-300">Civil Law</Badge>}
                            {selectedJurisdiction.legal_system === "religious_law" && <Badge className="bg-purple-500/20 text-purple-300">Religious Law</Badge>}
                            {selectedJurisdiction.legal_system === "customary_law" && <Badge className="bg-orange-500/20 text-orange-300">Customary Law</Badge>}
                            {selectedJurisdiction.legal_system === "mixed" && <Badge className="bg-yellow-500/20 text-yellow-300">Mixed</Badge>}
                            {selectedJurisdiction.legal_system === "international_law" && <Badge className="bg-cyan-500/20 text-cyan-300">International Law</Badge>}
                            {selectedJurisdiction.legal_system === "humanitarian_law" && <Badge className="bg-red-500/20 text-red-300">Humanitarian Law</Badge>}
                            {selectedJurisdiction.legal_system === "un_charter" && <Badge className="bg-blue-700/20 text-blue-200">UN Charter</Badge>}
                            {selectedJurisdiction.legal_system === "treaty_based" && <Badge className="bg-teal-500/20 text-teal-300">Treaty-Based</Badge>}
                            {selectedJurisdiction.legal_system === "icc_rome_statute" && <Badge className="bg-violet-500/20 text-violet-300">ICC Rome Statute</Badge>}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Precedent Weight</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span>{selectedJurisdiction.precedent_weight.toFixed(2)}</span>
                            <div 
                              className="h-2 flex-1 rounded-full bg-gradient-to-r from-red-500 to-green-500" 
                              style={{ opacity: selectedJurisdiction.precedent_weight }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Cases</div>
                            <div>{selectedJurisdiction.cases_count?.toLocaleString() || "0"}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Principles</div>
                            <div>{selectedJurisdiction.principles_count?.toLocaleString() || "0"}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm text-muted-foreground">UN Recognition</div>
                            <div>{selectedJurisdiction.un_recognized ? "Yes" : "No"}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">ICC Jurisdiction</div>
                            <div>{selectedJurisdiction.icc_jurisdiction ? "Yes" : "No"}</div>
                          </div>
                        </div>
                        
                        {selectedJurisdiction.language_codes && (
                          <div>
                            <div className="text-sm text-muted-foreground">Languages</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedJurisdiction.language_codes.map(code => (
                                <Badge key={code} variant="outline">{code}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Analytics</h3>
                      <Card className="bg-justice-dark border-justice-tertiary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div className="text-sm">Case Volume Trend</div>
                            <Select defaultValue="year">
                              <SelectTrigger className="w-24 h-7 text-xs bg-justice-dark/50 border-justice-tertiary">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="month">Month</SelectItem>
                                <SelectItem value="year">Year</SelectItem>
                                <SelectItem value="5years">5 Years</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="h-36 flex items-center justify-center text-muted-foreground text-sm">
                            [Case Volume Chart Placeholder]
                          </div>
                          <div className="mt-4">
                            <div className="text-sm mb-2">Top Principles</div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs">Rule of Law</span>
                                <Progress value={92} className="h-1.5 w-32" />
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs">Due Process</span>
                                <Progress value={87} className="h-1.5 w-32" />
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs">Equal Protection</span>
                                <Progress value={76} className="h-1.5 w-32" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <Card className="bg-justice-dark border-justice-tertiary">
                          <CardContent className="p-3">
                            <div className="text-xs text-muted-foreground">International Relevance</div>
                            <div className="text-2xl font-bold">
                              {selectedJurisdiction.international_relevance?.toFixed(1) || "N/A"}
                            </div>
                            <Progress 
                              value={selectedJurisdiction.international_relevance ? selectedJurisdiction.international_relevance * 10 : 0} 
                              className="h-1 mt-1"
                            />
                          </CardContent>
                        </Card>
                        <Card className="bg-justice-dark border-justice-tertiary">
                          <CardContent className="p-3">
                            <div className="text-xs text-muted-foreground">Model Accuracy</div>
                            <div className="text-2xl font-bold">92.7%</div>
                            <Progress value={92.7} className="h-1 mt-1" />
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" className="border-justice-tertiary">
                          Edit Details
                        </Button>
                        <Button className="bg-justice-primary">
                          Train Model
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-justice-tertiary bg-transparent">
                <CardHeader className="border-b border-justice-dark">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <Globe className="mr-2 h-5 w-5" />
                      Global Jurisdictions ({jurisdictions.length})
                    </CardTitle>
                    <Button variant="outline" className="border-justice-tertiary text-white">
                      Add Jurisdiction
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <JurisdictionList 
                    jurisdictions={jurisdictions} 
                    onJurisdictionSelect={setSelectedJurisdiction}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="models" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {trainingModels.map(model => (
                <ModelCard key={model.model_id} model={model} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="training" className="mt-4">
            <EnhancedTrainingForm 
              availableJurisdictions={jurisdictions}
              onStartTraining={startTraining}
              onSubmit={startTraining}
            />
          </TabsContent>
          
          <TabsContent value="frameworks" className="mt-4">
            <Card className="border-justice-tertiary bg-transparent">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle className="flex items-center">
                  <Landmark className="mr-2 h-5 w-5" />
                  Global Legal Frameworks
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-justice-tertiary bg-justice-dark">
                    <CardHeader>
                      <CardTitle className="text-lg">UN Charter</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        The founding treaty of the United Nations, establishing its structure and principles.
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-muted-foreground">Coverage</div>
                        <Progress value={98} className="h-2 mt-1" />
                        <div className="flex justify-between text-xs mt-1">
                          <span>193 UN Member States</span>
                          <span>98%</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-muted-foreground">Key Articles</div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <Badge className="justify-center">Article 1</Badge>
                          <Badge className="justify-center">Article 2</Badge>
                          <Badge className="justify-center">Article 51</Badge>
                          <Badge className="justify-center">Article 103</Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-justice-tertiary">
                        View Framework
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border-justice-tertiary bg-justice-dark">
                    <CardHeader>
                      <CardTitle className="text-lg">ICC Rome Statute</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        Treaty establishing the International Criminal Court with jurisdiction over genocide, crimes against humanity, war crimes, and crime of aggression.
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-muted-foreground">Coverage</div>
                        <Progress value={65} className="h-2 mt-1" />
                        <div className="flex justify-between text-xs mt-1">
                          <span>123 State Parties</span>
                          <span>65%</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-muted-foreground">Key Articles</div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <Badge className="justify-center">Article 5</Badge>
                          <Badge className="justify-center">Article 17</Badge>
                          <Badge className="justify-center">Article 25</Badge>
                          <Badge className="justify-center">Article 27</Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-justice-tertiary">
                        View Framework
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border-justice-tertiary bg-justice-dark">
                    <CardHeader>
                      <CardTitle className="text-lg">Universal Declaration of Human Rights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        A milestone document proclaiming the fundamental human rights to be universally protected.
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-muted-foreground">Coverage</div>
                        <Progress value={100} className="h-2 mt-1" />
                        <div className="flex justify-between text-xs mt-1">
                          <span>Universal Application</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-muted-foreground">Key Articles</div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <Badge className="justify-center">Article 1</Badge>
                          <Badge className="justify-center">Article 3</Badge>
                          <Badge className="justify-center">Article 5</Badge>
                          <Badge className="justify-center">Article 18</Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-justice-tertiary">
                        View Framework
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Regional Legal Frameworks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-justice-tertiary bg-justice-dark">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">European Convention on Human Rights</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <Progress value={85} className="h-1.5 mt-1" />
                        <div className="text-xs text-muted-foreground mt-1">47 Member States</div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button variant="ghost" size="sm" className="w-full text-xs">View</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="border-justice-tertiary bg-justice-dark">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">American Convention on Human Rights</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <Progress value={65} className="h-1.5 mt-1" />
                        <div className="text-xs text-muted-foreground mt-1">23 OAS Member States</div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button variant="ghost" size="sm" className="w-full text-xs">View</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="border-justice-tertiary bg-justice-dark">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">African Charter on Human Rights</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <Progress value={95} className="h-1.5 mt-1" />
                        <div className="text-xs text-muted-foreground mt-1">54 African Union States</div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button variant="ghost" size="sm" className="w-full text-xs">View</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="border-justice-tertiary bg-justice-dark">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">ASEAN Human Rights Declaration</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <Progress value={75} className="h-1.5 mt-1" />
                        <div className="text-xs text-muted-foreground mt-1">10 Member States</div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button variant="ghost" size="sm" className="w-full text-xs">View</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button className="bg-justice-primary">
                    Integrate New Framework
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LegalSystems;
