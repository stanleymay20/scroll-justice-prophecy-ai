
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlusCircle, FileText, AlertCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadEvidence, deleteEvidence } from "@/services/evidenceService";
import { useAuth } from "@/contexts/AuthContext";

interface EvidenceUploaderProps {
  petitionId: string;
  onEvidenceUploaded?: () => void;
  existingEvidence?: Array<{
    id: string;
    file_path: string;
    file_type: string;
    description: string;
  }>;
}

export const EvidenceUploader = ({ 
  petitionId, 
  onEvidenceUploaded,
  existingEvidence = []
}: EvidenceUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to upload evidence.",
        variant: "destructive"
      });
      return;
    }
    
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError(null);
    
    try {
      const file = files[0];
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds the 10MB limit");
        return;
      }
      
      // Upload the evidence with the userId
      const result = await uploadEvidence(petitionId, file, user.id);
      
      if (result.success) {
        toast({
          title: "Evidence Uploaded",
          description: "Your evidence has been securely added to the scroll.",
        });
        if (onEvidenceUploaded) {
          onEvidenceUploaded();
        }
      } else {
        setError(result.error || "Failed to upload evidence");
      }
    } catch (err) {
      console.error("Error uploading evidence:", err);
      setError("An unexpected error occurred");
    } finally {
      setUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };
  
  const handleDelete = async (evidenceId: string) => {
    if (!user) return;
    
    if (confirm("Are you sure you want to remove this evidence? This action cannot be undone.")) {
      try {
        const success = await deleteEvidence(evidenceId);
        
        if (success) {
          toast({
            title: "Evidence Removed",
            description: "The evidence has been deleted from the scroll.",
          });
          if (onEvidenceUploaded) {
            onEvidenceUploaded();
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to remove evidence.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error("Error deleting evidence:", err);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Evidence</h3>
        <div>
          <Button 
            variant="outline" 
            size="sm"
            disabled={uploading}
            className="relative"
            onClick={() => document.getElementById('evidence-upload')?.click()}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Evidence
            <input
              id="evidence-upload"
              type="file"
              className="sr-only"
              onChange={handleUpload}
              accept="image/png,image/jpeg,application/pdf,audio/mpeg,video/mp4"
            />
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {uploading && <p className="text-sm text-justice-light/70">Uploading evidence...</p>}
      
      {existingEvidence.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {existingEvidence.map((evidence) => (
            <div 
              key={evidence.id} 
              className="flex items-center justify-between p-2 bg-black/30 border border-justice-tertiary/30 rounded"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-justice-light mr-2" />
                <div className="text-sm text-justice-light truncate max-w-[200px]">
                  {evidence.description}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(evidence.file_path, '_blank')}
                >
                  View
                </Button>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(evidence.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-justice-light/70">No evidence attached to this scroll yet.</p>
      )}
    </div>
  );
};
