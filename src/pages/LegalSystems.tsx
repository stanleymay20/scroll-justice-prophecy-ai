
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Check, Loader2, AlertTriangle, Globe, Database, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { scrollMemories, systemHealth, jurisdictions, trainingModels } from "@/services/mockData";
import { ModelTrainingStatus, Jurisdiction, TrainingParameters } from "@/types";
import { JurisdictionList } from "@/components/legal-systems/JurisdictionList";
import { ModelCard } from "@/components/legal-systems/ModelCard";

const LegalSystems = () => {
  // Get the current scroll phase and gate from the first memory
  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;
  
  // State for training parameters
  const [trainingParams, setTrainingParams] = useState<TrainingParameters>({
    jurisdictions: ["US", "UK", "CA"],
    principles: ["Equal Protection", "Right to Privacy"],
    case_count: 5000,
    epochs: 100,
    learning_rate: 0.001,
    balance_jurisdictions: true,
    include_scroll_alignment: true
  });

  // Function to start training
  const startTraining = () => {
    console.log("Starting training with parameters:", trainingParams);
    // In a real app, this would call an API to start the training
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="Legal Systems & Model Training" 
          text="Manage jurisdictions and train AI models with expanded legal datasets"
          systemHealth={systemHealth}
        />

        <Tabs defaultValue="models" className="mt-6">
          <TabsList className="bg-justice-dark/50 w-full overflow-x-auto">
            <TabsTrigger value="models">Model Training</TabsTrigger>
            <TabsTrigger value="jurisdictions">Jurisdictions</TabsTrigger>
            <TabsTrigger value="datasets">Dataset Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="models" className="mt-4 space-y-6">
            <Card className="border-justice-tertiary bg-transparent">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Train New Legal Model
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">
                        Model Name
                      </label>
                      <Input 
                        placeholder="Enter model name..." 
                        defaultValue="Global Precedent Model v3.0"
                        className="bg-justice-dark/50 border-justice-tertiary text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">
                        Select Jurisdictions to Include
                      </label>
                      <Select>
                        <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary text-white">
                          <SelectValue placeholder="Select jurisdictions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Jurisdictions</SelectItem>
                          <SelectItem value="common_law">Common Law Systems Only</SelectItem>
                          <SelectItem value="civil_law">Civil Law Systems Only</SelectItem>
                          <SelectItem value="mixed">Mixed Systems Only</SelectItem>
                          <SelectItem value="custom">Custom Selection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">
                        Case Count for Training
                      </label>
                      <Input 
                        type="number"
                        defaultValue="5000"
                        min="1000"
                        max="50000"
                        className="bg-justice-dark/50 border-justice-tertiary text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">
                        Training Epochs
                      </label>
                      <Input 
                        type="number"
                        defaultValue="100"
                        min="10"
                        max="500"
                        className="bg-justice-dark/50 border-justice-tertiary text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">
                        Learning Rate
                      </label>
                      <Input 
                        type="number"
                        defaultValue="0.001"
                        step="0.0001"
                        min="0.0001"
                        max="0.1"
                        className="bg-justice-dark/50 border-justice-tertiary text-white"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-muted-foreground">
                        Balance Jurisdictions
                      </label>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-muted-foreground">
                        Include Scroll Alignment
                      </label>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-muted-foreground">
                        Enable Divine Architecture
                      </label>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="w-full bg-justice-primary hover:bg-justice-secondary"
                        onClick={startTraining}
                      >
                        <Database className="mr-2 h-5 w-5" />
                        Start Training
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainingModels.map(model => (
                <ModelCard key={model.model_id} model={model} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="jurisdictions" className="mt-4">
            <Card className="border-justice-tertiary bg-transparent">
              <CardHeader className="border-b border-justice-dark">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Jurisdictions ({jurisdictions.length})
                  </CardTitle>
                  <Button variant="outline" className="border-justice-tertiary text-white">
                    Add Jurisdiction
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <JurisdictionList jurisdictions={jurisdictions} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="datasets" className="mt-4">
            <Card className="border-justice-tertiary bg-transparent">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle>Dataset Management</CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-justice-tertiary bg-justice-dark">
                    <CardHeader>
                      <CardTitle className="text-lg">Case Database</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-justice-light">30,128</div>
                      <p className="text-sm text-muted-foreground mt-2">Total cases across all jurisdictions</p>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm">
                          <span>Storage Used</span>
                          <span>42.7 GB</span>
                        </div>
                        <Progress value={68} className="h-2 mt-2" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-justice-tertiary">
                        Manage Cases
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border-justice-tertiary bg-justice-dark">
                    <CardHeader>
                      <CardTitle className="text-lg">Principles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-justice-light">782</div>
                      <p className="text-sm text-muted-foreground mt-2">Legal principles tracked globally</p>
                      <div className="mt-4">
                        <div className="text-sm">
                          <span className="mr-2">Strength Distribution:</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-2 bg-principle-strong flex-1 rounded"></div>
                          <div className="h-2 bg-principle-medium flex-1 rounded"></div>
                          <div className="h-2 bg-principle-weak flex-1 rounded"></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>Strong (45%)</span>
                          <span>Medium (38%)</span>
                          <span>Weak (17%)</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-justice-tertiary">
                        Manage Principles
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border-justice-tertiary bg-justice-dark">
                    <CardHeader>
                      <CardTitle className="text-lg">Training Sets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-justice-light">7</div>
                      <p className="text-sm text-muted-foreground mt-2">Curated training datasets</p>
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between text-sm">
                          <span>Global Common Law</span>
                          <Badge>8.2 GB</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>EU Civil Law</span>
                          <Badge>6.7 GB</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Mixed Systems</span>
                          <Badge>4.1 GB</Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-justice-tertiary">
                        Manage Datasets
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Import External Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-justice-tertiary bg-justice-dark">
                      <CardHeader>
                        <CardTitle className="text-base">Connect to Legal Database</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Select>
                            <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary">
                              <SelectValue placeholder="Select data source" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lexis">LexisNexis</SelectItem>
                              <SelectItem value="westlaw">Westlaw</SelectItem>
                              <SelectItem value="heinonline">HeinOnline</SelectItem>
                              <SelectItem value="bailii">BAILII</SelectItem>
                              <SelectItem value="canlii">CanLII</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input 
                            placeholder="API Key" 
                            className="bg-justice-dark/50 border-justice-tertiary"
                          />
                          <Button className="w-full bg-justice-primary">Connect Database</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-justice-tertiary bg-justice-dark">
                      <CardHeader>
                        <CardTitle className="text-base">Batch Import</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-justice-tertiary rounded-lg p-6 text-center">
                            <p className="text-muted-foreground">
                              Drag and drop files or click to upload
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Supports JSON, CSV, XML formats
                            </p>
                          </div>
                          <Button className="w-full bg-justice-primary">Upload Files</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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
