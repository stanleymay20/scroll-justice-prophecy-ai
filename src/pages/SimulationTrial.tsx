
import { useState, useEffect } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SacredOathScreen } from "@/components/courtroom/SacredOathScreen";
import { MetaTags } from "@/components/MetaTags";
import { CourtFeedback } from "@/components/feedback/CourtFeedback";
import { EmergencyAlert } from "@/components/courtroom/EmergencyAlert";
import { Gavel, Users, MessageSquare, ScrollText, AlertTriangle } from "lucide-react";

const SimulationTrial = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [oathRequired, setOathRequired] = useState(false);
  const [oathCompleted, setOathCompleted] = useState(false);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  useEffect(() => {
    // Check if user has already taken the oath (from localStorage)
    const hasCompletedOath = localStorage.getItem('scrollJustice-oath-taken') === 'true';
    setOathCompleted(hasCompletedOath);
    
    // If user hasn't completed oath, show it when starting simulation
    if (!hasCompletedOath) {
      setOathRequired(true);
    }
  }, []);
  
  const handleStartSimulation = () => {
    if (!oathCompleted) {
      setOathRequired(true);
    } else {
      setSimulationStarted(true);
    }
  };
  
  const handleOathComplete = () => {
    setOathCompleted(true);
    setOathRequired(false);
    setSimulationStarted(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags 
        title="Simulation Trial" 
        description="Practice justice in a sacred simulation courtroom environment"
        keywords="legal simulation, court simulation, practice trial, scroll justice, mock trial"
      />
      
      <NavBar />
      
      {oathRequired && !oathCompleted && (
        <SacredOathScreen 
          userId={user?.id || 'anonymous'} 
          onComplete={handleOathComplete}
        />
      )}
      
      {showFeedback && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <CourtFeedback 
            sessionId="simulation-001" 
            sessionTitle="Simulation Trial" 
            onClose={() => setShowFeedback(false)}
          />
        </div>
      )}
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {t("court.simulation")}
          </h1>
          <p className="text-justice-light/80">
            Practice in a safe, sacred court environment before engaging in real proceedings
          </p>
        </div>
        
        {!simulationStarted ? (
          <div className="max-w-3xl mx-auto">
            <GlassCard className="p-6 mb-8">
              <div className="flex items-start">
                <div className="p-3 bg-justice-primary/20 rounded-lg mr-4">
                  <Gavel className="h-6 w-6 text-justice-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Sacred Simulation Court</h2>
                  <p className="text-justice-light/80 mb-4">
                    Experience a fully simulated sacred court session to practice your legal skills,
                    test arguments, and understand the scroll justice process in a safe environment.
                  </p>
                  <Button onClick={handleStartSimulation}>
                    Start Simulation Trial
                  </Button>
                </div>
              </div>
            </GlassCard>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-4">
                <div className="p-2 bg-justice-primary/20 rounded-full w-fit mb-3">
                  <Users className="h-5 w-5 text-justice-primary" />
                </div>
                <h3 className="font-semibold text-white mb-2">Virtual Participants</h3>
                <p className="text-sm text-justice-light/80">
                  Interact with AI-powered judges, witnesses, and opposing counsel in a realistic setting.
                </p>
              </GlassCard>
              
              <GlassCard className="p-4">
                <div className="p-2 bg-justice-primary/20 rounded-full w-fit mb-3">
                  <ScrollText className="h-5 w-5 text-justice-primary" />
                </div>
                <h3 className="font-semibold text-white mb-2">Sacred Case Library</h3>
                <p className="text-sm text-justice-light/80">
                  Choose from various case types and complexity levels to match your learning needs.
                </p>
              </GlassCard>
              
              <GlassCard className="p-4">
                <div className="p-2 bg-justice-primary/20 rounded-full w-fit mb-3">
                  <MessageSquare className="h-5 w-5 text-justice-primary" />
                </div>
                <h3 className="font-semibold text-white mb-2">Performance Feedback</h3>
                <p className="text-sm text-justice-light/80">
                  Receive sacred insights and guidance on your arguments, evidence presentation, and strategy.
                </p>
              </GlassCard>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Simulation Court: Civil Dispute #27-B</h2>
                <p className="text-justice-light/80">Case Type: Property Dispute | Difficulty: Moderate</p>
              </div>
              <div className="flex space-x-2">
                <EmergencyAlert 
                  sessionId="simulation-001"
                  userId={user?.id || 'anonymous'}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFeedback(true)}
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GlassCard className="p-6 mb-6">
                  <div className="bg-black/40 p-4 rounded-lg mb-4 border border-justice-tertiary/20">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-justice-primary rounded-full mr-2"></div>
                      <span className="text-justice-light font-medium">Court Simulation Active</span>
                    </div>
                    <p className="text-white">
                      Welcome to the sacred simulation court. This is a safe environment to practice
                      your legal arguments and strategies. The AI-powered participants will respond
                      to your actions and provide realistic feedback.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="w-10 h-10 bg-justice-tertiary/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Gavel className="h-5 w-5 text-justice-tertiary" />
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg max-w-[80%]">
                        <p className="text-sm text-justice-tertiary mb-1">Judge Sophia</p>
                        <p className="text-white">
                          The court is now in session. We're here today to address the property dispute
                          between the plaintiff, Mr. Roberts, and the defendant, Mrs. Chen. Counselor,
                          please present your opening statement.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="bg-justice-primary/20 p-3 rounded-lg max-w-[80%]">
                        <p className="text-sm text-justice-primary mb-1">You (Defense Counsel)</p>
                        <p className="text-white">
                          Thank you, Your Honor. My client, Mrs. Chen, has legally owned this property
                          for the past 15 years with complete documentation to prove it. The plaintiff's
                          claim is based on an outdated verbal agreement that was never formalized...
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Users className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg max-w-[80%]">
                        <p className="text-sm text-red-400 mb-1">Opposing Counsel</p>
                        <p className="text-white">
                          Objection, Your Honor! Counsel is misrepresenting the facts. My client has
                          documented evidence of partial payments made towards the property over the
                          course of 10 years that were accepted by Mrs. Chen, establishing a contractual
                          relationship...
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-justice-light/10 pt-4">
                    <textarea
                      className="w-full bg-black/30 border border-justice-tertiary/20 rounded-lg p-3 text-white resize-none focus:outline-none focus:ring-1 focus:ring-justice-primary"
                      rows={3}
                      placeholder="Type your response here..."
                    ></textarea>
                    <div className="mt-3 flex justify-between">
                      <div>
                        <Button variant="outline" size="sm" className="mr-2">
                          Present Evidence
                        </Button>
                        <Button variant="outline" size="sm">
                          Object
                        </Button>
                      </div>
                      <Button>
                        Submit Response
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </div>
              
              <div className="space-y-6">
                <GlassCard className="p-4">
                  <h3 className="font-semibold text-white mb-2">Case Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-justice-light/70">Plaintiff</p>
                      <p className="text-sm text-white">Robert Roberts</p>
                    </div>
                    <div>
                      <p className="text-xs text-justice-light/70">Defendant</p>
                      <p className="text-sm text-white">Sarah Chen</p>
                    </div>
                    <div>
                      <p className="text-xs text-justice-light/70">Case Type</p>
                      <p className="text-sm text-white">Property Dispute</p>
                    </div>
                    <div>
                      <p className="text-xs text-justice-light/70">Judge</p>
                      <p className="text-sm text-white">Hon. Sophia Williams</p>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard className="p-4">
                  <h3 className="font-semibold text-white mb-2">Evidence List</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <ScrollText className="h-4 w-4 text-justice-primary mr-2" />
                      <span className="text-white">Property Deed (2008)</span>
                    </li>
                    <li className="flex items-center">
                      <ScrollText className="h-4 w-4 text-justice-primary mr-2" />
                      <span className="text-white">Payment Records (2010-2020)</span>
                    </li>
                    <li className="flex items-center">
                      <ScrollText className="h-4 w-4 text-justice-primary mr-2" />
                      <span className="text-white">Email Correspondence</span>
                    </li>
                    <li className="flex items-center">
                      <ScrollText className="h-4 w-4 text-justice-primary mr-2" />
                      <span className="text-white">Witness Statements (3)</span>
                    </li>
                  </ul>
                </GlassCard>
                
                <GlassCard className="p-4">
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="h-5 w-5 text-justice-primary mr-2" />
                    <h3 className="font-semibold text-white">Simulation Controls</h3>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Pause Simulation
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Skip to Cross-Examination
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      View Guidance Notes
                    </Button>
                    <Button variant="destructive" size="sm" className="w-full justify-start">
                      End Simulation
                    </Button>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationTrial;
