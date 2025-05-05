
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
import { User, Shield, Activity, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FlameActivity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  created_at: string;
  username?: string;
}

interface SuccessionNomination {
  id: string;
  judge_id: string;
  successor_id: string;
  scroll_key: string;
  last_active: string;
  judge_username?: string;
  successor_username?: string;
}

interface SealedCase {
  id: string;
  title: string;
  petitioner_id: string;
  status: string;
  assigned_judge_id: string;
  is_sealed: boolean;
  created_at: string;
}

export default function SuccessionSystem() {
  const [flameActivity, setFlameActivity] = useState<FlameActivity[]>([]);
  const [nominations, setNominations] = useState<SuccessionNomination[]>([]);
  const [sealedCases, setSealedCases] = useState<SealedCase[]>([]);
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
        setPotentialSuccessors(
          judgesData.map(judge => ({
            id: judge.user_id,
            username: judge.profiles.username
          }))
        );
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
        setFlameActivity(
          activityData.map(activity => ({
            ...activity,
            username: activity.profiles?.username || 'Unknown User'
          }))
        );
      }

      // Fetch succession nominations
      const { data: nominationsData } = await supabase
        .from('flame_succession')
        .select(`
          id,
          judge_id,
          successor_id,
          scroll_key,
          last_active,
          judge:judge_id(username:profiles(username)),
          successor:successor_id(username:profiles(username))
        `);

      if (nominationsData) {
        setNominations(
          nominationsData.map(nom => ({
            ...nom,
            judge_username: nom.judge?.username || 'Unknown Judge',
            successor_username: nom.successor?.username || 'Unknown Successor'
          }))
        );
      }

      // Fetch sealed cases assigned to current user
      const { data: casesData } = await supabase
        .from('scroll_petitions')
        .select('*')
        .eq('assigned_judge_id', user?.id)
        .eq('is_sealed', true)
        .order('created_at', { ascending: false });

      if (casesData) {
        setSealedCases(casesData);
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
      const { error } = await supabase
        .from('flame_succession')
        .insert({
          judge_id: user?.id,
          successor_id: selectedSuccessorId,
          scroll_key: scrollKey,
          last_active: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Successor nominated",
        description: "Your scroll successor has been nominated successfully",
      });

      setSelectedSuccessorId('');
      setScrollKey('');
      fetchData();

      // Log this activity
      await supabase
        .from('scroll_integrity_logs')
        .insert({
          user_id: user?.id,
          action_type: 'SUCCESSOR_NOMINATED',
          description: `Judge has nominated a successor for flame preservation`,
          integrity_impact: 10
        });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="ScrollFlame Succession" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <h1 className="text-2xl font-bold text-justice-light mb-6">ScrollFlame Succession System</h1>
        
        <Tabs defaultValue="nominate" className="space-y-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="nominate">Nominate Successor</TabsTrigger>
            <TabsTrigger value="flame">Flame Activity</TabsTrigger>
            <TabsTrigger value="cases">Transfer Cases</TabsTrigger>
            <TabsTrigger value="nominations">View Nominations</TabsTrigger>
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
              
              {sealedCases.length === 0 ? (
                <p className="text-gray-300">You have no sealed cases to transfer.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case Title</TableHead>
                        <TableHead>Sealed On</TableHead>
                        <TableHead>Transfer To</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sealedCases.map((scase) => (
                        <TableRow key={scase.id}>
                          <TableCell>{scase.title}</TableCell>
                          <TableCell>{new Date(scase.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <select className="bg-black/50 border border-justice-primary/50 rounded-md text-white px-2 py-1">
                              <option value="">-- Select Successor --</option>
                              {nominations.map(nom => (
                                <option key={nom.successor_id} value={nom.successor_id}>
                                  {nom.successor_username}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                const select = document.querySelector(`tr[data-case-id="${scase.id}"] select`) as HTMLSelectElement;
                                if (select && select.value) {
                                  handleTransferCase(scase.id, select.value);
                                } else {
                                  toast({
                                    title: "No successor selected",
                                    description: "Please select a successor to transfer this case to",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              Transfer
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="nominations">
            <Card className="p-6 bg-black/30 border border-justice-primary/30">
              <h2 className="text-xl font-semibold text-justice-light mb-4">Succession Nominations</h2>
              
              {nominations.length === 0 ? (
                <p className="text-gray-300">No succession nominations have been made yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Judge</TableHead>
                        <TableHead>Successor</TableHead>
                        <TableHead>Last Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nominations.map((nom) => (
                        <TableRow key={nom.id}>
                          <TableCell className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{nom.judge_username?.[0] || 'J'}</AvatarFallback>
                            </Avatar>
                            <span>{nom.judge_username}</span>
                          </TableCell>
                          <TableCell className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{nom.successor_username?.[0] || 'S'}</AvatarFallback>
                            </Avatar>
                            <span>{nom.successor_username}</span>
                          </TableCell>
                          <TableCell>{new Date(nom.last_active).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
