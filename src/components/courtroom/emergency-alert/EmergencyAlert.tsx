
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { EmergencyAlertForm } from "./EmergencyAlertForm";
import { useEmergencyAlert } from "./useEmergencyAlert";
import { EmergencyAlertProps } from "./types";

export function EmergencyAlert({ sessionId, userId }: EmergencyAlertProps) {
  const [showForm, setShowForm] = useState(false);
  const { isSubmitting, hasActiveAlert, submitAlert, checkActiveAlerts } = useEmergencyAlert(sessionId, userId);
  
  // Check if the user already has an active alert when the component mounts
  useEffect(() => {
    checkActiveAlerts();
  }, []);
  
  const handleSubmit = async (message: string) => {
    await submitAlert(message);
    setShowForm(false);
  };
  
  if (hasActiveAlert) {
    return (
      <div className="p-2 bg-red-600/20 border border-red-500 rounded-md flex items-center justify-center">
        <AlertCircle className="text-red-500 mr-2 h-5 w-5" />
        <span className="text-red-100 text-sm">Emergency alert has been sent</span>
      </div>
    );
  }
  
  if (showForm) {
    return <EmergencyAlertForm 
      onSubmit={handleSubmit}
      onCancel={() => setShowForm(false)}
      isSubmitting={isSubmitting}
    />;
  }
  
  return (
    <Button 
      variant="destructive" 
      size="sm"
      className="w-full"
      onClick={() => setShowForm(true)}
    >
      <AlertCircle className="h-4 w-4 mr-2" />
      Emergency Alert
    </Button>
  );
}
