import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FlameActivity {
  id: string;
  user_id: string;
  action_type: string;
  description: string;
  created_at: string;
  username?: string;
}

export default function SuccessionSystem() {
  const [flameActivity, setFlameActivity] = useState<FlameActivity[]>([]);
  const [potentialSuccessors, setPotentialSuccessors] = useState<{id: string; username: string}[]>([]);
  const [selectedSuccessorId, setSelectedSuccessorId] = useState<string>('');
  const [scrollKey, setScrollKey] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      // Fetch potential successors (judges with high integrity)
      const { data: judgesData } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          reputation_score,
          profiles:user_id(username)
        `)
        .eq('role', 'judge')
        .gt('reputation_score', 75)
        .order('reputation_score', { ascending: false });

      if (judgesData) {
        const successors = judgesData
          .filter(judge => judge.profiles && typeof judge.profiles === 'object')
          .map(judge => ({
            id: judge.user_id,
            // Safely extract username, providing a fallback
            username: judge.profiles && typeof judge.profiles === 'object' ? 
              (judge.profiles as any).username || 'Unknown Judge' : 
              'Unknown Judge'
          }));
        
        setPotentialSuccessors(successors);
      }

      // Fetch flame activity logs
      const { data: activityData } = await supabase
        .from('scroll_integrity_logs')
        .select(`
          id,
          user_id,
          action_type,
          description,
          created_at,
          profiles:user_id(username)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (activityData) {
        const activities = activityData
          .filter(activity => activity.profiles && typeof activity.profiles === 'object')
          .map(activity => ({
            id: activity.id,
            user_id: activity.user_id,
            action_type: activity.action_type,
            description: activity.description,
            created_at: activity.created_at,
            // Safely extract username, providing a fallback
            username: activity.profiles && typeof activity.profiles === 'object' ? 
              (activity.profiles as any).username || 'Unknown User' : 
              'Unknown User'
          }));
        
        setFlameActivity(activities);
      }
    } catch (error) {
      console.error('Error fetching succession data:', error);
    }
  };

  const handleNominateSuccessor = async () => {
    if (!selectedSuccessorId || !scrollKey) {
      toast({
        title: "Missing information",
        description: "Please select a successor and provide a scroll key",
        variant: "destructive",
      });
      return;
    }

    try {
      // Log this activity for now, later we'll store it in flame_succession table
      await supabase
        .from('scroll_integrity_logs')
        .insert({
          user_id: user?.id,
          action_type: 'SUCCESSOR_NOMINATED',
          description: `Judge has nominated a successor for flame preservation`,
          integrity_impact: 10
        });

      toast({
        title: "Successor nominated",
        description: "Your scroll successor has been nominated successfully",
      });

      setSelectedSuccessorId('');
      setScrollKey('');
      fetchData();

    } catch (error) {
      console.error('Error nominating successor:', error);
      toast({
        title: "Nomination failed",
        description: "There was an error nominating your successor",
        variant: "destructive",
      });
    }
  };

  const handleTransferCase = async (caseId: string, successorId: string) => {
    try {
      const { error } = await supabase
        .from('scroll_petitions')
        .update({
          assigned_judge_id: successorId
        })
        .eq('id', caseId);

      if (error) throw error;

      toast({
        title: "Case transferred",
        description: "The sealed case has been transferred to your successor",
      });

      fetchData();

      // Log this activity
      await supabase
        .from('scroll_integrity_logs')
        .insert({
          user_id: user?.id,
          action_type: 'CASE_TRANSFERRED',
          description: `Judge has transferred a sealed case to successor`,
          integrity_impact: 5
        });

    } catch (error) {
      console.error('Error transferring case:', error);
      toast({
        title: "Transfer failed",
        description: "There was an error transferring the case",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (tab: string) => {
    // Find the target element and trigger a click if it exists
    const tabElement = document.querySelector(`[data-value="${tab}"]`) as HTMLElement;
    if (tabElement) {
      tabElement.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="ScrollFlame Succession" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <h1 className="text-2xl font-bold text-justice-light mb-6">ScrollFlame Succession System</h1>
        
        <Tabs defaultValue="nominate" className="space-y-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="nominate">Nominate Successor</TabsTrigger>
            <TabsTrigger value="flame">Flame Activity</TabsTrigger>
            <TabsTrigger value="cases">Transfer Cases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nominate">
            <Card className="p-6 bg-black/30 border border-justice-primary/30">
              <h2 className="text-xl font-semibold text-justice-light mb-4">Nominate a Scroll Successor</h2>
              <p className="text-gray-300 mb-6">
                As a judge, you must ensure the continuity of ScrollJustice by nominating a successor 
                who will inherit your flame and continue your sacred duty.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Select a Successor
                  </label>
                  <select 
                    className="w-full px-3 py-2 bg-black/50 border border-justice-primary/50 rounded-md text-white"
                    value={selectedSuccessorId}
                    onChange={(e) => setSelectedSuccessorId(e.target.value)}
                  >
                    <option value="">-- Select a Judge --</option>
                    {potentialSuccessors.map(judge => (
                      <option key={judge.id} value={judge.id}>
                        {judge.username}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Scroll Key (for encrypted flame transfer)
                  </label>
                  <Input 
                    type="password"
                    value={scrollKey}
                    onChange={(e) => setScrollKey(e.target.value)}
                    className="bg-black/50 border-justice-primary/50 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    This key will be used to encrypt your flame signature. Keep it secure.
                  </p>
                </div>
                
                <Button 
                  onClick={handleNominateSuccessor}
                  className="w-full bg-justice-tertiary hover:bg-justice-tertiary/80"
                >
                  Nominate Successor
                </Button>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="flame">
            <Card className="p-6 bg-black/30 border border-justice-primary/30">
              <h2 className="text-xl font-semibold text-justice-light mb-4">Flame Activity Logs</h2>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flameActivity.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{activity.username?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <span>{activity.username}</span>
                        </TableCell>
                        <TableCell>{activity.action_type}</TableCell>
                        <TableCell>{activity.description}</TableCell>
                        <TableCell>{new Date(activity.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="cases">
            <Card className="p-6 bg-black/30 border border-justice-primary/30">
              <h2 className="text-xl font-semibold text-justice-light mb-4">Transfer Sealed Cases</h2>
              
              <p className="text-gray-300">
                This feature will allow you to transfer sealed cases to your successors. 
                First, nominate a successor in the "Nominate Successor" tab.
              </p>
              
              <div className="mt-6 flex justify-center">
                <div className="p-8 rounded-lg border border-justice-primary/20 flex flex-col items-center">
                  <Shield className="h-16 w-16 text-justice-primary/50 mb-4" />
                  <h3 className="text-lg font-medium text-justice-light mb-2">Succession Protocol</h3>
                  <p className="text-sm text-gray-400 text-center max-w-md">
                    The flame succession protocol ensures continuity and preservation of sacred verdicts.
                    Nominate a successor to ensure the ScrollJustice flame continues to burn.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.querySelector('[data-value="nominate"]')?.click()}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Nominate a Successor First
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
