
import React, { useState, FormEvent } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface EmergencyAlertFormProps {
  onSubmit: (message: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const EmergencyAlertForm: React.FC<EmergencyAlertFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center text-red-600 mb-2">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <h3 className="font-medium">Emergency Alert</h3>
      </div>
      
      <Textarea
        placeholder="Describe the emergency situation..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[100px] bg-white border-red-200"
        required
      />
      
      <div className="flex justify-between">
        <Button 
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
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
  );
};
