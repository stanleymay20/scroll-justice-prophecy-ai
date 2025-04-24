
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { scrollMemories, systemHealth } from "@/services/mockData";
import { 
  Gavel, 
  Users, 
  FileText, 
  Play, 
  BarChart2, 
  Scale, 
  Book, 
  Mic,
  Volume2, 
  ScreenShare,
  UserCheck
} from "lucide-react";
import { FileUploadZone } from "@/components/uploads/FileUploadZone";

const SimulationTrial = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("setup");
  const [loading, setLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  
  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;

  // Simulation configuration state
  const [config, setConfig] = useState({
    caseTitle: "Smith v. Johnson Corp",
    caseType: "employment",
    jurisdiction: "federal",
    complexity: "medium",
    participants: 2,
    duration: 30,
    evidenceCount: 5
  });

  // Sample simulation steps
  const simulationSteps = [
    { name: "Opening Statements", duration: 5 },
    { name: "Plaintiff Evidence Presentation", duration: 8 },
    { name: "Defendant Evidence Presentation", duration: 8 },
    { name: "Witness Examination", duration: 10 },
    { name: "Closing Arguments", duration: 5 },
    { name: "Judicial Decision", duration: 2 }
  ];

  // Sample evidence data
  const evidenceItems = [
    { id: 1, name: "Employment Contract", type: "document", strength: 0.8 },
    { id: 2, name: "Email Correspondence", type: "document", strength: 0.6 },
    { id: 3, name: "Witness Testimony", type: "audio", strength: 0.7 },
    { id: 4, name: "Security Camera Footage", type: "video", strength: 0.9 },
    { id: 5, name: "Performance Reviews", type: "document", strength: 0.5 }
  ];

  // Handle config changes
  const handleConfigChange = (key: string, value: string | number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Start simulation
  const startSimulation = () => {
    setLoading(true);
    
    setTimeout(() => {
      setIsSimulating(true);
      setActiveTab("simulation");
      setLoading(false);
      toast({
        title: "Simulation Started",
        description: `Trial simulation for "${config.caseTitle}" has been initiated.`,
      });
    }, 1500);
  };

  // Advance simulation step
  const advanceStep = () => {
    if (currentStep < simulationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeSimulation();
    }
  };

  // Complete simulation
  const completeSimulation = () => {
    setIsSimulating(false);
    setActiveTab("results");
    toast({
      title: "Simulation Completed",
      description: "Trial simulation has concluded. Results are now available.",
    });
  };

  // Reset simulation
  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentStep(0);
    setActiveTab("setup");
  };

  // Toggle voice narration
  const toggleVoice = () => {
    setVoiceEnabled(prev => !prev);
    toast({
      title: voiceEnabled ? "Voice Narration Disabled" : "Voice Narration Enabled",
      description: voiceEnabled ? 
        "Voice narration has been turned off." : 
        "AI voice will narrate the trial proceedings.",
      variant: voiceEnabled ? "default" : "default",
    });
  };

  // Toggle screen sharing
  const toggleScreenShare = () => {
    setScreenShareEnabled(prev => !prev);
    toast({
      title: screenShareEnabled ? "Screen Sharing Disabled" : "Screen Sharing Enabled",
      description: screenShareEnabled ? 
        "Screen sharing has been turned off." : 
        "Your screen can now be shared with participants.",
      variant: screenShareEnabled ? "default" : "default",
    });
  };

  // Handle evidence upload
  const handleEvidenceUpload = (files: File[]) => {
    toast({
      title: "Evidence Uploaded",
      description: `${files.length} file(s) have been added to the evidence repository.`,
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      <div className="flex-1 p-4 md:p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="Trial Simulation" 
          text="Experience realistic court proceedings with AI-powered simulation"
          systemHealth={systemHealth}
        />

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-justice-dark/50 w-full overflow-x-auto">
              <TabsTrigger value="setup" className="flex items-center">
                <Gavel className="w-4 h-4 mr-2" />
                Setup
              </TabsTrigger>
              <TabsTrigger value="evidence" className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Evidence
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Participants
              </TabsTrigger>
              <TabsTrigger value="simulation" className="flex items-center" disabled={!isSimulating && activeTab !== "simulation"}>
                <Play className="w-4 h-4 mr-2" />
                Simulation
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center" disabled={activeTab !== "results"}>
                <BarChart2 className="w-4 h-4 mr-2" />
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="setup">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-justice-tertiary bg-transparent">
                  <CardHeader className="border-b border-justice-dark">
                    <CardTitle>Simulation Configuration</CardTitle>
                    <CardDescription>Set up your trial simulation parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="case-title">Case Title</Label>
                        <Input 
                          id="case-title"
                          value={config.caseTitle}
                          onChange={(e) => handleConfigChange("caseTitle", e.target.value)}
                          className="bg-justice-dark/50 border-justice-tertiary/30"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="case-type">Case Type</Label>
                          <Select 
                            value={config.caseType} 
                            onValueChange={(value) => handleConfigChange("caseType", value)}
                          >
                            <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary/30">
                              <SelectValue placeholder="Select case type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="criminal">Criminal</SelectItem>
                              <SelectItem value="civil">Civil</SelectItem>
                              <SelectItem value="family">Family</SelectItem>
                              <SelectItem value="employment">Employment</SelectItem>
                              <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="jurisdiction">Jurisdiction</Label>
                          <Select 
                            value={config.jurisdiction} 
                            onValueChange={(value) => handleConfigChange("jurisdiction", value)}
                          >
                            <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary/30">
                              <SelectValue placeholder="Select jurisdiction" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="federal">Federal</SelectItem>
                              <SelectItem value="state">State</SelectItem>
                              <SelectItem value="appellate">Appellate</SelectItem>
                              <SelectItem value="supreme">Supreme Court</SelectItem>
                              <SelectItem value="administrative">Administrative</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="complexity">Complexity Level</Label>
                          <Select 
                            value={config.complexity} 
                            onValueChange={(value) => handleConfigChange("complexity", value)}
                          >
                            <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary/30">
                              <SelectValue placeholder="Select complexity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="participants">Participants</Label>
                          <Select 
                            value={config.participants.toString()} 
                            onValueChange={(value) => handleConfigChange("participants", parseInt(value))}
                          >
                            <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary/30">
                              <SelectValue placeholder="Select number" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 Participants</SelectItem>
                              <SelectItem value="3">3 Participants</SelectItem>
                              <SelectItem value="4">4 Participants</SelectItem>
                              <SelectItem value="5">5+ Participants</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duration">Duration (Minutes)</Label>
                          <Select 
                            value={config.duration.toString()} 
                            onValueChange={(value) => handleConfigChange("duration", parseInt(value))}
                          >
                            <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary/30">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10 Minutes</SelectItem>
                              <SelectItem value="20">20 Minutes</SelectItem>
                              <SelectItem value="30">30 Minutes</SelectItem>
                              <SelectItem value="60">60 Minutes</SelectItem>
                              <SelectItem value="120">2 Hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="evidence-count">Evidence Items</Label>
                          <Select 
                            value={config.evidenceCount.toString()} 
                            onValueChange={(value) => handleConfigChange("evidenceCount", parseInt(value))}
                          >
                            <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary/30">
                              <SelectValue placeholder="Select number" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 Items</SelectItem>
                              <SelectItem value="5">5 Items</SelectItem>
                              <SelectItem value="10">10 Items</SelectItem>
                              <SelectItem value="15">15 Items</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setActiveTab("evidence")}>
                        Manage Evidence
                      </Button>
                      <Button 
                        className="bg-justice-primary hover:bg-justice-secondary"
                        onClick={startSimulation}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Initializing...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Play className="mr-2 h-4 w-4" />
                            Start Simulation
                          </span>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-justice-tertiary bg-transparent">
                  <CardHeader className="border-b border-justice-dark">
                    <CardTitle>Advanced Features</CardTitle>
                    <CardDescription>Enable premium simulation features</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">AI Voice Narration</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable realistic voice narration during the simulation
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Switch 
                            checked={voiceEnabled}
                            onCheckedChange={toggleVoice}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Screen Sharing</Label>
                          <p className="text-sm text-muted-foreground">
                            Share your screen with participants during the simulation
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Switch 
                            checked={screenShareEnabled}
                            onCheckedChange={toggleScreenShare}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Real-time Transcription</Label>
                          <p className="text-sm text-muted-foreground">
                            Generate real-time transcripts during the simulation
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Switch />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Expert Commentary</Label>
                          <p className="text-sm text-muted-foreground">
                            Add expert legal commentary during key moments
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Switch />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Scroll Alignment Analysis</Label>
                          <p className="text-sm text-muted-foreground">
                            Analyze simulation outcomes against Scroll Phase metrics
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="evidence">
              <Card className="border-justice-tertiary bg-transparent">
                <CardHeader className="border-b border-justice-dark">
                  <CardTitle>Evidence Repository</CardTitle>
                  <CardDescription>Upload and manage case evidence</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Upload Evidence</h3>
                      <FileUploadZone
                        onFilesUploaded={handleEvidenceUpload}
                        allowedTypes={[".pdf", ".docx", ".jpg", ".png", ".mp3", ".mp4"]}
                        className="py-4"
                      />
                      
                      <div className="mt-6">
                        <Label htmlFor="evidence-notes">Evidence Notes</Label>
                        <Textarea 
                          id="evidence-notes"
                          placeholder="Add notes about this evidence..."
                          className="bg-justice-dark/50 border-justice-tertiary/30 h-24 resize-none mt-2"
                        />
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="evidence-type">Evidence Type</Label>
                          <Select defaultValue="document">
                            <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary/30">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="document">Document</SelectItem>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="audio">Audio Recording</SelectItem>
                              <SelectItem value="video">Video Recording</SelectItem>
                              <SelectItem value="physical">Physical Item</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="admission-status">Admission Status</Label>
                          <Select defaultValue="pending">
                            <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary/30">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="admitted">Admitted</SelectItem>
                              <SelectItem value="contested">Contested</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <Button className="bg-justice-primary hover:bg-justice-secondary">
                          Add to Evidence
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Current Evidence</h3>
                      <div className="space-y-3">
                        {evidenceItems.map(evidence => (
                          <div key={evidence.id} className="bg-justice-dark/50 border border-justice-tertiary/30 rounded-md p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {evidence.type === 'document' && <FileText className="h-5 w-5 mr-2 text-justice-light" />}
                                {evidence.type === 'audio' && <Mic className="h-5 w-5 mr-2 text-justice-light" />}
                                {evidence.type === 'video' && <ScreenShare className="h-5 w-5 mr-2 text-justice-light" />}
                                <span className="font-medium">{evidence.name}</span>
                              </div>
                              <div className="bg-justice-tertiary/20 px-2 py-1 rounded text-xs">
                                {Math.floor(evidence.strength * 100)}% strength
                              </div>
                            </div>
                            
                            <div className="mt-2 flex justify-between items-center">
                              <span className="text-xs text-muted-foreground capitalize">{evidence.type}</span>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="h-7 px-2">View</Button>
                                <Button variant="outline" size="sm" className="h-7 px-2">Edit</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("setup")}>
                      Back to Setup
                    </Button>
                    <Button className="bg-justice-primary hover:bg-justice-secondary" onClick={() => setActiveTab("participants")}>
                      Continue to Participants
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="participants">
              <Card className="border-justice-tertiary bg-transparent">
                <CardHeader className="border-b border-justice-dark">
                  <CardTitle>Trial Participants</CardTitle>
                  <CardDescription>Configure roles and participants for the simulation</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-4">Main Roles</h3>
                      
                      <div className="bg-justice-dark/50 border border-justice-tertiary/30 rounded-md p-4">
                        <Label className="text-base font-medium">Judge</Label>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="judge-name" className="text-sm">Name</Label>
                            <Input 
                              id="judge-name"
                              defaultValue="Hon. Maria Rodriguez"
                              className="bg-justice-tertiary/20 border-justice-tertiary/30 mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="judge-experience" className="text-sm">Experience</Label>
                            <Select defaultValue="high">
                              <SelectTrigger className="bg-justice-tertiary/20 border-justice-tertiary/30 mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Junior (1-5 years)</SelectItem>
                                <SelectItem value="medium">Intermediate (5-10 years)</SelectItem>
                                <SelectItem value="high">Senior (10+ years)</SelectItem>
                                <SelectItem value="expert">Expert (20+ years)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-justice-dark/50 border border-justice-tertiary/30 rounded-md p-4">
                        <Label className="text-base font-medium">Plaintiff Attorney</Label>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="plaintiff-attorney-name" className="text-sm">Name</Label>
                            <Input 
                              id="plaintiff-attorney-name"
                              defaultValue="James Wilson"
                              className="bg-justice-tertiary/20 border-justice-tertiary/30 mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="plaintiff-attorney-style" className="text-sm">Style</Label>
                            <Select defaultValue="aggressive">
                              <SelectTrigger className="bg-justice-tertiary/20 border-justice-tertiary/30 mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="aggressive">Aggressive</SelectItem>
                                <SelectItem value="methodical">Methodical</SelectItem>
                                <SelectItem value="persuasive">Persuasive</SelectItem>
                                <SelectItem value="emotional">Emotional</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-justice-dark/50 border border-justice-tertiary/30 rounded-md p-4">
                        <Label className="text-base font-medium">Defendant Attorney</Label>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="defendant-attorney-name" className="text-sm">Name</Label>
                            <Input 
                              id="defendant-attorney-name"
                              defaultValue="Sarah Chen"
                              className="bg-justice-tertiary/20 border-justice-tertiary/30 mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="defendant-attorney-style" className="text-sm">Style</Label>
                            <Select defaultValue="methodical">
                              <SelectTrigger className="bg-justice-tertiary/20 border-justice-tertiary/30 mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="aggressive">Aggressive</SelectItem>
                                <SelectItem value="methodical">Methodical</SelectItem>
                                <SelectItem value="persuasive">Persuasive</SelectItem>
                                <SelectItem value="emotional">Emotional</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Additional Participants</h3>
                      <div className="space-y-4">
                        <div className="bg-justice-dark/50 border border-justice-tertiary/30 rounded-md p-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-base font-medium">Witnesses</Label>
                            <Button variant="outline" size="sm">+ Add</Button>
                          </div>
                          <div className="mt-3 space-y-3">
                            <div className="bg-justice-tertiary/20 p-3 rounded-lg">
                              <div className="flex justify-between">
                                <div className="font-medium">John Smith</div>
                                <div className="text-xs bg-justice-primary/20 px-2 py-1 rounded">Plaintiff Witness</div>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">Former employee, HR Department</div>
                            </div>
                            <div className="bg-justice-tertiary/20 p-3 rounded-lg">
                              <div className="flex justify-between">
                                <div className="font-medium">Emily Johnson</div>
                                <div className="text-xs bg-justice-primary/20 px-2 py-1 rounded">Expert Witness</div>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">Employment law specialist</div>
                            </div>
                            <div className="bg-justice-tertiary/20 p-3 rounded-lg">
                              <div className="flex justify-between">
                                <div className="font-medium">Michael Taylor</div>
                                <div className="text-xs bg-justice-primary/20 px-2 py-1 rounded">Defendant Witness</div>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">Company CEO</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-justice-dark/50 border border-justice-tertiary/30 rounded-md p-4">
                          <Label className="text-base font-medium">Other Participants</Label>
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="font-medium">Court Reporter</div>
                                <div className="text-sm text-muted-foreground">Records trial proceedings</div>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="font-medium">Jury</div>
                                <div className="text-sm text-muted-foreground">12-person jury panel</div>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="font-medium">Bailiff</div>
                                <div className="text-sm text-muted-foreground">Maintains order in court</div>
                              </div>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="font-medium">Legal Clerk</div>
                                <div className="text-sm text-muted-foreground">Assists with documentation</div>
                              </div>
                              <Switch />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("evidence")}>
                      Back to Evidence
                    </Button>
                    <Button 
                      className="bg-justice-primary hover:bg-justice-secondary"
                      onClick={startSimulation}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Initializing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Play className="mr-2 h-4 w-4" />
                          Start Simulation
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="simulation">
              <Card className="border-justice-tertiary bg-transparent">
                <CardHeader className="border-b border-justice-dark">
                  <CardTitle>Trial Simulation</CardTitle>
                  <CardDescription>{config.caseTitle} - In Progress</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-xl font-semibold mb-2">
                              {simulationSteps[currentStep]?.name || "Simulation Complete"}
                            </div>
                            <div className="text-justice-light text-sm">
                              {isSimulating ? (
                                <span>Step {currentStep + 1} of {simulationSteps.length}</span>
                              ) : (
                                <span>Simulation has concluded</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Button size="icon" variant="outline" onClick={toggleVoice} className="h-8 w-8">
                              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-muted-foreground" />}
                            </Button>
                            <Button size="icon" variant="outline" onClick={toggleScreenShare} className="h-8 w-8">
                              {screenShareEnabled ? <ScreenShare className="h-4 w-4" /> : <ScreenShare className="h-4 w-4 text-muted-foreground" />}
                            </Button>
                          </div>
                          {isSimulating && (
                            <Button onClick={advanceStep} className="bg-justice-primary hover:bg-justice-secondary">
                              Next Step
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-3">Live Transcript</h3>
                        <div className="bg-justice-dark/50 border border-justice-tertiary/30 rounded-md p-4 h-64 overflow-y-auto">
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Judge Rodriguez:</div>
                              <p>Court is now in session. We're hearing case number A-472-B, Smith v. Johnson Corp, a matter of alleged wrongful termination.</p>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Clerk:</div>
                              <p>All parties have been sworn in, Your Honor.</p>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Judge Rodriguez:</div>
                              <p>Thank you. Mr. Wilson, you may proceed with opening statements for the plaintiff.</p>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Attorney Wilson:</div>
                              <p>Thank you, Your Honor. Ladies and gentlemen of the jury, my client John Smith worked faithfully for Johnson Corp for eight years...</p>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Attorney Wilson:</div>
                              <p>...and the evidence will show that his termination was in direct violation of both company policy and state law.</p>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Judge Rodriguez:</div>
                              <p>Thank you, Mr. Wilson. Ms. Chen, your opening statement for the defense?</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="bg-justice-tertiary/10 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-medium mb-3">Trial Progress</h3>
                        <div className="space-y-3">
                          {simulationSteps.map((step, index) => (
                            <div 
                              key={index}
                              className={`p-3 rounded-lg border ${
                                index === currentStep ? 'bg-justice-primary/20 border-justice-primary' : 
                                index < currentStep ? 'bg-justice-dark/50 border-justice-tertiary/30 opacity-60' : 
                                'bg-justice-dark/30 border-justice-tertiary/20'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  {index < currentStep && <UserCheck className="h-4 w-4 mr-2 text-justice-light" />}
                                  {index === currentStep && <Play className="h-4 w-4 mr-2 text-justice-primary" />}
                                  <span>{step.name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{step.duration} min</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6">
                          <Label className="text-sm">Current Phase</Label>
                          <div className="bg-justice-dark/50 p-3 rounded-lg mt-1 text-center">
                            <div className="text-lg font-semibold text-justice-light">
                              {simulationSteps[currentStep]?.name || "Complete"}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Card className="border-justice-tertiary/30 bg-transparent">
                        <CardHeader className="py-3 px-4 border-b border-justice-dark">
                          <CardTitle className="text-sm">Simulation Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                          <Button variant="outline" className="w-full justify-start" disabled={!isSimulating}>
                            <Play className="mr-2 h-4 w-4" />
                            <span>Resume</span>
                          </Button>
                          <Button variant="outline" className="w-full justify-start" disabled={!isSimulating}>
                            <Play className="mr-2 h-4 w-4" />
                            <span>Pause</span>
                          </Button>
                          <Button variant="outline" className="w-full justify-start" onClick={resetSimulation}>
                            <Play className="mr-2 h-4 w-4" />
                            <span>Reset</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-destructive hover:text-destructive"
                            onClick={completeSimulation}
                            disabled={!isSimulating}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            <span>End Simulation</span>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="border-justice-tertiary bg-transparent">
                    <CardHeader className="border-b border-justice-dark">
                      <CardTitle>Simulation Results</CardTitle>
                      <CardDescription>{config.caseTitle} - Case Outcome</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="bg-justice-tertiary/10 p-5 rounded-lg mb-6 text-center">
                        <h3 className="text-xl font-semibold mb-1">Judgment</h3>
                        <div className="text-3xl font-bold text-justice-light">Plaintiff Prevails</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Based on evidence strength and legal argumentation
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-justice-dark/50 border border-justice-tertiary/30 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Plaintiff Score</div>
                          <div className="text-2xl font-semibold text-justice-light">76%</div>
                        </div>
                        <div className="bg-justice-dark/50 border border-justice-tertiary/30 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Defendant Score</div>
                          <div className="text-2xl font-semibold">42%</div>
                        </div>
                        <div className="bg-justice-dark/50 border border-justice-tertiary/30 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Award Amount</div>
                          <div className="text-2xl font-semibold text-justice-light">$125,000</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Key Factors in Decision</h3>
                          <div className="space-y-2">
                            <div className="bg-justice-tertiary/20 p-3 rounded-lg">
                              <div className="flex items-center">
                                <div className="bg-justice-primary/30 rounded-full h-6 w-6 flex items-center justify-center mr-3">1</div>
                                <div>
                                  <div className="font-medium">Employment Contract Violation</div>
                                  <p className="text-sm text-muted-foreground">Clear evidence of contract terms being breached by employer</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-justice-tertiary/20 p-3 rounded-lg">
                              <div className="flex items-center">
                                <div className="bg-justice-primary/30 rounded-full h-6 w-6 flex items-center justify-center mr-3">2</div>
                                <div>
                                  <div className="font-medium">Witness Testimony Credibility</div>
                                  <p className="text-sm text-muted-foreground">HR director testimony strongly supported plaintiff's claims</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-justice-tertiary/20 p-3 rounded-lg">
                              <div className="flex items-center">
                                <div className="bg-justice-primary/30 rounded-full h-6 w-6 flex items-center justify-center mr-3">3</div>
                                <div>
                                  <div className="font-medium">Inconsistent Defense Arguments</div>
                                  <p className="text-sm text-muted-foreground">Defense presented contradictory reasoning for termination</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Judge's Summary</h3>
                          <div className="bg-justice-dark/50 border border-justice-tertiary/30 rounded-md p-4 italic">
                            <p>"The evidence clearly shows that Johnson Corp violated the terms of its own employment policies and Mr. Smith's employment contract. The defendant's claim of performance issues is not supported by the documentary evidence presented, which shows consistently positive performance reviews. The court therefore finds in favor of the plaintiff and awards damages as stated."</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="border-justice-tertiary bg-transparent">
                    <CardHeader className="border-b border-justice-dark">
                      <CardTitle>Performance Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-6">
                        <div>
                          <Label className="text-base">Evidence Effectiveness</Label>
                          <div className="mt-2 space-y-2">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Employment Contract</span>
                                <span>92%</span>
                              </div>
                              <div className="h-2 bg-justice-dark/50 rounded-full overflow-hidden">
                                <div className="bg-justice-primary h-full" style={{ width: '92%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Email Correspondence</span>
                                <span>78%</span>
                              </div>
                              <div className="h-2 bg-justice-dark/50 rounded-full overflow-hidden">
                                <div className="bg-justice-primary h-full" style={{ width: '78%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Performance Reviews</span>
                                <span>85%</span>
                              </div>
                              <div className="h-2 bg-justice-dark/50 rounded-full overflow-hidden">
                                <div className="bg-justice-primary h-full" style={{ width: '85%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-base">Attorney Performance</Label>
                          <div className="mt-2 space-y-3">
                            <div className="bg-justice-dark/50 p-3 rounded-lg">
                              <div className="flex justify-between">
                                <span>Plaintiff Attorney</span>
                                <span className="font-medium text-justice-light">A-</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Strong opening, excellent evidence presentation
                              </div>
                            </div>
                            <div className="bg-justice-dark/50 p-3 rounded-lg">
                              <div className="flex justify-between">
                                <span>Defense Attorney</span>
                                <span className="font-medium">C+</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Inconsistent arguments, weak cross-examination
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-base">Scroll Alignment</Label>
                          <div className="mt-2 bg-justice-tertiary/10 p-3 rounded-lg">
                            <div className="text-center">
                              <div className="text-lg font-semibold">
                                {currentPhase} Phase - Gate {currentGate}
                              </div>
                              <div className="text-sm text-justice-light mt-1">
                                87% alignment with judicial prophecy
                              </div>
                            </div>
                            <div className="mt-3 text-xs text-muted-foreground">
                              This case outcome strongly aligns with the principles of equality and fairness emphasized in the current DAWN phase of scroll memory.
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex flex-col space-y-3">
                        <Button className="bg-justice-primary hover:bg-justice-secondary">
                          Export Full Analysis
                        </Button>
                        <Button variant="outline" onClick={resetSimulation}>
                          Start New Simulation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SimulationTrial;
