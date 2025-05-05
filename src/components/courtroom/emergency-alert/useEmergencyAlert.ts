
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { EmergencyAlertInsert } from "@/types/supabaseHelpers";

export function useEmergencyAlert(sessionId: string, userId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasActiveAlert, setHasActiveAlert] = useState(false);
  
  // Function to submit a new emergency alert
  const submitAlert = async (message: string) => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please provide a message for the emergency alert",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create properly typed alert data
      const alertData: EmergencyAlertInsert = {
        session_id: sessionId,
        user_id: userId,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        resolved: false
      };
      
      // Insert using the correct type and syntax
      const { error } = await supabase
        .from('emergency_alerts')
        .insert(alertData);
      
      if (error) throw error;
      
      toast({
        title: "Emergency Alert Sent",
        description: "Your alert has been submitted to the court officials",
      });
      
      setHasActiveAlert(true);
    } catch (err) {
      console.error("Error submitting emergency alert:", err);
      toast({
        title: "Error",
        description: "Failed to submit emergency alert",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to check if the user has any active (unresolved) alerts
  const checkActiveAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_alerts')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .eq('resolved', false)
        .limit(1);
      
      if (error) throw error;
      
      setHasActiveAlert(data && data.length > 0);
      return data && data.length > 0;
    } catch (err) {
      console.error("Error checking active alerts:", err);
      return false;
    }
  };
  
  return {
    isSubmitting,
    hasActiveAlert,
    submitAlert,
    checkActiveAlerts
  };
}
