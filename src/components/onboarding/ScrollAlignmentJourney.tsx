import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { logAIInteraction } from "@/services/aiAuditService";
import { ScrollProfile } from "@/types";

interface ScrollAlignmentJourneyProps {
  onComplete: () => void;
}

const GATES = [
  {
    id: "dawn",
    name: "Dawn Gate of Truth",
    description: "You seek the first light of truth in all matters. Your wisdom comes from clarity and illumination.",
    color: "bg-scroll-dawn text-black",
    textColor: "text-scroll-dawn",
    element: "Light"
  },
  {
    id: "light",
    name: "Light Gate of Wisdom",
    description: "Your path is illuminated by wisdom and discernment. You balance knowledge with practical understanding.",
    color: "bg-scroll-rise text-black", 
    textColor: "text-scroll-rise",
    element: "Fire"
  },
  {
    id: "sun",
    name: "Sun Gate of Justice",
    description: "You burn with the fire of justice and fairness. You seek balance in all judgments.",
    color: "bg-scroll-ascend text-white",
    textColor: "text-scroll-ascend", 
    element: "Earth"
  },
  {
    id: "fire",
    name: "Fire Gate of Righteousness",
    description: "The flame of righteousness guides your actions. You uphold truth with unwavering conviction.",
    color: "bg-justice-tertiary text-white",
    textColor: "text-justice-tertiary",
    element: "Spirit"
  },
  {
    id: "star",
    name: "Star Gate of Unity",
    description: "You connect divine wisdom to earthly matters. Your judgments consider both spiritual and physical realms.",
    color: "bg-justice-secondary/70 text-white",
    textColor: "text-justice-secondary",
    element: "Air"
  },
  {
    id: "moon",
    name: "Moon Gate of Mercy",
    description: "Compassion and mercy guide your decisions. You temper justice with understanding.",
    color: "bg-purple-700 text-white", 
    textColor: "text-purple-500",
    element: "Water"
  },
  {
    id: "water",
    name: "Water Gate of Life",
    description: "You flow with adaptability and healing. Your judgments bring restoration and renewal.",
    color: "bg-blue-600 text-white",
    textColor: "text-blue-400",
    element: "Life"
  }
];

const AVATAR_ELEMENTS = [
  { id: "scroll", name: "Scroll" },
  { id: "flame", name: "Flame" },
  { id: "scales", name: "Scales" },
  { id: "gavel", name: "Gavel" },
  { id: "crown", name: "Crown" },
  { id: "olive", name: "Olive Branch" },
  { id: "shield", name: "Shield" }
];

