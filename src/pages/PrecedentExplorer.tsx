
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { scrollMemories, systemHealth, graphData } from "@/services/mockData";
import { ForceGraph } from "@/components/visualizations/ForceGraph";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollPhase } from "@/types";
import { Search } from "lucide-react";

const PrecedentExplorer = () => {
  // Get the current scroll phase and gate from the first memory
  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      {/* Main content */}
      <div className="flex-1 p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="Precedent Graph Explorer" 
          text="Visualize the web of legal principles and precedents"
          systemHealth={systemHealth}
          showExportButton
          onExport={() => console.log("Export graph requested")}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <div className="flex space-x-4 mb-4">
              <Input 
                placeholder="Search precedents or principles..." 
                className="bg-justice-dark/50 border-justice-tertiary text-white"
              />
              <Button className="bg-justice-primary hover:bg-justice-secondary">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
          <div>
            <Select>
              <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary text-white">
                <SelectValue placeholder="Filter by Phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                <SelectItem value="DAWN">DAWN</SelectItem>
                <SelectItem value="RISE">RISE</SelectItem>
                <SelectItem value="ASCEND">ASCEND</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Card className="border-justice-tertiary bg-transparent">
            <CardHeader className="border-b border-justice-dark">
              <CardTitle className="flex items-center justify-between">
                <span>Interactive Force-Directed Graph</span>
                <div className="text-sm text-muted-foreground">
                  <span className="inline-block w-3 h-3 rounded-full bg-scroll-dawn mr-1"></span> Cases
                  <span className="inline-block w-3 h-3 rounded-full bg-principle-medium mx-1 ml-3"></span> Principles
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex justify-center">
              <ForceGraph data={graphData} height={650} />
            </CardContent>
          </Card>
        </div>
        
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
