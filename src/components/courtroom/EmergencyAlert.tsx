
import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { EmergencyAlert as EmergencyAlertType } from '@/types/database';

interface EmergencyAlertProps {
  sessionId: string;
  onClose?: () => void;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ sessionId, onClose }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      // Create the emergency alert
      const alertData: Partial<EmergencyAlertType> = {
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
      
      // Log the action in witness logs
      const logData = {
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
        .eq('id', sessionId as any)
        .single();
      
      const currentScore = sessionData?.flame_integrity_score || 100;
      const newScore = Math.max(0, currentScore - 25);
      
      await supabase
        .from('court_sessions')
        .update({ flame_integrity_score: newScore })
        .eq('id', sessionId as any);
      
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
  
  return (
    <Card className="bg-red-50 border-red-300 p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center text-red-600">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Emergency Alert</h3>
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Describe the emergency situation..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px] bg-white border-red-200"
          required
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            variant="destructive"
            disabled={isSubmitting || !message.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? 'Submitting...' : 'Send Emergency Alert'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
