
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { CourtRole, WitnessSummon } from "@/types/courtroom";

interface UseWitnessSummonProps {
  sessionId: string;
  userId: string;
}

export function useWitnessSummon({ sessionId, userId }: UseWitnessSummonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  
  const sendInvite = async (email: string, role: CourtRole) => {
    if (!email || !role) return null;
    
    setIsSubmitting(true);
    try {
      // Generate unique token for the invite
      const token = uuidv4();
      
      // Calculate expiry (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      // Create witness summon record
      const summonData: Partial<WitnessSummon> = {
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
        .insert([summonData])
        .select();
        
      if (error) throw error;
      
      // Create invite link
      const siteUrl = import.meta.env.VITE_SITE_URL || 'https://lovable.dev/projects/f7d71f55-ae04-491e-87d0-df4a10e1f669/preview';
      const link = `${siteUrl}/witness-invitation?token=${token}`;
      setInviteLink(link);
      
      // Log in ScrollWitness logs
      await supabase
        .from('scroll_witness_logs')
        .insert([{
          session_id: sessionId,
          user_id: userId,
          action: 'witness_summoned',
          details: `Summoned ${email} as ${role}`,
          timestamp: new Date().toISOString()
        }]);
        
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
      
      return link;
    } catch (error) {
      console.error("Error creating witness summon:", error);
      toast({
        title: "Invitation Failed",
        description: "Could not create witness summon. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    inviteLink,
    setInviteLink,
    sendInvite
  };
}
