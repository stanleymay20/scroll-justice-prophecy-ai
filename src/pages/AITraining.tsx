
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ModelTrainingStatus, TrainingParameters, ScrollPhase, ScrollGate, LegalFrameworkFocus } from "@/types";
import { Brain, RefreshCcw, Database, Scale, FilesIcon, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AITraining = () => {
  const [currentPhase, setCurrentPhase] = useState<ScrollPhase>("DAWN");
  const [currentGate, setCurrentGate] = useState<ScrollGate>(3);
  const [activeModels, setActiveModels] = useState<ModelTrainingStatus[]>([
    {
      model_id: "scrollm-v2",
      name: "ScrollMemory V2",
      progress: 78,
      status: "training",
      jurisdiction_coverage: ["US", "UK", "EU", "CA", "AU"],
      accuracy: 89.4,
      cases_analyzed: 382759,
      training_started: new Date(Date.now() - 3600000 * 24 * 3),
      error: undefined,
      international_compliance: 92.3,
      un_compliance: 87.5,
      icc_compliance: 91.2,
      languages_supported: ["en", "fr", "es", "de", "it", "pt"],
      legal_frameworks: ["common_law", "civil_law", "international_law", "humanitarian_law"],
    },
    {
      model_id: "verdict-predictor",
      name: "Verdict Predictor",
      progress: 100,
      status: "completed",
      jurisdiction_coverage: ["US", "UK", "EU"],
      accuracy: 91.2,
      cases_analyzed: 245891,
      training_started: new Date(Date.now() - 3600000 * 24 * 10),
      training_completed: new Date(Date.now() - 3600000 * 12),
      error: undefined,
      international_compliance: 88.7,
      un_compliance: 82.1,
      icc_compliance: 84.3,
      languages_supported: ["en"],
      legal_frameworks: ["common_law"],
    },
    {
      model_id: "doc-analyzer",
      name: "Document Analyzer",
      progress: 35,
      status: "training",
      jurisdiction_coverage: ["US", "UK", "EU", "CA", "AU", "JP", "SG", "IN"],
      accuracy: 83.6,
      cases_analyzed: 129574,
      training_started: new Date(Date.now() - 3600000 * 24),
      error: undefined,
      international_compliance: 79.4,
      un_compliance: 85.2,
      icc_compliance: 76.1,
      languages_supported: ["en", "fr", "es", "de", "zh", "ja"],
      legal_frameworks: ["common_law", "civil_law", "mixed"],
    }
  ]);

  const [newTrainingParams, setNewTrainingParams] = useState<TrainingParameters>({
    name: "Custom Training Model",
    jurisdictions: ["US", "UK", "EU"],
    principles: ["proportionality", "due_process", "equal_protection"],
    case_count: 50000,
    epochs: 100,
    learning_rate: 0.001,
    balance_jurisdictions: true,
    include_scroll_alignment: true,
    include_international_law: true,
    language_weighting: {
      "en": 1.0,
      "fr": 0.8,
      "es": 0.8,
      "de": 0.7,
    },
    legal_framework_focus: [
      { name: "common_law", weight: 0.8, description: "Focus on precedent-based systems" },
      { name: "international_law", weight: 0.6, description: "International treaties and conventions" },
    ],
    un_charter_compliance: true,
    icc_rome_statute_compliance: true,
    human_rights_emphasis: 0.75,
  });

  // Simulate starting a new training job
  const startNewTraining = () => {
    const newModel: ModelTrainingStatus = {
      model_id: `custom-${Date.now().toString().slice(-6)}`,
      name: newTrainingParams.name || "Custom Model",
      progress: 0,
      status: "training",
      jurisdiction_coverage: newTrainingParams.jurisdictions,
      accuracy: 0,
      cases_analyzed: 0,
      training_started: new Date(),
      international_compliance: newTrainingParams.human_rights_emphasis ? newTrainingParams.human_rights_emphasis * 100 : 80,
      un_compliance: newTrainingParams.un_charter_compliance ? 85 : 60,
      icc_compliance: newTrainingParams.icc_rome_statute_compliance ? 82 : 55,
      languages_supported: Object.keys(newTrainingParams.language_weighting || {}),
      legal_frameworks: newTrainingParams.legal_framework_focus?.map(focus => focus.name as string) || [],
    };

    setActiveModels([newModel, ...activeModels]);
    toast({
      title: "Training Started",
      description: `${newModel.name} training has been initiated. Estimated completion time: 36 hours.`,
    });
  };

  // Simulate progress updates for training models
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setActiveModels(models => 
        models.map(model => {
          if (model.status === "training") {
            const newProgress = Math.min(model.progress + (Math.random() * 2), 100);
            if (newProgress === 100) {
              return {
                ...model,
                progress: 100,
                status: "completed",
                training_completed: new Date(),
                accuracy: Math.floor(75 + Math.random() * 20 * 10) / 10
              };
            }
            return {
              ...model,
              progress: newProgress,
              cases_analyzed: model.cases_analyzed + Math.floor(Math.random() * 100)
            };
          }
          return model;
        })
      );
    }, 3000);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    console.log("AITraining component mounted");
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      <div className="flex-1 p-4 md:p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen overflow-x-hidden">
        <PageHeader
          heading="AI Model Training & Enhancement"
          text="Train and enhance legal AI models with advanced learning techniques"
          showExportButton
          onExport={() => {
            toast({
              title: "Export Complete",
              description: "Training data has been exported to your local storage",
            });
          }}
        />

        <Tabs defaultValue="active" className="mt-6">
          <TabsList className="bg-justice-dark/50 w-full overflow-x-auto">
            <TabsTrigger value="active">Active Models</TabsTrigger>
            <TabsTrigger value="new">Train New Model</TabsTrigger>
            <TabsTrigger value="feedback">Feedback Loop</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmark Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeModels.map((model) => (
                <Card key={model.model_id} className="bg-transparent border-justice-tertiary overflow-hidden">
                  <CardHeader className="border-b border-justice-dark flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Brain className="w-5 h-5 mr-2" />
                        {model.name}
                      </CardTitle>
                      <CardDescription>Model ID: {model.model_id}</CardDescription>
                    </div>
                    <Badge
                      className={`${
                        model.status === "completed"
                          ? "bg-principle-strong text-justice-dark"
                          : model.status === "training"
                          ? "bg-scroll-rise text-justice-dark"
                          : "bg-red-500"
                      }`}
                    >
                      {model.status === "completed" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : model.status === "training" ? (
                        <RefreshCcw className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {model.status === "training" && (
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Training Progress</span>
                            <span>{Math.floor(model.progress)}%</span>
                          </div>
                          <Progress value={model.progress} className="h-2 bg-justice-dark" />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Accuracy:</span>
                          <span className="ml-2 font-semibold">
                            {model.accuracy.toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cases Analyzed:</span>
                          <span className="ml-2 font-semibold">
                            {model.cases_analyzed.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Jurisdictions:</span>
                          <span className="ml-2 font-semibold">
                            {model.jurisdiction_coverage.length}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Languages:</span>
                          <span className="ml-2 font-semibold">
                            {model.languages_supported?.length || 0}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-justice-dark/50 rounded-md p-2 text-center">
                          <div className="text-xs text-muted-foreground">International</div>
                          <div className="text-base font-bold">{model.international_compliance?.toFixed(1)}%</div>
                        </div>
                        <div className="bg-justice-dark/50 rounded-md p-2 text-center">
                          <div className="text-xs text-muted-foreground">UN Charter</div>
                          <div className="text-base font-bold">{model.un_compliance?.toFixed(1)}%</div>
                        </div>
                        <div className="bg-justice-dark/50 rounded-md p-2 text-center">
                          <div className="text-xs text-muted-foreground">ICC Rome</div>
                          <div className="text-base font-bold">{model.icc_compliance?.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-justice-dark p-4">
                    <div className="flex justify-between w-full">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Model Details",
                            description: `Viewing detailed analytics for ${model.name}`,
                          });
                        }}
                      >
                        View Details
                      </Button>
                      
                      {model.status === "completed" && (
                        <Button 
                          className="bg-justice-primary hover:bg-justice-secondary" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Model Activated",
                              description: `${model.name} has been set as the active model`,
                            });
                          }}
                        >
                          Activate Model
                        </Button>
                      )}
                      
                      {model.status === "training" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setActiveModels(models => 
                              models.filter(m => m.model_id !== model.model_id)
                            );
                            toast({
                              title: "Training Cancelled",
                              description: `Training for ${model.name} has been cancelled`,
                            });
                          }}
                        >
                          Cancel Training
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="mt-4">
            <Card className="bg-transparent border-justice-tertiary">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle>Train New AI Model</CardTitle>
                <CardDescription>
                  Configure parameters to train a new legal AI model with specific jurisdictional focus
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Model Name</label>
                      <input
                        type="text"
                        className="w-full p-2 rounded-md bg-justice-dark border border-justice-tertiary/30"
                        value={newTrainingParams.name}
                        onChange={(e) => setNewTrainingParams({...newTrainingParams, name: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Jurisdictions Focus</label>
                      <div className="flex flex-wrap gap-2">
                        {["US", "UK", "EU", "CA", "AU", "JP", "SG", "IN", "BR", "ZA"].map((jur) => (
                          <Badge
                            key={jur}
                            className={`cursor-pointer ${
                              newTrainingParams.jurisdictions.includes(jur)
                                ? "bg-justice-primary"
                                : "bg-justice-dark"
                            }`}
                            onClick={() => {
                              if (newTrainingParams.jurisdictions.includes(jur)) {
                                setNewTrainingParams({
                                  ...newTrainingParams,
                                  jurisdictions: newTrainingParams.jurisdictions.filter(j => j !== jur)
                                });
                              } else {
                                setNewTrainingParams({
                                  ...newTrainingParams,
                                  jurisdictions: [...newTrainingParams.jurisdictions, jur]
                                });
                              }
                            }}
                          >
                            {jur}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Case Count</label>
                      <input
                        type="range"
                        min="10000"
                        max="500000"
                        step="10000"
                        className="w-full"
                        value={newTrainingParams.case_count}
                        onChange={(e) => setNewTrainingParams({...newTrainingParams, case_count: parseInt(e.target.value)})}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>10,000</span>
                        <span>{newTrainingParams.case_count.toLocaleString()} cases</span>
                        <span>500,000</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Training Epochs</label>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        step="10"
                        className="w-full"
                        value={newTrainingParams.epochs}
                        onChange={(e) => setNewTrainingParams({...newTrainingParams, epochs: parseInt(e.target.value)})}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>50</span>
                        <span>{newTrainingParams.epochs} epochs</span>
                        <span>500</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Compliance Focus</label>
                      <div className="flex flex-col space-y-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={newTrainingParams.un_charter_compliance}
                            onChange={(e) => setNewTrainingParams({...newTrainingParams, un_charter_compliance: e.target.checked})}
                          />
                          <span>UN Charter Compliance</span>
                        </label>
                        
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={newTrainingParams.icc_rome_statute_compliance}
                            onChange={(e) => setNewTrainingParams({...newTrainingParams, icc_rome_statute_compliance: e.target.checked})}
                          />
                          <span>ICC Rome Statute Compliance</span>
                        </label>
                        
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={newTrainingParams.balance_jurisdictions}
                            onChange={(e) => setNewTrainingParams({...newTrainingParams, balance_jurisdictions: e.target.checked})}
                          />
                          <span>Balance Training Across Jurisdictions</span>
                        </label>
                        
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={newTrainingParams.include_scroll_alignment}
                            onChange={(e) => setNewTrainingParams({...newTrainingParams, include_scroll_alignment: e.target.checked})}
                          />
                          <span>Include Scroll Alignment</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Human Rights Emphasis</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        className="w-full"
                        value={newTrainingParams.human_rights_emphasis}
                        onChange={(e) => setNewTrainingParams({...newTrainingParams, human_rights_emphasis: parseFloat(e.target.value)})}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>{(newTrainingParams.human_rights_emphasis * 100).toFixed(0)}%</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Learning Rate</label>
                      <select 
                        className="w-full p-2 rounded-md bg-justice-dark border border-justice-tertiary/30"
                        value={newTrainingParams.learning_rate}
                        onChange={(e) => setNewTrainingParams({...newTrainingParams, learning_rate: parseFloat(e.target.value)})}
                      >
                        <option value="0.0001">Very Low (0.0001)</option>
                        <option value="0.0005">Low (0.0005)</option>
                        <option value="0.001">Standard (0.001)</option>
                        <option value="0.01">High (0.01)</option>
                        <option value="0.1">Very High (0.1)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-justice-dark/50 rounded-md">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Database className="w-4 h-4 mr-2" /> 
                    Estimated Training Profile
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Training Time:</div>
                      <div className="font-medium">~{Math.ceil(newTrainingParams.case_count / 15000)} hours</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Projected Accuracy:</div>
                      <div className="font-medium">{80 + (newTrainingParams.epochs / 100)}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Model Size:</div>
                      <div className="font-medium">{Math.round(newTrainingParams.case_count / 5000)} MB</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Cost Estimate:</div>
                      <div className="font-medium">${Math.round(newTrainingParams.case_count / 1000)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-justice-dark p-4">
                <div className="flex justify-end w-full">
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => {
                      toast({
                        title: "Settings Saved",
                        description: "Training configuration has been saved as a template",
                      });
                    }}
                  >
                    Save Configuration
                  </Button>
                  <Button 
                    className="bg-justice-primary hover:bg-justice-secondary"
                    onClick={startNewTraining}
                  >
                    Start Training
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-transparent border-justice-tertiary">
                <CardHeader className="border-b border-justice-dark">
                  <CardTitle className="flex items-center">
                    <RefreshCcw className="w-5 h-5 mr-2" />
                    Continuous Learning Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="premium-card p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Active Feedback Loop</h3>
                      <p className="text-sm text-muted-foreground">
                        Enable continuous learning by collecting feedback from legal professionals using the system.
                      </p>
                      
                      <div className="mt-4 grid grid-cols-1 gap-3">
                        <div className="bg-justice-dark/40 p-3 rounded-md">
                          <div className="flex justify-between">
                            <span className="text-sm">Verdict Prediction Feedback</span>
                            <Badge className="bg-scroll-rise text-justice-dark">Active</Badge>
                          </div>
                          <Progress value={68} className="h-1 mt-2 bg-justice-dark" />
                          <div className="text-xs mt-1 text-muted-foreground">43,291 feedback points collected</div>
                        </div>
                        
                        <div className="bg-justice-dark/40 p-3 rounded-md">
                          <div className="flex justify-between">
                            <span className="text-sm">Case Classification Corrections</span>
                            <Badge className="bg-scroll-rise text-justice-dark">Active</Badge>
                          </div>
                          <Progress value={82} className="h-1 mt-2 bg-justice-dark" />
                          <div className="text-xs mt-1 text-muted-foreground">67,845 feedback points collected</div>
                        </div>
                        
                        <div className="bg-justice-dark/40 p-3 rounded-md">
                          <div className="flex justify-between">
                            <span className="text-sm">Citation Correction</span>
                            <Badge className="bg-principle-weak text-white">Paused</Badge>
                          </div>
                          <Progress value={47} className="h-1 mt-2 bg-justice-dark" />
                          <div className="text-xs mt-1 text-muted-foreground">21,567 feedback points collected</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Feedback Integration Status</h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Feedback Integration",
                              description: "Manual feedback integration triggered",
                            });
                          }}
                        >
                          <RefreshCcw className="w-4 h-4 mr-1" /> Run Now
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        All feedback is regularly incorporated into model training to improve accuracy.
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Last Integration:</span>
                          <span>Today, 03:45 AM</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Next Scheduled Integration:</span>
                          <span>Today, 11:45 AM</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Integration Frequency:</span>
                          <span>Every 8 hours</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Feedback Points:</span>
                          <span>132,703</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-transparent border-justice-tertiary">
                <CardHeader className="border-b border-justice-dark">
                  <CardTitle className="flex items-center">
                    <Scale className="w-5 h-5 mr-2" />
                    Correction Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="bg-justice-dark/20 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">Top Correction Categories</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Case Classification</span>
                            <span>32%</span>
                          </div>
                          <div className="w-full bg-justice-dark h-2 rounded-full overflow-hidden">
                            <div className="bg-scroll-rise h-2 rounded-full" style={{width: "32%"}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Verdict Prediction</span>
                            <span>27%</span>
                          </div>
                          <div className="w-full bg-justice-dark h-2 rounded-full overflow-hidden">
                            <div className="bg-scroll-rise h-2 rounded-full" style={{width: "27%"}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Precedent Relevance</span>
                            <span>18%</span>
                          </div>
                          <div className="w-full bg-justice-dark h-2 rounded-full overflow-hidden">
                            <div className="bg-scroll-rise h-2 rounded-full" style={{width: "18%"}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Citation Accuracy</span>
                            <span>14%</span>
                          </div>
                          <div className="w-full bg-justice-dark h-2 rounded-full overflow-hidden">
                            <div className="bg-scroll-rise h-2 rounded-full" style={{width: "14%"}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Document Analysis</span>
                            <span>9%</span>
                          </div>
                          <div className="w-full bg-justice-dark h-2 rounded-full overflow-hidden">
                            <div className="bg-scroll-rise h-2 rounded-full" style={{width: "9%"}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Recent Expert Corrections</h3>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="border border-justice-tertiary/30 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-sm">Case #{Math.floor(Math.random() * 1000000)}</div>
                                <div className="text-xs text-muted-foreground">
                                  {i === 1 ? "Classification correction" : i === 2 ? "Precedent relevance" : "Citation format"}
                                </div>
                              </div>
                              <Badge>{i === 1 ? "High" : i === 2 ? "Medium" : "Low"} Impact</Badge>
                            </div>
                            <div className="mt-2 text-xs">
                              {i === 1 
                                ? "Changed from 'Contract Dispute' to 'Intellectual Property Infringement'" 
                                : i === 2 
                                ? "Added 3 more relevant precedents and removed 1 irrelevant case" 
                                : "Corrected citation format for international court reference"}
                            </div>
                            <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
                              <span>Expert: {i === 1 ? "J. Richardson" : i === 2 ? "M. Gonzalez" : "S. Patel"}</span>
                              <span>{i === 1 ? "2h ago" : i === 2 ? "5h ago" : "Yesterday"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "All Corrections",
                              description: "Viewing all expert corrections",
                            });
                          }}
                        >
                          View All Corrections
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-transparent border-justice-tertiary mt-4">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle className="flex items-center">
                  <FilesIcon className="w-5 h-5 mr-2" />
                  Error Analysis & Model Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium mb-2">Error Distribution by Jurisdiction</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>United States</span>
                        <span>7.2%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>European Union</span>
                        <span>9.5%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>United Kingdom</span>
                        <span>6.8%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Canada</span>
                        <span>8.1%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Australia</span>
                        <span>8.9%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium mb-2">Error Distribution by Case Type</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Criminal</span>
                        <span>6.3%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Civil</span>
                        <span>8.7%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Family</span>
                        <span>12.4%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Commercial</span>
                        <span>5.2%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Constitutional</span>
                        <span>9.6%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium mb-2">Model Improvement Metrics</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Overall Error Reduction</span>
                        <span>23.7%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Classification Accuracy</span>
                        <span>+8.3%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Citation Accuracy</span>
                        <span>+12.5%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Precedent Relevance</span>
                        <span>+15.2%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Prediction Confidence</span>
                        <span>+9.8%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-justice-dark/40 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Automated Improvement Recommendations</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-scroll-rise pl-3">
                      <div className="font-medium">Enhance Family Law Dataset</div>
                      <p className="text-sm text-muted-foreground">
                        Add 25,000+ additional family law cases to address higher error rates in this category.
                      </p>
                    </div>
                    <div className="border-l-4 border-scroll-rise pl-3">
                      <div className="font-medium">Improve EU Jurisdiction Coverage</div>
                      <p className="text-sm text-muted-foreground">
                        Focus on incorporating more multi-lingual EU case data to reduce error rates in European jurisdictions.
                      </p>
                    </div>
                    <div className="border-l-4 border-scroll-rise pl-3">
                      <div className="font-medium">Retrain Citation Extraction Module</div>
                      <p className="text-sm text-muted-foreground">
                        Improve citation detection algorithms with 12,000+ manually verified citation examples.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Button 
                      className="bg-justice-primary hover:bg-justice-secondary"
                      onClick={() => {
                        toast({
                          title: "Improvements Scheduled",
                          description: "Automated improvement recommendations have been scheduled",
                        });
                      }}
                    >
                      Schedule All Recommended Improvements
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="benchmarks" className="mt-4">
            <Card className="bg-transparent border-justice-tertiary">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle>Human Expert Benchmark Comparison</CardTitle>
                <CardDescription>
                  Compare AI model performance against expert legal professionals in controlled tests
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="premium-card p-4 rounded-lg text-center">
                      <div className="text-lg font-bold text-justice-light mb-2">Overall Performance</div>
                      <div className="text-4xl font-bold text-gradient">92.3%</div>
                      <div className="text-sm text-muted-foreground mt-2">vs. Human Experts: 95.7%</div>
                      <Progress value={92.3 / 95.7 * 100} className="h-2 mt-4 bg-justice-dark" />
                    </div>
                    <div className="premium-card p-4 rounded-lg text-center">
                      <div className="text-lg font-bold text-justice-light mb-2">Time Efficiency</div>
                      <div className="text-4xl font-bold text-gradient">87x</div>
                      <div className="text-sm text-muted-foreground mt-2">Faster than human experts</div>
                      <div className="mt-4 text-xs text-muted-foreground">3.2 seconds vs 4.6 minutes avg</div>
                    </div>
                    <div className="premium-card p-4 rounded-lg text-center">
                      <div className="text-lg font-bold text-justice-light mb-2">Cost Efficiency</div>
                      <div className="text-4xl font-bold text-gradient">96.2%</div>
                      <div className="text-sm text-muted-foreground mt-2">Cost reduction vs. manual</div>
                      <div className="mt-4 text-xs text-muted-foreground">$0.12 vs $45.00 per case</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Performance by Task Type</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Case Classification</span>
                          <div>
                            <span className="text-justice-primary">93.2%</span>
                            <span className="text-muted-foreground mx-1">vs</span>
                            <span className="text-muted-foreground">94.7%</span>
                          </div>
                        </div>
                        <div className="w-full bg-justice-dark h-2 rounded-full overflow-hidden">
                          <div className="bg-justice-primary h-2 rounded-full" style={{width: "93.2%"}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Document Analysis</span>
                          <div>
                            <span className="text-justice-primary">89.8%</span>
                            <span className="text-muted-foreground mx-1">vs</span>
                            <span className="text-muted-foreground">92.3%</span>
                          </div>
                        </div>
                        <div className="w-full bg-justice-dark h-2 rounded-full overflow-hidden">
                          <div className="bg-justice-primary h-2 rounded-full" style={{width: "89.8%"}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Precedent Identification</span>
                          <div>
                            <span className="text-justice-primary">91.5%</span>
                            <span className="text-muted-foreground mx-1">vs</span>
                            <span className="text-muted-foreground">96.2%</span>
                          </div>
                        </div>
                        <div className="w-full bg-justice-dark h-2 rounded-full overflow-hidden">
                          <div className="bg-justice-primary h-2 rounded-full" style={{width: "91.5%"}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Outcome Prediction</span>
                          <div>
                            <span className="text-justice-primary">87.4%</span>
                            <span className="text-muted-foreground mx-1">vs</span>
                            <span className="text-muted-foreground">88.9%</span>
                          </div>
                        </div>
                        <div className="w-full bg-justice-dark h-2 rounded-full overflow-hidden">
                          <div className="bg-justice-primary h-2 rounded-full" style={{width: "87.4%"}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Trial Brief Generation</span>
                          <div>
                            <span className="text-justice-primary">86.3%</span>
                            <span className="text-muted-foreground mx-1">vs</span>
                            <span className="text-muted-foreground">94.1%</span>
                          </div>
                        </div>
                        <div className="w-full bg-justice-dark h-2 rounded-full overflow-hidden">
                          <div className="bg-justice-primary h-2 rounded-full" style={{width: "86.3%"}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Benchmark Test Cases</h3>
                      <div className="space-y-2">
                        <div className="bg-justice-dark/20 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <div className="font-medium">Harvard Law Dataset</div>
                            <div className="text-xs text-muted-foreground">1,450 test cases</div>
                          </div>
                          <Badge className="bg-scroll-rise text-justice-dark">93.7% Accuracy</Badge>
                        </div>
                        
                        <div className="bg-justice-dark/20 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <div className="font-medium">Stanford Legal Challenge</div>
                            <div className="text-xs text-muted-foreground">875 test cases</div>
                          </div>
                          <Badge className="bg-scroll-rise text-justice-dark">91.2% Accuracy</Badge>
                        </div>
                        
                        <div className="bg-justice-dark/20 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <div className="font-medium">UK Law Society Challenge</div>
                            <div className="text-xs text-muted-foreground">1,245 test cases</div>
                          </div>
                          <Badge className="bg-scroll-rise text-justice-dark">90.8% Accuracy</Badge>
                        </div>
                        
                        <div className="bg-justice-dark/20 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <div className="font-medium">Global Legal Hackathon</div>
                            <div className="text-xs text-muted-foreground">2,350 test cases</div>
                          </div>
                          <Badge className="bg-scroll-rise text-justice-dark">92.5% Accuracy</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Expert Panel Assessments</h3>
                      <div className="space-y-2">
                        <div className="bg-justice-dark/20 p-3 rounded-lg">
                          <div className="flex justify-between">
                            <div className="font-medium">7 Federal Judges</div>
                            <div className="text-sm">
                              Rating: <span className="text-justice-light">4.7/5</span>
                            </div>
                          </div>
                          <div className="text-xs mt-1 text-muted-foreground">
                            "Impressive accuracy on federal procedural matters and citations"
                          </div>
                        </div>
                        
                        <div className="bg-justice-dark/20 p-3 rounded-lg">
                          <div className="flex justify-between">
                            <div className="font-medium">12 Law Professors</div>
                            <div className="text-sm">
                              Rating: <span className="text-justice-light">4.5/5</span>
                            </div>
                          </div>
                          <div className="text-xs mt-1 text-muted-foreground">
                            "Exceptional grasp of legal principles and precedent connections"
                          </div>
                        </div>
                        
                        <div className="bg-justice-dark/20 p-3 rounded-lg">
                          <div className="flex justify-between">
                            <div className="font-medium">23 Senior Attorneys</div>
                            <div className="text-sm">
                              Rating: <span className="text-justice-light">4.4/5</span>
                            </div>
                          </div>
                          <div className="text-xs mt-1 text-muted-foreground">
                            "Valuable time-saving tool, though lacking some nuanced interpretations"
                          </div>
                        </div>
                        
                        <div className="bg-justice-dark/20 p-3 rounded-lg">
                          <div className="flex justify-between">
                            <div className="font-medium">9 Legal Tech Experts</div>
                            <div className="text-sm">
                              Rating: <span className="text-justice-light">4.9/5</span>
                            </div>
                          </div>
                          <div className="text-xs mt-1 text-muted-foreground">
                            "Leading edge integration of machine learning with legal practice"
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-justice-dark/40 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Areas for Improvement</h3>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-1 h-1 mt-2 mr-2 bg-principle-weak rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Contextual Understanding:</span>
                          <span className="text-muted-foreground ml-2">
                            Improve comprehension of complex legal contexts and unusual case circumstances.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-1 h-1 mt-2 mr-2 bg-principle-weak rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Ethical Reasoning:</span>
                          <span className="text-muted-foreground ml-2">
                            Enhance modeling of ethical considerations in legal analysis.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-1 h-1 mt-2 mr-2 bg-principle-weak rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">International Law Integration:</span>
                          <span className="text-muted-foreground ml-2">
                            Better cross-reference between domestic and international legal principles.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-1 h-1 mt-2 mr-2 bg-principle-weak rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Non-textual Reasoning:</span>
                          <span className="text-muted-foreground ml-2">
                            Improve analysis of visual evidence, body language, and non-verbal cues from trial recordings.
                          </span>
                        </div>
                      </div>
                    </div>
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

export default AITraining;
