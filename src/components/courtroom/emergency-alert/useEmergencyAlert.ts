
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { EmergencyAlert as EmergencyAlertType } from '@/types/database';
import type { AlertSubmissionData } from './types';
import { Database } from '@/integrations/supabase/types';

export function useEmergencyAlert(sessionId: string, onClose?: () => void) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      // Create the emergency alert with proper typing
      const alertData: Database["public"]["Tables"]["emergency_alerts"]["Insert"] = {
        session_id: sessionId,
        user_id: user?.id,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        resolved: false
      };
      
      const { error: alertError } = await supabase
        .from('emergency_alerts')
        .insert(alertData);
      
      if (alertError) throw alertError;
      
      // Log the action in witness logs with proper typing
      const logData: Database["public"]["Tables"]["scroll_witness_logs"]["Insert"] = {
        session_id: sessionId,
        user_id: user?.id,
        action: 'emergency_alert',
        details: message.trim(),
        timestamp: new Date().toISOString()
      };
      
      await supabase.from('scroll_witness_logs').insert(logData);
      
      // Decrease flame integrity score by 25 points
      const { data: sessionData } = await supabase
        .from('court_sessions')
        .select('flame_integrity_score')
        .eq('id', sessionId)
        .single();
      
      const currentScore = sessionData?.flame_integrity_score ?? 100;
      const newScore = Math.max(0, currentScore - 25);
      
      // Update flame integrity score with proper typing
      const updateData: Database["public"]["Tables"]["court_sessions"]["Update"] = { 
        flame_integrity_score: newScore 
      };
      
      await supabase
        .from('court_sessions')
        .update(updateData)
        .eq('id', sessionId);
      
      // Close alert if callback provided
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating emergency alert:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    message,
    setMessage,
    isSubmitting,
    handleSubmit
  };
}
