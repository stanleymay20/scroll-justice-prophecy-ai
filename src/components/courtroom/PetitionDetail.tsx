
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { ScrollPetition } from '@/types/petition';
import { fetchPetitionById, getAiSuggestedVerdict, deliverVerdict, sealPetition } from '@/services/petitionService';
import { getUserRole } from '@/services/userService';
import { PulseEffect } from '@/components/advanced-ui/PulseEffect';
import { Loader2, ChevronLeft, Shield, Gavel, AlertTriangle, User, CalendarClock } from 'lucide-react';
import { format } from 'date-fns';
import { SacredOathScreen } from '@/components/courtroom/SacredOathScreen';
import { SealAnimation } from './SealAnimation';

export function PetitionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [petition, setPetition] = useState<ScrollPetition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState('guest');
  const [showOathScreen, setShowOathScreen] = useState(false);
  
  // Verdict state
  const [isReviewing, setIsReviewing] = useState(false);
  const [verdictText, setVerdictText] = useState('');
  const [verdictReasoning, setVerdictReasoning] = useState('');
  const [isSubmittingVerdict, setIsSubmittingVerdict] = useState(false);
  const [isLoadingAiVerdict, setIsLoadingAiVerdict] = useState(false);
  const [showSealAnimation, setShowSealAnimation] = useState(false);
  
  // Load petition data and user role
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Get user role
        const role = await getUserRole();
        setUserRole(role);
        
        // Fetch petition
        const petitionData = await fetchPetitionById(id);
        setPetition(petitionData);
      } catch (err: any) {
        console.error('Error loading petition:', err);
        setError(err.message || 'Failed to load petition');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);
  
  // Request AI suggested verdict
  const handleRequestAiVerdict = async () => {
    if (!petition) return;
    
    try {
      setIsLoadingAiVerdict(true);
      
      const aiResult = await getAiSuggestedVerdict(
        petition.title,
        petition.description
      );
      
      setVerdictText(aiResult.suggested_verdict || '');
      setVerdictReasoning(aiResult.reasoning || '');
      
      toast({
        title: "AI Verdict Generated",
        description: "The scrolls have suggested a verdict based on ancient wisdom.",
      });
    } catch (err: any) {
      console.error('Error getting AI verdict:', err);
      toast({
        variant: "destructive",
        title: "AI Verdict Failed",
        description: err.message || "Could not generate AI verdict",
      });
    } finally {
      setIsLoadingAiVerdict(false);
    }
  };
  
  // Submit verdict
  const handleDeliverVerdict = async () => {
    if (!petition || !id) return;
    
    try {
      setIsSubmittingVerdict(true);
      
      // Deliver verdict
      const updatedPetition = await deliverVerdict(id, verdictText, verdictReasoning);
      setPetition(updatedPetition);
      
      // Exit review mode
      setIsReviewing(false);
      
      toast({
        title: "Sacred Verdict Delivered",
        description: "The judgment has been recorded in the scrolls.",
      });
    } catch (err: any) {
      console.error('Error delivering verdict:', err);
      toast({
        variant: "destructive",
        title: "Verdict Delivery Failed",
        description: err.message || "Could not record verdict in the scrolls",
      });
    } finally {
      setIsSubmittingVerdict(false);
    }
  };
  
  // Handle sealing the petition
  const handleSealPetition = async () => {
    if (!petition || !id) return;
    
    try {
      setShowSealAnimation(true);
      
      // After animation delay, seal the petition
      setTimeout(async () => {
        const updatedPetition = await sealPetition(id);
        setPetition(updatedPetition);
        
        toast({
          title: "Sacred Verdict Sealed",
          description: "The scroll has been sealed with the final judgment.",
        });
        
        // Turn off animation after completion
        setTimeout(() => {
          setShowSealAnimation(false);
        }, 2000);
      }, 2000);
    } catch (err: any) {
      console.error('Error sealing petition:', err);
      setShowSealAnimation(false);
      toast({
        variant: "destructive",
        title: "Sealing Failed",
        description: err.message || "Could not seal the scroll",
      });
    }
  };
  
  // Start review process
  const handleStartReview = () => {
    setShowOathScreen(true);
  };
  
  // After oath is accepted
  const handleOathAccepted = () => {
    setShowOathScreen(false);
    setIsReviewing(true);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPpp');
  };
  
  // Check if user is allowed to review
  const canReview = ['judge', 'admin'].includes(userRole);
  
  // Check if user is the petitioner
  const isPetitioner = petition && petition.petitioner_id === id;
  
  if (showOathScreen) {
    return <SacredOathScreen onOathAccepted={handleOathAccepted} onCancel={() => setShowOathScreen(false)} />;
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-justice-primary" />
        <span className="ml-2 text-justice-light">Consulting the sacred scrolls...</span>
      </div>
    );
  }
  
  if (error || !petition) {
    return (
      <div className="bg-destructive/20 border border-destructive/50 rounded-md p-6 text-white">
        <h3 className="text-xl font-semibold mb-2 flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2" />
          Error Loading Petition
        </h3>
        <p>{error || "Petition not found in the sacred scrolls."}</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
          <ChevronLeft className="h-4 w-4 mr-1" /> Return to Courtroom
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full relative">
      {showSealAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
          <SealAnimation />
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mb-4"
        onClick={() => navigate('/courtroom')}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Courtroom
      </Button>
      
      <GlassCard className={`p-6 ${petition.is_sealed ? 'border-purple-500/50' : ''}`}>
        <div className="mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{petition.title}</h2>
              
              <div className="flex flex-wrap gap-3 items-center text-sm text-justice-light/70 mb-2">
                <div className="flex items-center">
                  <CalendarClock className="h-4 w-4 mr-1" />
                  Submitted {formatDate(petition.created_at)}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Petitioner #{petition.petitioner_id.substring(0, 8)}
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Integrity: {petition.scroll_integrity_score}
                </div>
              </div>
              
              <div className="flex gap-2 items-center">
                <Badge className={
                  petition.status === 'pending' ? 'bg-amber-500 text-justice-dark' :
                  petition.status === 'in_review' ? 'bg-blue-500 text-justice-dark' :
                  petition.status === 'verdict_delivered' ? 'bg-green-500 text-justice-dark' :
                  petition.status === 'sealed' ? 'bg-purple-500 text-justice-dark' :
                  petition.status === 'rejected' ? 'bg-destructive text-white' :
                  'bg-justice-light/50'
                }>
                  {petition.status === 'pending' ? 'Awaiting Review' :
                   petition.status === 'in_review' ? 'In Review' :
                   petition.status === 'verdict_delivered' ? 'Verdict Delivered' :
                   petition.status === 'sealed' ? 'Sealed' :
                   petition.status === 'rejected' ? 'Rejected' : 'Unknown'}
                </Badge>
                
                {petition.assigned_judge_id && (
                  <div className="text-sm text-justice-light/70 flex items-center">
                    <Gavel className="h-4 w-4 mr-1" />
                    Assigned to Judge #{petition.assigned_judge_id.substring(0, 8)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-4 bg-justice-light/10" />
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Petition Details</h3>
          <div className={`text-justice-light whitespace-pre-wrap ${petition.is_sealed && !canReview ? 'blur-sm select-none' : ''}`}>
            {petition.description}
          </div>
        </div>
        
        {petition.verdict && (
          <>
            <Separator className="my-4 bg-justice-light/10" />
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Gavel className="h-5 w-5 text-justice-primary mr-2" />
                <h3 className="text-lg font-medium text-white">Sacred Verdict</h3>
              </div>
              
              <div className={petition.is_sealed && !canReview ? 'blur-sm select-none' : ''}>
                <div className="p-4 bg-justice-primary/10 border border-justice-primary/30 rounded-md mb-4">
                  <p className="text-white font-medium">{petition.verdict}</p>
                </div>
                
                {petition.verdict_reasoning && (
                  <div>
                    <h4 className="text-base font-medium text-white mb-2">Reasoning</h4>
                    <p className="text-justice-light whitespace-pre-wrap">{petition.verdict_reasoning}</p>
                  </div>
                )}
                
                {petition.verdict_timestamp && (
                  <div className="mt-3 text-sm text-justice-light/70 flex items-center">
                    <CalendarClock className="h-4 w-4 mr-1" />
                    Verdict delivered {formatDate(petition.verdict_timestamp)}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        <div className="mt-6 flex flex-wrap gap-3">
          {/* Review actions - only for judges/admins */}
          {canReview && !petition.verdict && !isReviewing && (
            <div className="relative">
              <Button 
                onClick={handleStartReview}
                className="bg-justice-tertiary hover:bg-justice-tertiary/80"
              >
                Begin Sacred Review
              </Button>
              <div className="absolute -top-1 -right-1">
                <PulseEffect color="bg-justice-primary" />
              </div>
            </div>
          )}
          
          {/* Sealing action - for judges or petitioners after verdict */}
          {petition.verdict && !petition.is_sealed && (canReview || isPetitioner) && (
            <Button 
              onClick={handleSealPetition}
              variant="outline"
              className="border-purple-500 text-purple-500 hover:bg-purple-500/20"
            >
              Seal Verdict in Scrolls
            </Button>
          )}
          
          {/* Return button */}
          {isReviewing && (
            <Button 
              variant="outline"
              onClick={() => setIsReviewing(false)}
            >
              Cancel Review
            </Button>
          )}
        </div>
      </GlassCard>
      
      {/* Review interface */}
      {isReviewing && (
        <GlassCard className="p-6 mt-6 border-justice-primary/30">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Sacred Review Process</h3>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestAiVerdict}
              disabled={isLoadingAiVerdict}
            >
              {isLoadingAiVerdict && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Request AI Guidance
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-justice-light mb-1">
                Sacred Verdict
              </label>
              <Textarea
                value={verdictText}
                onChange={(e) => setVerdictText(e.target.value)}
                rows={3}
                placeholder="Enter the official verdict..."
                className="resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-justice-light mb-1">
                Verdict Reasoning
              </label>
              <Textarea
                value={verdictReasoning}
                onChange={(e) => setVerdictReasoning(e.target.value)}
                rows={6}
                placeholder="Provide reasoning based on sacred principles..."
              />
            </div>
            
            <Button 
              onClick={handleDeliverVerdict}
              disabled={isSubmittingVerdict || !verdictText.trim()}
              className="bg-justice-tertiary hover:bg-justice-tertiary/80"
            >
              {isSubmittingVerdict && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Deliver Sacred Verdict
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
