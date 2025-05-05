
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { ScrollPetition } from "@/types/petition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gavel, FileText, Volume2, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompactEHourClock } from "@/components/scroll-time/CompactEHourClock";
import { SealAnimation } from "@/components/courtroom/SealAnimation";
import { AudioVerdictPlayer } from "@/components/courtroom/AudioVerdictPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SealedPetition extends ScrollPetition {
  petitioner_username?: string;
  judge_username?: string;
}

export default function HallOfSealedScrolls() {
  const [sealedPetitions, setSealedPetitions] = useState<SealedPetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterGate, setFilterGate] = useState<string>('all');
  const [filterFlame, setFilterFlame] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [sealRevealing, setSealRevealing] = useState<string | null>(null);

  useEffect(() => {
    fetchSealedPetitions();
  }, [filterGate, filterFlame, filterCountry]);

  const fetchSealedPetitions = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('scroll_petitions')
        .select(`
          *,
          petitioner:petitioner_id(username:profiles(username)),
          judge:assigned_judge_id(username:profiles(username))
        `)
        .eq('is_sealed', true)
        .order('verdict_timestamp', { ascending: false });
      
      // Apply filters if selected
      if (filterGate !== 'all') {
        query = query.eq('scroll_gate', filterGate);
      }
      
      if (filterFlame !== 'all') {
        query = query.eq('flame_signature_hash', filterFlame);
      }
      
      if (filterCountry !== 'all') {
        query = query.eq('jurisdiction_country', filterCountry);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        const formattedData = data.map(petition => ({
          ...petition,
          petitioner_username: petition.petitioner?.username || 'Anonymous Petitioner',
          judge_username: petition.judge?.username || 'Unknown Judge'
        }));
        
        setSealedPetitions(formattedData);
      }
    } catch (err) {
      console.error('Error fetching sealed petitions:', err);
      setError('Failed to load sealed scrolls');
    } finally {
      setLoading(false);
    }
  };

  const revealSeal = (petitionId: string) => {
    setSealRevealing(petitionId);
    setTimeout(() => {
      setSealRevealing(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="Hall of Sealed Scrolls" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-justice-light">Hall of Sealed Scrolls</h1>
          <CompactEHourClock />
        </div>
        
        <Card className="mb-6 bg-black/30 border border-justice-primary/30">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col space-y-1 flex-1 min-w-[200px]">
                <label className="text-sm text-gray-300">Filter by Gate</label>
                <Select value={filterGate} onValueChange={setFilterGate}>
                  <SelectTrigger className="bg-black/50 border-justice-primary/30">
                    <SelectValue placeholder="All Gates" />
                  </SelectTrigger>
                  <SelectContent className="bg-justice-dark border-justice-primary/30">
                    <SelectItem value="all">All Gates</SelectItem>
                    <SelectItem value="dawn">Dawn Gate</SelectItem>
                    <SelectItem value="light">Light Gate</SelectItem>
                    <SelectItem value="sun">Sun Gate</SelectItem>
                    <SelectItem value="fire">Fire Gate</SelectItem>
                    <SelectItem value="star">Star Gate</SelectItem>
                    <SelectItem value="moon">Moon Gate</SelectItem>
                    <SelectItem value="water">Water Gate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-1 flex-1 min-w-[200px]">
                <label className="text-sm text-gray-300">Filter by Flame</label>
                <Select value={filterFlame} onValueChange={setFilterFlame}>
                  <SelectTrigger className="bg-black/50 border-justice-primary/30">
                    <SelectValue placeholder="All Flames" />
                  </SelectTrigger>
                  <SelectContent className="bg-justice-dark border-justice-primary/30">
                    <SelectItem value="all">All Flames</SelectItem>
                    <SelectItem value="truth">Truth Flame</SelectItem>
                    <SelectItem value="wisdom">Wisdom Flame</SelectItem>
                    <SelectItem value="justice">Justice Flame</SelectItem>
                    <SelectItem value="mercy">Mercy Flame</SelectItem>
                    <SelectItem value="righteousness">Righteousness Flame</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-1 flex-1 min-w-[200px]">
                <label className="text-sm text-gray-300">Filter by Country</label>
                <Select value={filterCountry} onValueChange={setFilterCountry}>
                  <SelectTrigger className="bg-black/50 border-justice-primary/30">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent className="bg-justice-dark border-justice-primary/30">
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="IL">Israel</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="self-end px-4" onClick={fetchSealedPetitions}>
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-8 w-8 border-t-2 border-justice-secondary rounded-full mx-auto mb-4"></div>
            <p className="text-gray-300">Loading sealed scrolls...</p>
          </div>
        ) : error ? (
          <Card className="bg-black/30 border border-destructive/30">
            <CardContent className="pt-6 text-center">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchSealedPetitions}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : sealedPetitions.length === 0 ? (
          <Card className="bg-black/30 border border-justice-primary/30">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-300">No sealed scrolls found with the current filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sealedPetitions.map((petition) => (
              <Card 
                key={petition.id}
                className="bg-black/30 border border-justice-primary/30 overflow-hidden relative"
              >
                {sealRevealing === petition.id && (
                  <div className="absolute inset-0 z-10">
                    <SealAnimation onComplete={() => setSealRevealing(null)} />
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-justice-light">{petition.title}</CardTitle>
                    <Badge variant="outline" className="bg-justice-primary/10">
                      {petition.verdict === 'approved' ? 'Approved' : 'Rejected'}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center mt-1">
                    <Gavel className="h-3.5 w-3.5 mr-1 text-justice-secondary" />
                    Sealed on {new Date(petition.verdict_timestamp || '').toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="w-full mb-2">
                      <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
                      <TabsTrigger value="verdict" className="flex-1">Verdict</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="summary">
                      <div className="text-sm text-gray-300 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Petitioner:</span>
                          <span>{petition.petitioner_username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Judge:</span>
                          <span>{petition.judge_username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gate:</span>
                          <span>{petition.scroll_gate || 'Unknown Gate'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Flame:</span>
                          <span>{petition.flame_signature_hash ? petition.flame_signature_hash.substring(0, 8) + '...' : 'No Flame'}</span>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="verdict">
                      <div className="text-sm text-gray-300">
                        <p className="italic mb-2">{petition.verdict_reasoning || 'No reasoning provided'}</p>
                        
                        {petition.audio_verdict_url && (
                          <div className="mt-4">
                            <AudioVerdictPlayer url={petition.audio_verdict_url} />
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                
                <CardFooter className="border-t border-justice-primary/20 pt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => revealSeal(petition.id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Seal
                  </Button>
                  
                  {petition.audio_verdict_url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Hear Verdict
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
