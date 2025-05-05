
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, X, Send } from 'lucide-react';

interface EmergencyAlertFormProps {
  onSubmit: (message: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function EmergencyAlertForm({ onSubmit, onCancel, isSubmitting }: EmergencyAlertFormProps) {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-black/30 border border-red-500/50 p-3 rounded-md">
      <div className="flex items-center gap-2 mb-3 text-red-400">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="font-medium">Emergency Alert</h3>
      </div>
      
      <Textarea
        placeholder="Describe your emergency situation..."
        className="mb-3"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
      />
      
      <div className="flex justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
        
        <Button
          type="submit"
          variant="destructive"
          size="sm"
          disabled={isSubmitting || !message.trim()}
        >
          {isSubmitting ? 'Sending...' : (
            <>
              <Send className="h-4 w-4 mr-1" /> Send Alert
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
