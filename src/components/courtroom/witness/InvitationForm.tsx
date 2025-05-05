
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourtRole } from "@/types/courtroom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvitationFormProps {
  onSubmit: (email: string, role: CourtRole) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function InvitationForm({ onSubmit, onCancel, isSubmitting }: InvitationFormProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CourtRole>("witness");
  
  const handleSubmit = () => {
    if (!email || !role) return;
    onSubmit(email, role);
  };
  
  return (
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
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!email || !role || isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Summon"}
        </Button>
      </div>
    </>
  );
}
