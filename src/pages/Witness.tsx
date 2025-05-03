
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { NavBar } from '@/components/layout/NavBar';
import { MetaTags } from '@/components/MetaTags';
import { toast } from '@/hooks/use-toast';
import { ScrollPetition } from '@/types/petition';
import { fetchPetitionById } from '@/services/petitionService';
import { AudioVerdictPlayer } from '@/components/courtroom/AudioVerdictPlayer';
import { EvidenceDisplay } from '@/components/courtroom/EvidenceDisplay';
import { ChevronLeft, Shield, Gavel, AlertTriangle, User, CalendarClock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/language';

export default function Witness() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [petition, setPetition] = useState<ScrollPetition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch petition
        const petitionData = await fetchPetitionById(id);
        setPetition(petitionData);
        
        // Check if petition is sealed
        if (!petitionData.is_sealed) {
          setError('This petition has not yet been sealed with a verdict.');
        }
      } catch (err: any) {
        console.error('Error loading petition:', err);
        setError(err.message || 'Failed to load petition');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPpp');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
        <NavBar />
        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-justice-primary rounded-full"></div>
              <div className="h-2 w-2 bg-justice-primary rounded-full"></div>
              <div className="h-2 w-2 bg-justice-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !petition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
        <NavBar />
        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className="bg-destructive/20 border border-destructive/50 rounded-md p-6 text-white">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              Error Loading Sealed Verdict
            </h3>
            <p>{error || "Petition not found in the sacred scrolls."}</p>
            <Button onClick={() => navigate('/courtroom')} variant="outline" className="mt-4">
              <ChevronLeft className="h-4 w-4 mr-1" /> Return to Courtroom
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="Scroll Witness Record" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-4"
          onClick={() => navigate('/courtroom')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Courtroom
        </Button>
        
        <GlassCard className="p-6 border-purple-500/50">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div>
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <Badge className="bg-purple-500 text-justice-dark">
                  Sealed Verdict
                </Badge>
                
                {petition.assigned_judge_id && (
                  <div className="text-sm text-justice-light/70 flex items-center">
                    <Gavel className="h-4 w-4 mr-1" />
                    Judge #{petition.assigned_judge_id.substring(0, 8)}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="text-sm text-justice-light/70">
                    Integrity: {petition.scroll_integrity_score}
                  </span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                {petition.title}
              </h2>
              
              <div className="flex flex-wrap gap-3 items-center text-sm text-justice-light/70 mb-2">
                <div className="flex items-center">
                  <CalendarClock className="h-4 w-4 mr-1" />
                  Submitted {formatDate(petition.created_at)}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Petitioner #{petition.petitioner_id.substring(0, 8)}
                </div>
                {petition.verdict_timestamp && (
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Sealed {formatDate(petition.verdict_timestamp)}
                  </div>
                )}
              </div>
            </div>
            
            {petition.flame_signature_hash && (
              <div className="px-4 py-2 bg-justice-primary/10 border border-justice-primary/30 rounded text-xs font-mono text-justice-light/70 break-all">
                {petition.flame_signature_hash}
              </div>
            )}
          </div>
          
          <Separator className="my-4 bg-justice-light/10" />
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Petition Details</h3>
            <div className="text-justice-light whitespace-pre-wrap">
              {petition.description}
            </div>
          </div>
          
          {petition.audio_verdict_url && (
            <>
              <Separator className="my-4 bg-justice-light/10" />
              
              <AudioVerdictPlayer 
                audioUrl={petition.audio_verdict_url}
                transcript={petition.verdict_transcription || undefined}
              />
            </>
          )}
          
          <Separator className="my-4 bg-justice-light/10" />
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Evidence</h3>
            {id && <EvidenceDisplay 
              petitionId={id} 
              isSealed={true} 
              canView={true}
              readOnly={true}
            />}
          </div>
          
          {petition.verdict && (
            <>
              <Separator className="my-4 bg-justice-light/10" />
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Gavel className="h-5 w-5 text-justice-primary mr-2" />
                  <h3 className="text-lg font-medium text-white">Sacred Verdict</h3>
                </div>
                
                <div>
                  <div className="p-4 bg-justice-primary/10 border border-justice-primary/30 rounded-md mb-4">
                    <p className="text-white font-medium">{petition.verdict}</p>
                  </div>
                  
                  {petition.verdict_reasoning && (
                    <div>
                      <h4 className="text-base font-medium text-white mb-2">Reasoning</h4>
                      <p className="text-justice-light whitespace-pre-wrap">{petition.verdict_reasoning}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
