
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UserPlus, Copy, CheckCheck } from "lucide-react";
import { CourtRole, WitnessSummon as WitnessSummonType } from "@/types/courtroom";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface WitnessSummonProps {
  sessionId: string;
  userId: string;
}

export function WitnessSummon({ sessionId, userId }: WitnessSummonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CourtRole>("witness");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const handleSendInvite = async () => {
    if (!email || !role) return;
    
    setIsSubmitting(true);
    try {
      // Generate unique token for the invite
      const token = uuidv4();
      
      // Calculate expiry (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      // Create witness summon record
      const summonData: Partial<WitnessSummonType> = {
        session_id: sessionId,
        invited_email: email,
        invited_by: userId,
        invited_at: new Date().toISOString(),
        status: "pending",
        role,
        token,
        expires_at: expiresAt.toISOString()
      };
      
      const { data, error } = await supabase
        .from('witness_summons')
        .insert(summonData)
        .select();
        
      if (error) throw error;
      
      // Create invite link
      const siteUrl = import.meta.env.VITE_SITE_URL || 'https://lovable.dev/projects/f7d71f55-ae04-491e-87d0-df4a10e1f669/preview';
      const link = `${siteUrl}/witness-invitation?token=${token}`;
      setInviteLink(link);
      
      // Log in ScrollWitness logs
      await supabase
        .from('scroll_witness_logs')
        .insert({
          session_id: sessionId,
          user_id: userId,
          action: 'witness_summoned',
          details: `Summoned ${email} as ${role}`,
          timestamp: new Date().toISOString()
        });
        
      // Optional: Send email notification via edge function
      try {
        await supabase.functions.invoke('send-witness-invitation', {
          body: {
            email,
            role,
            sessionId,
            token,
            inviteLink: link
          }
        });
      } catch (emailError) {
        console.error("Failed to send invitation email:", emailError);
      }
    } catch (error) {
      console.error("Error creating witness summon:", error);
      toast({
        title: "Invitation Failed",
        description: "Could not create witness summon. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleCloseDialog = () => {
    setIsOpen(false);
    setEmail("");
    setRole("witness");
    setInviteLink(null);
    setCopied(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-1.5"
        >
          <UserPlus className="h-4 w-4" />
          <span>Summon Witness</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Summon to Sacred Court</DialogTitle>
          <DialogDescription>
            Send an invitation to participate in this court session.
          </DialogDescription>
        </DialogHeader>
        
        {!inviteLink ? (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="witness@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <Select value={role} onValueChange={(value: CourtRole) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Court Roles</SelectLabel>
                      <SelectItem value="witness">Witness</SelectItem>
                      <SelectItem value="advocate">Advocate</SelectItem>
                      <SelectItem value="steward">Steward</SelectItem>
                      <SelectItem value="observer">Observer</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendInvite}
                disabled={!email || !role || isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Summon"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Share this invitation link</label>
                <div className="flex">
                  <Input
                    readOnly
                    value={inviteLink}
                    className="rounded-r-none"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-l-none"
                    onClick={handleCopyLink}
                  >
                    {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  This link expires in 24 hours. An email has also been sent if email notifications are enabled.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleCloseDialog}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
