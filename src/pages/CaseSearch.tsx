
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CaseList } from "@/components/dashboard/CaseList"; 
import { cases, scrollMemories, systemHealth } from "@/services/mockData";
import { Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CaseSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCases, setFilteredCases] = useState(cases);
  const [jurisdiction, setJurisdiction] = useState<string>("all");
  
  // Get the current scroll phase and gate from the first memory
  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;

  // Handle search
  const handleSearch = () => {
    const results = cases.filter(
      (c) => 
        (c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.principle.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (jurisdiction === "all" || c.jurisdiction === jurisdiction)
    );
    setFilteredCases(results);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setJurisdiction("all");
    setFilteredCases(cases);
  };

  // Available jurisdictions from mock data
  const jurisdictions = Array.from(
    new Set(cases.filter(c => c.jurisdiction).map(c => c.jurisdiction))
  );

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      {/* Main content */}
      <div className="flex-1 p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="Case Search & Analysis" 
          text="Search across global jurisdictions and scroll-aligned precedents"
          systemHealth={systemHealth}
        />

        <Card className="mt-6 bg-justice-dark border-justice-tertiary">
          <CardHeader>
            <CardTitle className="text-justice-light">Advanced Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by case title, ID, or principle..." 
                  className="bg-justice-dark/50 border-justice-tertiary text-white"
                />
              </div>
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary text-white">
                  <SelectValue placeholder="All Jurisdictions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jurisdictions</SelectItem>
                  {jurisdictions.map((j) => (
                    <SelectItem key={j} value={j}>{j}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline" className="bg-justice-secondary/20">
                Equal Protection
              </Badge>
              <Badge variant="outline" className="bg-justice-secondary/20">
                Due Process
              </Badge>
              <Badge variant="outline" className="bg-justice-secondary/20">
                Human Dignity
              </Badge>
              <Badge variant="outline" className="bg-justice-secondary/20">
                Civil Rights
              </Badge>
              <Badge variant="outline" className="bg-justice-secondary/20">
                + Add Filter
              </Badge>
            </div>

            <div className="flex space-x-2 mt-6">
              <Button className="bg-justice-primary hover:bg-justice-secondary" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" className="border-justice-tertiary text-white" onClick={resetFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="results" className="mt-6">
          <TabsList className="bg-justice-dark/50">
            <TabsTrigger value="results">Search Results</TabsTrigger>
            <TabsTrigger value="saved">Saved Cases</TabsTrigger>
            <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
          </TabsList>
          <TabsContent value="results" className="mt-4">
            <Card className="border-justice-tertiary bg-transparent">
              <CardHeader className="border-b border-justice-dark">
                <div className="flex justify-between items-center">
                  <CardTitle>Found {filteredCases.length} Cases</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Scroll-aligned: {filteredCases.filter(c => c.scroll_alignment).length}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CaseList cases={filteredCases} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="saved" className="mt-4">
            <div className="text-center py-10 text-muted-foreground">
              No saved cases. Use the bookmark icon to save cases for later reference.
            </div>
          </TabsContent>
          <TabsContent value="recent" className="mt-4">
            <div className="text-center py-10 text-muted-foreground">
              Your recently viewed cases will appear here.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CaseSearch;
