import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { systemHealth } from "@/services/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollPhase, Case, ScrollGate } from "@/types";
import { Search, Filter, Tag, MapPin, Calendar, BookOpen, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

type Precedent = {
  id: string;
  title: string;
  summary: string;
  full_text: string;
  jurisdiction: string;
  tags: string[];
  scroll_gate: string;
  scroll_phase: ScrollPhase;
  principle: string;
  confidence: number;
  date: string;
  created_at: string;
}

const PrecedentExplorer = () => {
  // State variables
  const [precedents, setPrecedents] = useState<Precedent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<string>("");
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [selectedPrecedent, setSelectedPrecedent] = useState<Precedent | null>(null);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [uniqueJurisdictions, setUniqueJurisdictions] = useState<string[]>([]);
  
  // Get the current scroll phase and gate from the first precedent
  const currentPhase = precedents[0]?.scroll_phase || "DAWN";
  // Convert the gate string (e.g., "Gate 3") to a number (3) and ensure it's a valid ScrollGate type
  const gateNumber = parseInt(precedents[0]?.scroll_gate?.replace("Gate ", "") || "3");
  // Ensure the gate is within the valid range (1-7)
  const currentGate = (gateNumber >= 1 && gateNumber <= 7 ? gateNumber : 3) as ScrollGate;
  
  // Fetch precedents from Supabase
  useEffect(() => {
    const fetchPrecedents = async () => {
      setLoading(true);
      
      try {
        let query = supabase.from("precedents").select("*");
        
        // Apply filters if they exist
        if (phaseFilter) {
          query = query.eq("scroll_phase", phaseFilter);
        }
        
        if (jurisdictionFilter) {
          query = query.eq("jurisdiction", jurisdictionFilter);
        }
        
        if (tagFilter) {
          query = query.contains("tags", [tagFilter]);
        }
        
        const { data, error } = await query.order("confidence", { ascending: false });
        
        if (error) {
          console.error("Error fetching precedents:", error);
          toast({
            title: "Error fetching precedents",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        setPrecedents(data as Precedent[]);
        
        // Extract unique tags and jurisdictions for filters
        const allTags = data?.flatMap(p => p.tags || []) || [];
        const uniqueTags = [...new Set(allTags)];
        setUniqueTags(uniqueTags);
        
        const allJurisdictions = data?.map(p => p.jurisdiction).filter(Boolean) || [];
        const uniqueJurisdictions = [...new Set(allJurisdictions)];
        setUniqueJurisdictions(uniqueJurisdictions);
        
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrecedents();
  }, [phaseFilter, jurisdictionFilter, tagFilter]);
  
  // Filter precedents by search query
  const filteredPrecedents = precedents.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.principle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get badge color based on principle confidence
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) {
      return <Badge className="bg-principle-strong text-justice-dark">{(confidence * 100).toFixed(1)}%</Badge>;
    } else if (confidence >= 0.75) {
      return <Badge className="bg-principle-medium text-justice-dark">{(confidence * 100).toFixed(1)}%</Badge>;
    } else {
      return <Badge className="bg-principle-weak text-white">{(confidence * 100).toFixed(1)}%</Badge>;
    }
  };
  
  // Get phase badge color
  const getPhaseBadge = (phase: ScrollPhase) => {
    switch (phase) {
      case "DAWN":
        return <Badge className="bg-scroll-dawn text-justice-dark">{phase}</Badge>;
      case "RISE":
        return <Badge className="bg-scroll-rise text-justice-dark">{phase}</Badge>;
      case "ASCEND":
        return <Badge className="bg-scroll-ascend text-justice-dark">{phase}</Badge>;
      default:
        return <Badge>{phase}</Badge>;
    }
  };
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar currentPhase={currentPhase as ScrollPhase} currentGate={currentGate} />

      {/* Main content */}
      <div className="flex-1 p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="Precedent Graph Explorer" 
          text="Visualize the web of legal principles and precedents"
          systemHealth={systemHealth}
          showExportButton
          onExport={() => {
            const csvData = precedents.map(p => 
              `${p.title},${p.jurisdiction},${p.principle},${p.scroll_phase},${p.scroll_gate},${p.confidence}`
            ).join("\n");
            
            const blob = new Blob([`Title,Jurisdiction,Principle,Phase,Gate,Confidence\n${csvData}`], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'precedent-data.csv';
            a.click();
            
            toast({
              title: "Export successful",
              description: `${precedents.length} precedents exported to CSV`,
            });
          }}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-9">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search precedents or principles..." 
                  className="bg-justice-dark/50 border-justice-tertiary text-white pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-justice-primary hover:bg-justice-secondary">
                    <Plus className="mr-2 h-4 w-4" />
                    New Precedent
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-justice-dark text-white">
                  <DialogHeader>
                    <DialogTitle>Add New Precedent</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new legal precedent to add it to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <form className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Case Title</label>
                        <Input 
                          placeholder="Enter case title" 
                          className="bg-justice-dark/50 border-justice-tertiary"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Jurisdiction</label>
                          <Input 
                            placeholder="Enter jurisdiction" 
                            className="bg-justice-dark/50 border-justice-tertiary"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Principle</label>
                          <Input 
                            placeholder="Enter principle" 
                            className="bg-justice-dark/50 border-justice-tertiary"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Scroll Phase</label>
                          <Select>
                            <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary">
                              <SelectValue placeholder="Select phase" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DAWN">DAWN</SelectItem>
                              <SelectItem value="RISE">RISE</SelectItem>
                              <SelectItem value="ASCEND">ASCEND</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Scroll Gate</label>
                          <Input 
                            placeholder="Enter scroll gate (e.g. Gate 3)" 
                            className="bg-justice-dark/50 border-justice-tertiary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Summary</label>
                        <Input 
                          placeholder="Enter brief summary" 
                          className="bg-justice-dark/50 border-justice-tertiary"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Full Text</label>
                        <textarea 
                          placeholder="Enter full case text" 
                          className="w-full min-h-[100px] rounded-md border border-justice-tertiary bg-justice-dark/50 p-2"
                        ></textarea>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button
                          className="bg-justice-primary hover:bg-justice-secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            toast({
                              title: "Form not implemented",
                              description: "This form is currently a placeholder. Submission functionality will be added later.",
                            });
                          }}
                        >
                          Submit Precedent
                        </Button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="md:col-span-3 flex flex-col gap-2">
            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
              <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary text-white">
                <SelectValue placeholder="Filter by Phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Phases</SelectItem>
                <SelectItem value="DAWN">DAWN</SelectItem>
                <SelectItem value="RISE">RISE</SelectItem>
                <SelectItem value="ASCEND">ASCEND</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={jurisdictionFilter} onValueChange={setJurisdictionFilter}>
              <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary text-white">
                <SelectValue placeholder="Filter by Jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Jurisdictions</SelectItem>
                {uniqueJurisdictions.map(j => (
                  <SelectItem key={j} value={j}>{j}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary text-white">
                <SelectValue placeholder="Filter by Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tags</SelectItem>
                {uniqueTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Card className="border-justice-tertiary bg-transparent">
            <CardHeader className="border-b border-justice-dark">
              <CardTitle className="flex items-center justify-between">
                <span>Precedent Database</span>
                <div className="text-sm text-muted-foreground flex gap-4">
                  {phaseFilter && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Filter className="h-3 w-3" /> Phase: {phaseFilter}
                    </Badge>
                  )}
                  {jurisdictionFilter && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {jurisdictionFilter}
                    </Badge>
                  )}
                  {tagFilter && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {tagFilter.replace(/_/g, ' ')}
                    </Badge>
                  )}
                  <span className="text-muted-foreground">{filteredPrecedents.length} results</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin h-8 w-8 border-2 border-justice-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-justice-dark/70">
                    <TableRow>
                      <TableHead className="text-white">Case</TableHead>
                      <TableHead className="text-white">Jurisdiction</TableHead>
                      <TableHead className="text-white">Principle</TableHead>
                      <TableHead className="text-white">Phase</TableHead>
                      <TableHead className="text-white">Gate</TableHead>
                      <TableHead className="text-white text-right">Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrecedents.length > 0 ? (
                      filteredPrecedents.map((precedent) => (
                        <TableRow 
                          key={precedent.id} 
                          className="hover:bg-justice-dark/30 cursor-pointer transition-colors"
                          onClick={() => setSelectedPrecedent(precedent)}
                        >
                          <TableCell className="font-medium text-white">{precedent.title}</TableCell>
                          <TableCell className="text-muted-foreground">{precedent.jurisdiction}</TableCell>
                          <TableCell className="text-justice-tertiary">{precedent.principle}</TableCell>
                          <TableCell>{getPhaseBadge(precedent.scroll_phase as ScrollPhase)}</TableCell>
                          <TableCell className="text-muted-foreground">{precedent.scroll_gate}</TableCell>
                          <TableCell className="text-right">{getConfidenceBadge(precedent.confidence)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No precedents found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Precedent Detail Dialog */}
        <Dialog open={!!selectedPrecedent} onOpenChange={(open) => !open && setSelectedPrecedent(null)}>
          <DialogContent className="sm:max-w-[700px] bg-justice-dark text-white">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedPrecedent?.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> 
                {selectedPrecedent?.jurisdiction}
                <span className="mx-1">•</span>
                <Calendar className="h-4 w-4" />
                {new Date(selectedPrecedent?.date || "").toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="summary" className="mt-4">
              <TabsList className="bg-justice-dark/50 border border-justice-tertiary">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="full-text">Full Text</TabsTrigger>
                <TabsTrigger value="metadata">Scroll Metadata</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="mt-4 space-y-4">
                <p className="text-muted-foreground">{selectedPrecedent?.summary}</p>
                
                <div>
                  <h4 className="text-justice-tertiary mb-2 font-medium">Primary Principle</h4>
                  <p className="bg-justice-neutral/20 p-3 rounded-md border-l-4 border-justice-tertiary">
                    {selectedPrecedent?.principle}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="full-text" className="mt-4">
                <div className="bg-justice-dark/40 p-4 rounded-md border border-justice-tertiary/30 prose prose-invert max-w-none">
                  <p className="whitespace-pre-line">{selectedPrecedent?.full_text}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="metadata" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-justice-dark/40 p-4 rounded-md border border-justice-tertiary/30">
                    <h4 className="text-sm text-muted-foreground mb-1">Scroll Phase</h4>
                    <div className="flex items-center gap-2">
                      {getPhaseBadge(selectedPrecedent?.scroll_phase as ScrollPhase)}
                      <span className="text-lg font-medium">{selectedPrecedent?.scroll_phase}</span>
                    </div>
                  </div>
                  
                  <div className="bg-justice-dark/40 p-4 rounded-md border border-justice-tertiary/30">
                    <h4 className="text-sm text-muted-foreground mb-1">Gate</h4>
                    <div className="text-lg font-medium">{selectedPrecedent?.scroll_gate}</div>
                  </div>
                  
                  <div className="bg-justice-dark/40 p-4 rounded-md border border-justice-tertiary/30">
                    <h4 className="text-sm text-muted-foreground mb-1">Principle Confidence</h4>
                    <div>{getConfidenceBadge(selectedPrecedent?.confidence || 0)}</div>
                  </div>
                  
                  <div className="bg-justice-dark/40 p-4 rounded-md border border-justice-tertiary/30">
                    <h4 className="text-sm text-muted-foreground mb-1">Tags</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPrecedent?.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="capitalize">
                          {tag.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedPrecedent(null)}>
                Close
              </Button>
              <Button className="bg-justice-primary hover:bg-justice-secondary">
                <BookOpen className="mr-2 h-4 w-4" />
                Generate Explanation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Card className="border-justice-tertiary bg-justice-dark text-white">
              <CardHeader>
                <CardTitle className="text-base">Highest Impact Principles</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center border-b border-justice-tertiary/20 pb-2">
                    <span>Equal Protection</span>
                    <span className="bg-principle-strong text-justice-dark px-2 py-1 rounded-full text-xs">98%</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-justice-tertiary/20 pb-2">
                    <span>Right to Life</span>
                    <span className="bg-principle-strong text-justice-dark px-2 py-1 rounded-full text-xs">94%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Dignity and Autonomy</span>
                    <span className="bg-principle-medium text-justice-dark px-2 py-1 rounded-full text-xs">89%</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="border-justice-tertiary bg-justice-dark text-white">
              <CardHeader>
                <CardTitle className="text-base">Most Connected Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center border-b border-justice-tertiary/20 pb-2">
                    <span>Brown v. Board of Education</span>
                    <span className="bg-scroll-dawn text-justice-dark px-2 py-1 rounded-full text-xs">5 links</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-justice-tertiary/20 pb-2">
                    <span>S v. Makwanyane</span>
                    <span className="bg-scroll-ascend text-justice-dark px-2 py-1 rounded-full text-xs">4 links</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Obergefell v. Hodges</span>
                    <span className="bg-scroll-dawn text-justice-dark px-2 py-1 rounded-full text-xs">3 links</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="border-justice-tertiary bg-justice-dark text-white">
              <CardHeader>
                <CardTitle className="text-base">Scroll Phase Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-scroll-dawn">DAWN</span>
                      <span>45%</span>
                    </div>
                    <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                      <div className="h-full bg-scroll-dawn rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-scroll-rise">RISE</span>
                      <span>35%</span>
                    </div>
                    <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                      <div className="h-full bg-scroll-rise rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-scroll-ascend">ASCEND</span>
                      <span>20%</span>
                    </div>
                    <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                      <div className="h-full bg-scroll-ascend rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrecedentExplorer;
