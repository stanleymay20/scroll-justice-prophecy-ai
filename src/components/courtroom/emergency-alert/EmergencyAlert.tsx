
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useEmergencyAlert } from './useEmergencyAlert';
import { EmergencyAlertForm } from './EmergencyAlertForm';
import { Bell, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { EmergencyAlertProps } from './types';

export function EmergencyAlert({ sessionId }: EmergencyAlertProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  
  // Make sure we have a userId from the authenticated user
  const userId = user?.id || '';
  
  const {
    isSubmitting,
    hasActiveAlert,
    submitAlert,
    checkActiveAlerts
  } = useEmergencyAlert(sessionId, userId);
  
  useEffect(() => {
    if (userId) {
      checkActiveAlerts();
    }
  }, [sessionId, userId]);
  
  const handleOpenEmergencyForm = () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to send emergency alerts",
        variant: "destructive",
      });
      return;
    }
    setShowForm(true);
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
  };
  
  const handleSubmitAlert = (message: string) => {
    submitAlert(message);
    setShowForm(false);
  };
  
  return (
    <div className="relative">
      {!showForm ? (
        <Button
          variant={hasActiveAlert ? "destructive" : "outline"}
          size="sm"
          className={`flex items-center ${hasActiveAlert ? 'animate-pulse' : ''}`}
          onClick={handleOpenEmergencyForm}
          disabled={!userId}
        >
          {hasActiveAlert ? (
            <>
              <AlertCircle className="h-4 w-4 mr-2" />
              Alert Active
            </>
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Emergency Alert
            </>
          )}
        </Button>
      ) : (
        <EmergencyAlertForm 
          onSubmit={handleSubmitAlert}
          onCancel={handleCloseForm}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
