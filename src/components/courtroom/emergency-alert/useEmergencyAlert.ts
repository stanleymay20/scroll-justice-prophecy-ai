
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { EmergencyAlertInsert, ScrollWitnessLogInsert } from '@/types/courtroom';

interface UseEmergencyAlertProps {
  sessionId: string;
  userId: string;
}

export function useEmergencyAlert({ sessionId, userId }: UseEmergencyAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmitAlert = async () => {
    if (!alertMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Create emergency alert record
      const alertData: EmergencyAlertInsert = {
        session_id: sessionId,
        user_id: userId,
        message: alertMessage,
        timestamp: new Date().toISOString(),
        resolved: false
      };
      
      const { data, error } = await supabase
        .from('emergency_alerts')
        .insert(alertData)
        .select();
        
      if (error) throw error;
      
      // Log in ScrollWitness logs
      const logData: ScrollWitnessLogInsert = {
        session_id: sessionId,
        user_id: userId,
        action: 'emergency_alert',
        details: 'Emergency alert raised during session',
        timestamp: new Date().toISOString()
      };
      
      await supabase
        .from('scroll_witness_logs')
        .insert(logData);
      
      // Notify MCP Light system about the alert
      await supabase.functions.invoke('mcp-emergency-notification', {
        body: {
          alertId: data[0].id,
          sessionId,
          userId,
          alertType: 'emergency_mercy'
        }
      });
      
      setIsOpen(false);
      setAlertMessage('');
      toast({
        title: 'Emergency Alert Sent',
        description: 'Court stewards have been notified of your concern.',
        variant: 'destructive'
      });
    } catch (error) {
      console.error('Error submitting emergency alert:', error);
      toast({
        title: 'Alert Failed',
        description: 'Could not submit emergency alert. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isOpen,
    setIsOpen,
    alertMessage,
    setAlertMessage,
    isSubmitting,
    handleSubmitAlert
  };
}
