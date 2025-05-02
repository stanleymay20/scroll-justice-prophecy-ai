
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { useLanguage } from "@/contexts/language";

interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// Mock simulation scenarios
const mockScenarios: SimulationScenario[] = [
  {
    id: "sim-001",
    title: "Digital Evidence Integrity",
    description: "Navigate a case where digital evidence integrity is in question",
    difficulty: "beginner"
  },
  {
    id: "sim-002",
    title: "Cross-Jurisdictional Dispute",
    description: "Handle a dispute that spans multiple digital jurisdictions",
    difficulty: "intermediate"
  },
  {
    id: "sim-003",
    title: "AI Entity Rights",
    description: "Explore the complex case of AI entity rights and representation",
    difficulty: "advanced"
  }
];

export default function SimulationTrial() {
  const { t } = useLanguage();
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset UI state when component mounts
  useEffect(() => {
    console.log("SimulationTrial component mounted");
    return () => {
      console.log("SimulationTrial component unmounted");
    };
  }, []);

  const handleSelectScenario = (scenario: SimulationScenario) => {
    setIsLoading(true);
    // Simulate loading time for better UX
    setTimeout(() => {
      setSelectedScenario(scenario);
      setIsLoading(false);
    }, 1500);
  };

  const handleStartSimulation = () => {
    // In a real app, this would navigate to the simulation or change the UI state
    console.log("Starting simulation for scenario:", selectedScenario?.id);
  };

  const handleResetSelection = () => {
    setSelectedScenario(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags 
        title={t("court.simulation")} 
        description={t("landing.cta.experience")}
      />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          {t("court.simulation")}
        </h1>
        
        <div className="max-w-4xl mx-auto">
          {/* Render simulation interface based on state */}
          {selectedScenario ? (
            <div className="bg-black/30 backdrop-blur-sm border border-justice-primary/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-justice-primary mb-2">
                {selectedScenario.title}
              </h2>
              <p className="text-justice-light/80 mb-6">
                {selectedScenario.description}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button 
                  variant="default" 
                  onClick={handleStartSimulation}
                  className="bg-justice-tertiary hover:bg-justice-tertiary/80"
                >
                  Start Simulation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleResetSelection}
                >
                  Choose Another Scenario
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockScenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => handleSelectScenario(scenario)}
                  disabled={isLoading}
                  className="bg-black/30 backdrop-blur-sm border border-justice-primary/30 rounded-lg p-6 text-left hover:border-justice-primary transition-all hover:bg-black/50 disabled:opacity-50"
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    {scenario.title}
                  </h3>
                  <p className="text-justice-light/80 mb-4">
                    {scenario.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-justice-primary">
                      {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                    </span>
                    <span className="text-sm text-justice-light/50">
                      Select →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
