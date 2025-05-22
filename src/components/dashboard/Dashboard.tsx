
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardMainContent } from "./DashboardMainContent";
import { ScrollMenu } from "../layout/ScrollMenu";
import { ScrollAgent } from "../animated/ScrollAgent";
import { useState, useEffect } from "react";

export const Dashboard = () => {
  const [agentState, setAgentState] = useState<'idle' | 'loading' | 'processing' | 'judging' | 'complete'>('idle');
  const [agentMessage, setAgentMessage] = useState<string | null>(null);
  
  // Demo animation for the ScrollAgent
  useEffect(() => {
    // Start with loading state
    setAgentState('loading');
    setAgentMessage("Connecting to the ScrollJustice network");
    
    const stateSequence = [
      { state: 'processing' as const, message: "Analyzing recent petitions", delay: 4000 },
      { state: 'judging' as const, message: "Seeking divine wisdom for cases", delay: 8000 },
      { state: 'complete' as const, message: "ScrollJustice Ultra connected", delay: 12000 },
      { state: 'idle' as const, message: "Ready to serve justice", delay: 15000 }
    ];
    
    stateSequence.forEach((sequence, index) => {
      setTimeout(() => {
        setAgentState(sequence.state);
        setAgentMessage(sequence.message);
      }, sequence.delay);
    });
  }, []);
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div>
          <DashboardSidebar />
          
          {/* Add ScrollMenu below sidebar */}
          <div className="mt-6">
            <ScrollMenu />
          </div>
        </div>
        
        <DashboardMainContent />
      </div>
      
      {/* Add ScrollAgent */}
      <ScrollAgent 
        state={agentState} 
        position="bottom-right" 
        withParticles={agentState === 'judging'} 
        size="md"
        message={agentMessage || undefined}
      />
    </div>
  );
};
