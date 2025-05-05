
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmergencyAlertForm } from './EmergencyAlertForm';
import { useEmergencyAlert } from './useEmergencyAlert';
import type { EmergencyAlertProps } from './types';

export const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ 
  sessionId, 
  onClose 
}) => {
  const [message, setMessage] = useState('');
  const {
    isSubmitting,
    submitAlert
  } = useEmergencyAlert(sessionId, ''); // We'll need to get the userId from auth context in a real app
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitAlert(message);
    setMessage('');
  };
  
  return (
    <Card className="bg-red-50 border-red-300 p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1" />
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
      
      <EmergencyAlertForm
        message={message}
        onMessageChange={setMessage}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};
