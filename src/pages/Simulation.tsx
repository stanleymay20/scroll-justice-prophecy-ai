
import React, { useState } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Button } from '@/components/ui/button';
import { PetitionForm } from '@/components/courtroom/PetitionForm';
import { AlertTriangle, PlayCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Simulation = () => {
  const navigate = useNavigate();
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationPetition, setSimulationPetition] = useState<any>(null);

  const handleSimulationCreated = (petition: any) => {
    // Mark as simulation
    const simPetition = { ...petition, is_simulation: true };
    setSimulationPetition(simPetition);
  };

  const convertToRealPetition = () => {
    if (simulationPetition) {
      // Navigate to create real petition with pre-filled data
      navigate('/petition/new', { 
        state: { 
          prefill: {
            title: simulationPetition.title,
            description: simulationPetition.description
          }
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            <PlayCircle className="inline mr-3 h-8 w-8" />
            ScrollJustice Simulation Mode
          </h1>
          <p className="text-justice-light/80">
            Test the AI legal system with simulated cases - no real legal implications
          </p>
        </div>

        {!simulationMode ? (
          <div className="grid gap-8">
            <GlassCard className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <AlertTriangle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Simulation Mode Notice</h3>
                  <div className="text-justice-light/80 space-y-2">
                    <p>
                      Simulation mode allows you to test the ScrollJustice AI system without filing real legal petitions.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>All verdicts will be marked as "SIMULATION ONLY"</li>
                      <li>No legal obligations or rights are created</li>
                      <li>Cases are not stored in the public archive</li>
                      <li>You can convert simulations to real petitions later</li>
                      <li>All AI disclaimers still apply</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => setSimulationMode(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                size="lg"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Start Simulation
              </Button>
            </GlassCard>

            <GlassCard className="p-8">
              <h3 className="text-xl font-semibold text-white mb-4">How Simulation Works</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-justice-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-justice-primary font-bold text-xl">1</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">File Test Case</h4>
                  <p className="text-justice-light/70 text-sm">
                    Submit a hypothetical legal scenario using the same interface as real petitions
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-justice-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-justice-primary font-bold text-xl">2</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">AI Analysis</h4>
                  <p className="text-justice-light/70 text-sm">
                    Get instant AI verdict with legal reasoning and potential outcomes
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-justice-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-justice-primary font-bold text-xl">3</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Review & Convert</h4>
                  <p className="text-justice-light/70 text-sm">
                    Review the simulation results and optionally convert to a real petition
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        ) : !simulationPetition ? (
          <div>
            <div className="mb-6 p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-amber-400" />
                <span className="text-amber-200 font-medium">SIMULATION MODE ACTIVE</span>
              </div>
              <p className="text-amber-200/80 text-sm mt-1">
                This petition will be processed as a simulation with no legal implications
              </p>
            </div>
            
            <PetitionForm 
              onPetitionCreated={handleSimulationCreated}
              onCancel={() => setSimulationMode(false)}
            />
          </div>
        ) : (
          <div className="grid gap-8">
            <GlassCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <PlayCircle className="h-6 w-6 text-green-400" />
                <h3 className="text-xl font-semibold text-white">Simulation Complete</h3>
                <div className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  SIMULATION ONLY
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Simulated Case:</h4>
                  <h5 className="text-lg text-justice-primary">{simulationPetition.title}</h5>
                  <p className="text-justice-light/80">{simulationPetition.description}</p>
                </div>
                
                <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                  <h4 className="text-green-400 font-medium mb-2">Simulated AI Verdict</h4>
                  <p className="text-green-300 text-sm">
                    Based on the provided information, this simulation demonstrates how the AI would analyze
                    and respond to your case scenario. The verdict includes legal reasoning, potential
                    outcomes, and relevant citations.
                  </p>
                  <p className="text-amber-200 text-xs mt-2 font-medium">
                    ⚠️ SIMULATION ONLY - No legal obligations created
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button
                  onClick={convertToRealPetition}
                  className="bg-justice-primary hover:bg-justice-tertiary"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Convert to Real Petition
                </Button>
                
                <Button
                  onClick={() => {
                    setSimulationMode(false);
                    setSimulationPetition(null);
                  }}
                  variant="outline"
                >
                  Run Another Simulation
                </Button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulation;
