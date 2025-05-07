
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Calendar, Clock, User, Gavel, Flag } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { VerdictForm } from "./verdict/VerdictForm";
import { EvidenceDisplay } from "./EvidenceDisplay";
import { SealAnimation } from "./SealAnimation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { ScrollPetition } from "@/types/petition";

export const PetitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [petition, setPetition] = useState<ScrollPetition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [showSealAnimation, setShowSealAnimation] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isJudge } = useAuth();

  useEffect(() => {
    if (id) {
      fetchPetition(id);
    }
  }, [id]);

  const fetchPetition = async (petitionId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("scroll_petitions")
        .select(`
          *,
          petitioner:petitioner_id(username),
          judge:assigned_judge_id(username)
        `)
        .eq("id", petitionId)
        .single();

      if (error) throw error;

      if (data) {
        const timeAgo = formatDistanceToNow(new Date(data.created_at), { addSuffix: true });
        
        // Extract names safely with fallbacks
        const petitionerName = data.petitioner?.username || 'Anonymous Petitioner';
        const judgeName = data.judge?.username || 'Not Assigned';
        
        setPetition({
          ...data,
          timeAgo,
          petitionerName,
          judgeName
        } as unknown as ScrollPetition);
      }
    } catch (err) {
      console.error("Error fetching petition:", err);
      setError("Could not load petition details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToMe = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in as a judge to take this action.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("scroll_petitions")
        .update({
          assigned_judge_id: user.id,
          status: "in_review",
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Petition Assigned",
        description: "This petition has been assigned to you for review.",
      });

      // Update local state
      if (petition) {
        setPetition({
          ...petition,
          assigned_judge_id: user.id,
          status: "in_review",
        });
      }

      // Refresh petition data
      fetchPetition(id!);
    } catch (err) {
      console.error("Error assigning petition:", err);
      toast({
        title: "Assignment Failed",
        description: "Could not assign petition. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <PetitionDetailSkeleton />;
  }

  if (error || !petition) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "Petition not found"}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {showSealAnimation && (
        <SealAnimation
          onComplete={() => {
            setShowSealAnimation(false);
            navigate("/sealed-scrolls");
          }}
        />
      )}

      <Card className="border-justice-secondary bg-black/40">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl text-justice-primary mb-2">
                {petition.title}
              </CardTitle>
              <div className="flex flex-wrap gap-2 items-center text-sm text-justice-light/70">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>Petitioner: {petition.petitionerName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(petition.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{petition.timeAgo}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={petition.status} />
              <IntegrityScoreBadge score={petition.scroll_integrity_score} />
            </div>
          </div>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pb-2">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              {(isJudge || user?.id === petition.assigned_judge_id) && (
                <TabsTrigger value="verdict">Verdict</TabsTrigger>
              )}
            </TabsList>
          </div>

          <CardContent>
            <TabsContent value="details" className="space-y-4 mt-2">
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-medium text-justice-light">Description</h3>
                <div className="whitespace-pre-line">{petition.description}</div>
              </div>

              {petition.status === "pending" && isJudge && !petition.assigned_judge_id && (
                <div className="mt-6">
                  <Button onClick={handleAssignToMe}>
                    <Gavel className="mr-2 h-4 w-4" />
                    Assign to Me
                  </Button>
                </div>
              )}

              {petition.status === "verdict_delivered" && (
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-justice-light">Verdict</h3>
                    <Badge variant={petition.verdict === "approved" ? "success" : "destructive"} className="text-lg">
                      {petition.verdict === "approved" ? "Approved" : "Rejected"}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-justice-light">Reasoning</h3>
                    <div className="p-4 bg-black/20 rounded-md whitespace-pre-line">
                      {petition.verdict_reasoning || "No reasoning provided."}
                    </div>
                  </div>
                </div>
              )}

              {petition.judgeName && petition.judgeName !== 'Not Assigned' && (
                <div className="flex items-center mt-4">
                  <Gavel className="h-4 w-4 mr-1" />
                  <span className="text-sm text-justice-light/70">
                    Assigned Judge: {petition.judgeName}
                  </span>
                </div>
              )}
            </TabsContent>

            <TabsContent value="evidence" className="mt-2">
              <EvidenceDisplay petitionId={petition.id} />
            </TabsContent>

            <TabsContent value="verdict" className="mt-2">
              {(isJudge || user?.id === petition.assigned_judge_id) && petition.status !== "verdict_delivered" ? (
                <VerdictForm
                  petition={petition}
                  onVerdictSubmitted={() => {
                    fetchPetition(id!);
                    setActiveTab("details");
                  }}
                  onScrollSealed={() => setShowSealAnimation(true)}
                />
              ) : (
                <Alert>
                  <AlertTitle>Restricted Access</AlertTitle>
                  <AlertDescription>
                    Only the assigned judge can deliver a verdict for this petition.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  let variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | null
    | undefined = "outline";
  
  switch (status) {
    case "pending":
      variant = "secondary";
      break;
    case "in_review":
      variant = "default";
      break;
    case "verdict_delivered":
      variant = "default";
      break;
    case "sealed":
      variant = "outline";
      break;
    case "rejected":
      variant = "destructive";
      break;
  }
  
  return (
    <Badge variant={variant}>
      {status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
    </Badge>
  );
};

const IntegrityScoreBadge = ({ score }: { score: number }) => {
  let variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | null
    | undefined = "outline";
  
  if (score >= 80) {
    variant = "default";
  } else if (score >= 60) {
    variant = "secondary";
  } else {
    variant = "destructive";
  }
  
  return (
    <Badge variant={variant} className="flex items-center">
      <Flag className="h-3 w-3 mr-1" />
      Integrity: {score}
    </Badge>
  );
};

const PetitionDetailSkeleton = () => (
  <Card className="border-justice-secondary bg-black/40">
    <CardHeader>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-2/3 mb-2" />
          <div className="flex flex-wrap gap-2 items-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    </CardHeader>
    <div className="px-6 pb-2">
      <Skeleton className="h-10 w-full" />
    </div>
    <CardContent>
      <div className="space-y-4 mt-2">
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </CardContent>
  </Card>
);
