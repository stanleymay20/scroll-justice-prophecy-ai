
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { toast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Upload } from 'lucide-react';
import { createPetition } from '@/services/petitionQueries';
import { uploadEvidence } from '@/services/evidenceService';
import { analyzeContent } from '@/services/integrityService';
import { ScrollPetition } from '@/types/petition';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface PetitionFormProps {
  onPetitionCreated: (petition: ScrollPetition) => void;
  onCancel: () => void;
}

export function PetitionForm({ onPetitionCreated, onCancel }: PetitionFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [integrityScore, setIntegrityScore] = useState<number | null>(null);
  const [contentWarnings, setContentWarnings] = useState<string[]>([]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    
    // Auto-analyze content when it reaches a certain length
    if (e.target.value.length > 20 && e.target.value.length % 50 === 0) {
      analyzeContentIntegrity(e.target.value);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidence(e.target.files[0]);
    }
  };
  
  const analyzeContentIntegrity = async (text: string) => {
    try {
      setAnalyzing(true);
      const result = await analyzeContent(text);
      setIntegrityScore(result.score);
      setContentWarnings(result.issues || []);
    } catch (err) {
      console.error('Error analyzing content:', err);
    } finally {
      setAnalyzing(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Please complete all required fields.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to submit a petition");
      }
      
      // Final content analysis
      if (description.length > 20) {
        await analyzeContentIntegrity(description);
      }
      
      // Create the petition
      const newPetition: Partial<ScrollPetition> = {
        title,
        description,
        petitioner_id: user.id,
        status: 'pending',
        scroll_integrity_score: integrityScore || 100,
        is_sealed: false,
      };
      
      const createdPetition = await createPetition(newPetition);
      
      // Handle evidence upload if present
      if (evidence && createdPetition.id && user.id) {
        await uploadEvidence(createdPetition.id, evidence, user.id);
      }
      
      toast({
        title: "Sacred Petition Submitted",
        description: "Your petition has been recorded in the scrolls.",
      });
      
      onPetitionCreated(createdPetition);
    } catch (err: any) {
      console.error('Error submitting petition:', err);
      setError(err.message || 'Failed to submit petition. Please try again.');
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "The sacred scrolls could not record your petition.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getIntegrityColor = () => {
    if (!integrityScore) return 'bg-justice-light/30';
    if (integrityScore >= 80) return 'bg-green-500';
    if (integrityScore >= 50) return 'bg-amber-500';
    return 'bg-destructive';
  };
  
  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Submit New Petition to the Scrolls</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Petition Title</Label>
            <Input
              id="title"
              placeholder="Enter the sacred purpose of your petition"
              value={title}
              onChange={handleTitleChange}
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Petition Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your petition in detail for the sacred scrolls..."
              value={description}
              onChange={handleDescriptionChange}
              rows={6}
              className="mt-1"
              required
            />
          </div>
          
          {integrityScore !== null && (
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1">
                <Label>Scroll Integrity Score</Label>
                <span className={`text-sm ${
                  integrityScore >= 80 ? 'text-green-400' : 
                  integrityScore >= 50 ? 'text-amber-400' : 
                  'text-destructive'
                }`}>
                  {integrityScore}/100
                </span>
              </div>
              <Progress value={integrityScore} className={`h-2 ${getIntegrityColor()}`} />
              
              {contentWarnings.length > 0 && (
                <div className="mt-2 text-sm text-amber-400">
                  {contentWarnings.map((warning, idx) => (
                    <div key={idx} className="flex items-start gap-2 mt-1">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div>
            <Label htmlFor="evidence">Supporting Evidence (Optional)</Label>
            <div className="mt-1">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-justice-light/30 border-dashed rounded-md hover:bg-justice-dark/50 cursor-pointer transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 text-justice-light/70 mb-2" />
                  <p className="mb-2 text-sm text-justice-light/70">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-justice-light/50">
                    PDF, PNG, JPG or MP3 (max. 10MB)
                  </p>
                </div>
                <input 
                  id="evidence" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.mp3,.mp4"
                />
              </label>
            </div>
            {evidence && (
              <p className="mt-2 text-sm text-justice-light/70">
                Selected file: {evidence.name}
              </p>
            )}
          </div>
          
          {error && (
            <div className="bg-destructive/20 border border-destructive/50 rounded p-3 text-white">
              {error}
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <Button 
              type="submit" 
              disabled={loading || analyzing}
              className="bg-justice-tertiary hover:bg-justice-tertiary/80"
            >
              {(loading || analyzing) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit Sacred Petition
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </GlassCard>
  );
}