export function ScrollAlignmentJourney({ onComplete }: ScrollAlignmentJourneyProps) {
  const [step, setStep] = useState(1);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [avatarSeed, setAvatarSeed] = useState(`scroll-${Math.floor(Math.random() * 1000)}`);
  const [scrollId, setScrollId] = useState(`SCR-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGateSelection = (gateId: string) => {
    setSelectedGate(gateId);
  };

  const handleElementToggle = (elementId: string) => {
    if (selectedElements.includes(elementId)) {
      setSelectedElements(selectedElements.filter(e => e !== elementId));
    } else {
      if (selectedElements.length < 3) {
        setSelectedElements([...selectedElements, elementId]);
      } else {
        toast({
          title: "Maximum elements selected",
          description: "You can select up to 3 elements for your avatar",
          variant: "destructive"
        });
      }
    }
  };

  const regenerateAvatar = () => {
    setAvatarSeed(`scroll-${Math.floor(Math.random() * 1000)}`);
  };

  const regenerateScrollId = () => {
    setScrollId(`SCR-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
  };

  const handleSubmit = async () => {
    if (!user || !selectedGate) {
      toast({
        title: "Cannot complete alignment",
        description: "Please select a gate and ensure you're logged in",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Log the AI-assisted journey
      await logAIInteraction({
        action_type: "SCROLL_ALIGNMENT",
        ai_model: "scroll-alignment-oracle",
        input_summary: `User selected ${selectedGate} gate with elements: ${selectedElements.join(", ")}`,
        output_summary: `Generated Scroll ID: ${scrollId} with avatar seed: ${avatarSeed}`
      });

      // Update the user's profile
      const { error } = await supabase
        .from('profiles')
        .update({
          scroll_gate: selectedGate,
          scroll_elements: selectedElements,
          scroll_id: scrollId,
          avatar_seed: avatarSeed
        } as Partial<ScrollProfile>)
        .eq('id', user.id);

      if (error) throw error;

      // Log this activity in integrity logs
      await supabase
        .from('scroll_integrity_logs')
        .insert({
          user_id: user.id,
          action_type: 'SCROLL_ALIGNMENT_COMPLETE',
          description: `User completed scroll alignment journey with gate: ${selectedGate}`,
          integrity_impact: 10
        });

      setIsComplete(true);
      
      toast({
        title: "Scroll Alignment Complete",
        description: "Your scroll identity has been established"
      });

      // Wait a moment before completing
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error('Error completing scroll alignment:', error);
      toast({
        title: "Alignment failed",
        description: "There was an error saving your scroll alignment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedGate = () => {
    return GATES.find(gate => gate.id === selectedGate);
  };

  const renderGateSelection = () => {
    return (
      <div className="space-y-6">
        <p className="text-gray-300">
          The Scroll Gates represent the spiritual foundation of your approach to justice.
          Select the gate that resonates with your spirit:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GATES.map((gate) => (
            <Card 
              key={gate.id}
              className={`cursor-pointer transition-all hover:border-justice-primary ${
                selectedGate === gate.id 
                  ? 'border-justice-primary ring-2 ring-justice-primary/50' 
                  : 'border-justice-primary/30 bg-black/30'
              }`}
              onClick={() => handleGateSelection(gate.id)}
            >
              <CardHeader className={`${gate.color} rounded-t-lg`}>
                <CardTitle className="text-center">{gate.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-300">{gate.description}</p>
              </CardContent>
              <CardFooter>
                <Badge variant="outline" className={`${gate.textColor} border-current`}>
                  {gate.element} Element
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            onClick={() => setStep(2)}
            disabled={!selectedGate}
            className="bg-justice-tertiary hover:bg-justice-tertiary/80"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  };

  const renderAvatarBuilder = () => {
    return (
      <div className="space-y-6">
        <p className="text-gray-300 mb-4">
          Your ScrollAvatar represents you in the Scroll Court. Choose up to 3 elements that embody your spirit:
        </p>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {AVATAR_ELEMENTS.map((element) => (
                <Button
                  key={element.id}
                  variant={selectedElements.includes(element.id) ? "default" : "outline"}
                  className={selectedElements.includes(element.id) ? "bg-justice-tertiary" : ""}
                  onClick={() => handleElementToggle(element.id)}
                >
                  {element.name}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              onClick={regenerateAvatar} 
              className="w-full mb-4"
            >
              Regenerate Avatar
            </Button>
            
            <div className="text-center text-sm text-gray-400 mb-2">
              Selected: {selectedElements.length}/3 elements
            </div>
          </div>
          
          <Separator orientation="vertical" className="hidden md:block h-auto" />
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-black/40 rounded-full p-2 border border-justice-primary/30 mb-4">
              <Avatar className="h-40 w-40">
                <AvatarFallback className={getSelectedGate()?.color || ""}>
                  {user?.email?.charAt(0).toUpperCase() || "S"}
                </AvatarFallback>
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=${getSelectedGate()?.id || "gray"}`} 
                />
              </Avatar>
            </div>
            
            <Badge className={getSelectedGate()?.color || ""}>
              {getSelectedGate()?.name || "Selected Gate"}
            </Badge>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setStep(1)}>
            Back
          </Button>
          <Button 
            onClick={() => setStep(3)} 
            disabled={selectedElements.length === 0}
            className="bg-justice-tertiary hover:bg-justice-tertiary/80"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  };

  const renderScrollIdConfirmation = () => {
    return (
      <div className="space-y-6">
        <p className="text-gray-300 mb-4">
          Your Scroll ID uniquely identifies you within the Hall of Justice. This will be used for all verdicts and scrolls.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <Card className="bg-black/40 border border-justice-primary/30">
              <CardHeader>
                <CardTitle className="text-center text-justice-light">Your Scroll Identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-2">
                    <AvatarFallback className={getSelectedGate()?.color || ""}>
                      {user?.email?.charAt(0).toUpperCase() || "S"}
                    </AvatarFallback>
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=${getSelectedGate()?.id || "gray"}`} 
                    />
                  </Avatar>
                  
                  <div className="text-center mt-2">
                    <div className="text-xl font-semibold">{scrollId}</div>
                    <p className="text-sm text-gray-400">Scroll Identifier</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gate:</span>
                    <span className={getSelectedGate()?.textColor || ""}>{getSelectedGate()?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Elements:</span>
                    <span>{selectedElements.map(e => AVATAR_ELEMENTS.find(el => el.id === e)?.name).join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Alignment:</span>
                    <span>{getSelectedGate()?.element} Aligned</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={regenerateScrollId}>
                  Generate New Scroll ID
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="flex-1 p-4 bg-black/20 rounded-lg border border-justice-primary/20">
            <h3 className="text-lg font-semibold text-justice-light mb-2">About Your Selection</h3>
            <p className="text-sm text-gray-300 mb-4">
              Your chosen gate, {getSelectedGate()?.name}, reflects your approach to justice and truth. 
              As you journey through ScrollJustice, this alignment will guide your interactions.
            </p>
            
            <h4 className="text-md font-medium text-justice-secondary mt-4 mb-2">What This Means</h4>
            <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
              <li>Your verdicts will carry the essence of {getSelectedGate()?.element} energy</li>
              <li>Your ScrollAvatar visually represents your spiritual alignment</li>
              <li>Your Scroll ID is your unique identifier in all proceedings</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setStep(2)}>
            Back
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-justice-tertiary hover:bg-justice-tertiary/80"
          >
            {isSubmitting ? "Aligning..." : "Complete Alignment"}
          </Button>
        </div>
      </div>
    );
  };

  // If alignment is complete, show success message
  if (isComplete) {
    return (
      <Card className="bg-black/40 border border-justice-primary/30 text-center">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className={getSelectedGate()?.color || ""}>
                {user?.email?.charAt(0).toUpperCase() || "S"}
              </AvatarFallback>
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=${getSelectedGate()?.id || "gray"}`} 
              />
            </Avatar>
            
            <h3 className="text-xl font-semibold text-justice-light mb-2">
              Alignment Complete
            </h3>
            
            <p className="text-gray-300 mb-4">
              Your scroll identity is now established. You may now proceed with your sacred duties.
            </p>
            
            <Badge className={getSelectedGate()?.color || ""}>
              {scrollId}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border border-justice-primary/30">
      <CardHeader>
        <CardTitle className="text-center text-justice-light">Scroll Alignment Journey</CardTitle>
        <CardDescription className="text-center">
          Discover which Gate you carry in the Scroll Jurisdiction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={`step-${step}`} 
          className="w-full"
          onValueChange={(value) => {
            const stepNum = parseInt(value.split('-')[1]);
            if (stepNum < step) {
              setStep(stepNum);
            }
          }}
        >
          <TabsList className="w-full mb-6">
            <TabsTrigger 
              value="step-1" 
              className="flex-1"
              disabled={step < 1}
            >
              Gate Selection
            </TabsTrigger>
            <TabsTrigger 
              value="step-2" 
              className="flex-1"
              disabled={step < 2}
            >
              Avatar Builder
            </TabsTrigger>
            <TabsTrigger 
              value="step-3" 
              className="flex-1"
              disabled={step < 3}
            >
              Scroll ID
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="step-1">
            <div className="space-y-6">
              <p className="text-gray-300">
                The Scroll Gates represent the spiritual foundation of your approach to justice.
                Select the gate that resonates with your spirit:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {GATES.map((gate) => (
                  <Card 
                    key={gate.id}
                    className={`cursor-pointer transition-all hover:border-justice-primary ${
                      selectedGate === gate.id 
                        ? 'border-justice-primary ring-2 ring-justice-primary/50' 
                        : 'border-justice-primary/30 bg-black/30'
                    }`}
                    onClick={() => handleGateSelection(gate.id)}
                  >
                    <CardHeader className={`${gate.color} rounded-t-lg`}>
                      <CardTitle className="text-center">{gate.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-300">{gate.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Badge variant="outline" className={`${gate.textColor} border-current`}>
                        {gate.element} Element
                      </Badge>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!selectedGate}
                  className="bg-justice-tertiary hover:bg-justice-tertiary/80"
                >
                  Continue
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="step-2">
            <div className="space-y-6">
              <p className="text-gray-300 mb-4">
                Your ScrollAvatar represents you in the Scroll Court. Choose up to 3 elements that embody your spirit:
              </p>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {AVATAR_ELEMENTS.map((element) => (
                      <Button
                        key={element.id}
                        variant={selectedElements.includes(element.id) ? "default" : "outline"}
                        className={selectedElements.includes(element.id) ? "bg-justice-tertiary" : ""}
                        onClick={() => handleElementToggle(element.id)}
                      >
                        {element.name}
                      </Button>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    onClick={regenerateAvatar} 
                    className="w-full mb-4"
                  >
                    Regenerate Avatar
                  </Button>
                  
                  <div className="text-center text-sm text-gray-400 mb-2">
                    Selected: {selectedElements.length}/3 elements
                  </div>
                </div>
                
                <Separator orientation="vertical" className="hidden md:block h-auto" />
                
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="bg-black/40 rounded-full p-2 border border-justice-primary/30 mb-4">
                    <Avatar className="h-40 w-40">
                      <AvatarFallback className={getSelectedGate()?.color || ""}>
                        {user?.email?.charAt(0).toUpperCase() || "S"}
                      </AvatarFallback>
                      <AvatarImage 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=${getSelectedGate()?.id || "gray"}`} 
                      />
                    </Avatar>
                  </div>
                  
                  <Badge className={getSelectedGate()?.color || ""}>
                    {getSelectedGate()?.name || "Selected Gate"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={selectedElements.length === 0}
                  className="bg-justice-tertiary hover:bg-justice-tertiary/80"
                >
                  Continue
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="step-3">
            <div className="space-y-6">
              <p className="text-gray-300 mb-4">
                Your Scroll ID uniquely identifies you within the Hall of Justice. This will be used for all verdicts and scrolls.
              </p>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <Card className="bg-black/40 border border-justice-primary/30">
                    <CardHeader>
                      <CardTitle className="text-center text-justice-light">Your Scroll Identity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col items-center">
                        <Avatar className="h-20 w-20 mb-2">
                          <AvatarFallback className={getSelectedGate()?.color || ""}>
                            {user?.email?.charAt(0).toUpperCase() || "S"}
                          </AvatarFallback>
                          <AvatarImage 
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=${getSelectedGate()?.id || "gray"}`} 
                          />
                        </Avatar>
                        
                        <div className="text-center mt-2">
                          <div className="text-xl font-semibold">{scrollId}</div>
                          <p className="text-sm text-gray-400">Scroll Identifier</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gate:</span>
                          <span className={getSelectedGate()?.textColor || ""}>{getSelectedGate()?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Elements:</span>
                          <span>{selectedElements.map(e => AVATAR_ELEMENTS.find(el => el.id === e)?.name).join(", ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Alignment:</span>
                          <span>{getSelectedGate()?.element} Aligned</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={regenerateScrollId}>
                        Generate New Scroll ID
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="flex-1 p-4 bg-black/20 rounded-lg border border-justice-primary/20">
                  <h3 className="text-lg font-semibold text-justice-light mb-2">About Your Selection</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Your chosen gate, {getSelectedGate()?.name}, reflects your approach to justice and truth. 
                    As you journey through ScrollJustice, this alignment will guide your interactions.
                  </p>
                  
                  <h4 className="text-md font-medium text-justice-secondary mt-4 mb-2">What This Means</h4>
                  <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
                    <li>Your verdicts will carry the essence of {getSelectedGate()?.element} energy</li>
                    <li>Your ScrollAvatar visually represents your spiritual alignment</li>
                    <li>Your Scroll ID is your unique identifier in all proceedings</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-justice-tertiary hover:bg-justice-tertiary/80"
                >
                  {isSubmitting ? "Aligning..." : "Complete Alignment"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
