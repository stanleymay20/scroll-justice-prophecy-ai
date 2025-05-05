
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, CheckCheck } from "lucide-react";

interface InvitationLinkProps {
  inviteLink: string;
  onClose: () => void;
}

export function InvitationLink({ inviteLink, onClose }: InvitationLinkProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
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
      
      <div className="flex justify-end">
        <Button onClick={onClose}>
          Done
        </Button>
      </div>
    </>
  );
}
