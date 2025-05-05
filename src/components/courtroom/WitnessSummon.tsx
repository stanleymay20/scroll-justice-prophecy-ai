
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { CourtRole } from "@/types/courtroom";
import { useWitnessSummon } from "@/hooks/useWitnessSummon";
import { InvitationForm } from "./witness/InvitationForm";
import { InvitationLink } from "./witness/InvitationLink";

interface WitnessSummonProps {
  sessionId: string;
  userId: string;
}

export function WitnessSummon({ sessionId, userId }: WitnessSummonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isSubmitting, inviteLink, setInviteLink, sendInvite } = useWitnessSummon({
    sessionId,
    userId
  });
  
  const handleSendInvite = async (email: string, role: CourtRole) => {
    await sendInvite(email, role);
  };
  
  const handleCloseDialog = () => {
    setIsOpen(false);
    setInviteLink(null);
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
          <InvitationForm 
            onSubmit={handleSendInvite}
            onCancel={handleCloseDialog}
            isSubmitting={isSubmitting}
          />
        ) : (
          <InvitationLink
            inviteLink={inviteLink}
            onClose={handleCloseDialog}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
