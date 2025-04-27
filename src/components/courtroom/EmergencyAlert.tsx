
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface EmergencyAlertProps {
  sessionId: string;
  userId: string;
}

export function EmergencyAlert({ sessionId, userId }: EmergencyAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmitAlert = async () => {
    if (!alertMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Create emergency alert record
      const { data, error } = await supabase
        .from('emergency_alerts')
        .insert({
          session_id: sessionId,
          user_id: userId,
          message: alertMessage,
          timestamp: new Date().toISOString(),
          resolved: false
        })
        .select();
        
      if (error) throw error;
      
      // Log in ScrollWitness logs
      await supabase
        .from('scroll_witness_logs')
        .insert({
          session_id: sessionId,
          user_id: userId,
          action: 'emergency_alert',
          details: 'Emergency alert raised during session',
          timestamp: new Date().toISOString()
        });
      
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
      setAlertMessage("");
      toast({
        title: "Emergency Alert Sent",
        description: "Court stewards have been notified of your concern.",
        variant: "destructive"
      });
    } catch (error) {
      console.error("Error submitting emergency alert:", error);
      toast({
        title: "Alert Failed",
        description: "Could not submit emergency alert. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm"
          className="gap-1.5"
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Emergency Alert</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Emergency Whisper Alert
          </DialogTitle>
          <DialogDescription>
            This will alert court stewards to an urgent issue. Use this for serious violations of sacred justice principles only.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Describe the emergency situation or justice violation..."
            className="min-h-[100px]"
            value={alertMessage}
            onChange={(e) => setAlertMessage(e.target.value)}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleSubmitAlert}
            disabled={!alertMessage.trim() || isSubmitting}
          >
            {isSubmitting ? "Sending Alert..." : "Send Emergency Alert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
