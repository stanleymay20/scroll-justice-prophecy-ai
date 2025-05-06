
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIComplianceContextType {
  hasAIConsent: boolean;
  setAIConsent: (consent: boolean) => void;
  aiUsageStats: {
    interactionsToday: number;
    totalInteractions: number;
    lastUsedModel: string;
  };
  refreshAIStats: () => Promise<void>;
  requestDataDeletion: () => Promise<boolean>;
}

const AIComplianceContext = createContext<AIComplianceContextType | undefined>(undefined);

export const AIComplianceProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [hasAIConsent, setHasAIConsent] = useState<boolean>(() => {
    // Get consent from localStorage
    const savedConsent = localStorage.getItem('ai-consent');
    return savedConsent !== null ? JSON.parse(savedConsent) : true; // Default to true
  });
  
  const [aiUsageStats, setAIUsageStats] = useState({
    interactionsToday: 0,
    totalInteractions: 0,
    lastUsedModel: ''
  });
  
  const { toast } = useToast();

  // Save consent to localStorage when changed
  useEffect(() => {
    localStorage.setItem('ai-consent', JSON.stringify(hasAIConsent));
  }, [hasAIConsent]);

  // Fetch AI usage statistics from Supabase
  useEffect(() => {
    refreshAIStats();
  }, []);

  const refreshAIStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      // Get today's date at midnight for filtering
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Fetch usage stats
      const { data: allLogs } = await supabase
        .from('ai_audit_logs')
        .select('*')
        .eq('user_id', user.id);
      
      if (!allLogs) return;
      
      // Calculate statistics
      const interactionsToday = allLogs.filter(log => 
        new Date(log.created_at) >= today
      ).length;
      
      const totalInteractions = allLogs.length;
      
      // Get last used model
      const lastUsedModel = allLogs.length > 0 ?
        allLogs.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0].ai_model :
        '';
      
      setAIUsageStats({
        interactionsToday,
        totalInteractions,
        lastUsedModel
      });
      
    } catch (error) {
      console.error("Failed to fetch AI usage statistics:", error);
    }
  };

  const setAIConsent = (consent: boolean) => {
    setHasAIConsent(consent);
    
    // Show toast message
    toast({
      title: consent ? "AI Features Enabled" : "AI Features Limited",
      description: consent 
        ? "You now have access to all AI-powered features." 
        : "Some AI-powered features will be limited based on your preference.",
    });
  };

  const requestDataDeletion = async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to request data deletion.",
          variant: "destructive",
        });
        return false;
      }
      
      // Log the data deletion request
      const { error } = await supabase
        .from('ai_audit_logs')
        .insert({
          user_id: user.id,
          action_type: 'DATA_DELETION_REQUEST',
          ai_model: 'all',
          input_summary: 'User requested deletion of all AI training data',
          output_summary: 'Request logged and processed'
        });
        
      if (error) throw error;
      
      toast({
        title: "Data Deletion Requested",
        description: "Your request has been received. All AI training data will be removed within 30 days.",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to request data deletion:", error);
      
      toast({
        title: "Request Failed",
        description: "There was a problem processing your data deletion request.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const contextValue = {
    hasAIConsent,
    setAIConsent,
    aiUsageStats,
    refreshAIStats,
    requestDataDeletion
  };

  return (
    <AIComplianceContext.Provider value={contextValue}>
      {children}
    </AIComplianceContext.Provider>
  );
};

export const useAICompliance = () => {
  const context = useContext(AIComplianceContext);
  
  if (context === undefined) {
    throw new Error("useAICompliance must be used within an AIComplianceProvider");
  }
  
  return context;
};

// Export both the provider and the hook
export { AIComplianceContext };
