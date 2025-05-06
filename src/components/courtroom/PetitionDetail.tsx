
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Clock, Download, MessageSquare, Scale, Shield } from "lucide-react";
import { VerdictForm } from "./VerdictForm";
import { AudioVerdictPlayer } from "./AudioVerdictPlayer";
import { ScrollPetition } from "@/types/petition";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/language";
import { AIDisclosure } from "../compliance/AIDisclosure";

const PetitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [petition, setPetition] = useState<ScrollPetition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJudge, setIsJudge] = useState(false);
  const [isPetitioner, setIsPetitioner] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPetition = async () => {
      setLoading(true);
      try {
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!id) {
          setError("Petition ID is missing");
          setLoading(false);
          return;
        }
        
        // Fetch petition with petitioner and judge details
        const { data, error } = await supabase
          .from('scroll_petitions')
          .select(`
            *,
            petitioner:petitioner_id(id, username),
            judge:assigned_judge_id(id, username)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Add formatted date
          const enhancedData = {
            ...data,
            timeAgo: formatDistanceToNow(new Date(data.created_at), { addSuffix: true }),
            petitionerName: data.petitioner?.username || 'Anonymous Petitioner',
            judgeName: data.judge?.username || 'Unassigned'
          };
          
          setPetition(enhancedData);
          
          // Check if current user is the petitioner or judge
          if (user) {
            setIsPetitioner(user.id === data.petitioner_id);
            setIsJudge(user.id === data.assigned_judge_id);
          }
        } else {
          setError("Petition not found");
        }
      } catch (err) {
        console.error("Error fetching petition:", err);
        setError("Failed to load petition details");
      } finally {
        setLoading(false);
      }
    };

    fetchPetition();
  }, [id, toast]);

  const handleDownloadPetition = () => {
    if (!petition) return;
    
    // Create formatted text content
    const content = `
SACRED SCROLL PETITION
======================

Title: ${petition.title}
Submitted: ${new Date(petition.created_at).toLocaleString()}
Status: ${petition.status?.toUpperCase() || 'PENDING'}
Petitioner: ${petition.petitionerName}
Judge: ${petition.judgeName}

DESCRIPTION
----------
${petition.description}

${petition.verdict ? `
VERDICT
-------
${petition.verdict.toUpperCase()}

REASONING
---------
${petition.verdict_reasoning || 'No reasoning provided'}
` : ''}
    `.trim();
    
    // Create a blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `petition-${petition.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Petition Downloaded",
      description: "Sacred petition has been downloaded as a text file.",
    });
  };

  // Status badge renderer
  const renderStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">Pending</Badge>;
    
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-amber-400 border-amber-400">Pending</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/3 mb-8" />
        <Card className="bg-black/40 border-justice-secondary">
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/petitions')}>Return to Petitions</Button>
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="container py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>This sacred petition does not exist or has been removed.</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/petitions')}>Return to Petitions</Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-justice-primary mb-2">{petition.title}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-justice-light/70 flex items-center">
              <Clock className="inline h-4 w-4 mr-1" /> 
              {petition.timeAgo}
            </span>
            {renderStatusBadge(petition.status)}
            {petition.is_sealed && (
              <Badge variant="outline" className="border-justice-secondary text-justice-secondary">
                <Shield className="h-3.5 w-3.5 mr-1.5" /> Sealed
              </Badge>
            )}
          </div>
        </div>
        
        <Button 
          variant="outline"
          className="flex items-center"
          onClick={handleDownloadPetition}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Petition
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black/40 border-justice-secondary">
            <CardHeader>
              <CardTitle className="flex items-center text-justice-light">
                <MessageSquare className="h-5 w-5 mr-2" /> 
                Petition Details
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{petition.description}</p>
              
              <Separator className="my-6" />
              
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
                <div>
                  <h4 className="text-justice-light/70 mb-1">Petitioner</h4>
                  <p className="font-medium">{petition.petitionerName}</p>
                </div>
                
                <div>
                  <h4 className="text-justice-light/70 mb-1">Assigned Judge</h4>
                  <p className="font-medium">{petition.judgeName}</p>
                </div>
                
                <div>
                  <h4 className="text-justice-light/70 mb-1">Submitted On</h4>
                  <p className="font-medium">{new Date(petition.created_at).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <h4 className="text-justice-light/70 mb-1">Integrity Score</h4>
                  <p className="font-medium" style={{
                    color: getIntegrityColor(petition.scroll_integrity_score || 0)
                  }}>
                    {petition.scroll_integrity_score || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <AIDisclosure compact={true} />
            </CardFooter>
          </Card>
          
          {/* Show verdict if it exists */}
          {petition.verdict && (
            <Card className="bg-black/40 border-justice-secondary">
              <CardHeader className={`border-b border-justice-${petition.verdict === 'approved' ? 'green' : 'red'}/30`}>
                <CardTitle className="flex items-center text-justice-light">
                  <Scale className="h-5 w-5 mr-2" /> 
                  Sacred Verdict: <span className="ml-2 uppercase">{petition.verdict}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none pt-6">
                <p className="whitespace-pre-wrap">{petition.verdict_reasoning}</p>
                
                {/* Audio verdict player if available */}
                <AudioVerdictPlayer petitionId={petition.id} />
              </CardContent>
              <CardFooter className="text-sm text-justice-light/50">
                {petition.verdict_timestamp && (
                  <span>
                    Verdict delivered {formatDistanceToNow(new Date(petition.verdict_timestamp), { addSuffix: true })}
                  </span>
                )}
              </CardFooter>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Show verdict form only for judges with no verdict yet */}
          {isJudge && !petition.verdict && (
            <VerdictForm 
              petitionId={petition.id} 
              onVerdictSubmitted={(newVerdict) => {
                // Update the petition with the new verdict
                setPetition(prev => prev ? {
                  ...prev,
                  verdict: newVerdict.verdict,
                  verdict_reasoning: newVerdict.reasoning,
                  status: newVerdict.verdict,
                  verdict_timestamp: new Date().toISOString()
                } : null);
                
                toast({
                  title: "Verdict Delivered",
                  description: "Your sacred verdict has been recorded in the scrolls."
                });
              }} 
            />
          )}
          
          {/* Status info card */}
          <Card className="bg-black/40 border-justice-secondary">
            <CardHeader>
              <CardTitle className="text-justice-light">Petition Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-justice-light/70">Status:</span>
                  <span>{renderStatusBadge(petition.status)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-justice-light/70">Sealed:</span>
                  <span>{petition.is_sealed ? 'Yes' : 'No'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-justice-light/70">Created:</span>
                  <span>{petition.timeAgo}</span>
                </div>
                
                {petition.verdict_timestamp && (
                  <div className="flex justify-between">
                    <span className="text-justice-light/70">Verdict Date:</span>
                    <span>{new Date(petition.verdict_timestamp).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
            {(isPetitioner || isJudge) && !petition.verdict && (
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/petition/${petition.id}/evidence/upload`)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isPetitioner ? 'Upload Evidence' : 'Review Evidence'}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function for integrity score color
const getIntegrityColor = (score: number) => {
  if (score >= 80) return '#22c55e'; // Green
  if (score >= 50) return '#eab308'; // Yellow
  return '#ef4444'; // Red
};

// Placeholder icon component for Upload
const Upload = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default PetitionDetail;
