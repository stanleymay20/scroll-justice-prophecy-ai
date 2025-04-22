
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cases, scrollMemories, systemHealth } from "@/services/mockData";
import { ScrollPhase } from "@/types";
import { CaseVolumeChart } from "@/components/analytics/CaseVolumeChart";
import { PrincipleTrendChart } from "@/components/analytics/PrincipleTrendChart";
import { SystemHealthTimeline } from "@/components/analytics/SystemHealthTimeline";

const Analytics = () => {
  const [timeframe, setTimeframe] = useState("30d");
  
  // Get the current scroll phase and gate from the first memory
  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;
  
  // Count cases by phase
  const casesByPhase: Record<ScrollPhase, number> = {
    "DAWN": cases.filter(c => c.scroll_alignment?.includes("DAWN")).length,
    "RISE": cases.filter(c => c.scroll_alignment?.includes("RISE")).length,
    "ASCEND": cases.filter(c => c.scroll_alignment?.includes("ASCEND")).length,
  };
  
  // Calculate total cases
  const totalCases = cases.length;
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      {/* Main content */}
      <div className="flex-1 p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="FastTrackJusticeAI Analytics" 
          text="System performance metrics and trend analysis"
          systemHealth={systemHealth}
          showExportButton
          onExport={() => console.log("Export analytics requested")}
        />

        <div className="mt-4 flex justify-end">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px] bg-justice-dark/50 border-justice-tertiary text-white">
              <SelectValue placeholder="Filter by timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-justice-dark text-white border-justice-tertiary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cases Analyzed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCases}</div>
              <div className="text-sm text-muted-foreground mt-1">
                +{Math.floor(totalCases * 0.15)} from previous period
              </div>
            </CardContent>
          </Card>
          <Card className="bg-justice-dark text-white border-justice-tertiary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Scroll Phase Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge className="bg-scroll-dawn text-justice-dark">{casesByPhase.DAWN}</Badge>
                <Badge className="bg-scroll-rise text-justice-dark">{casesByPhase.RISE}</Badge>
                <Badge className="bg-scroll-ascend text-white border border-scroll-ascend">{casesByPhase.ASCEND}</Badge>
              </div>
              <div className="mt-2 flex h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-scroll-dawn" 
                  style={{ width: `${(casesByPhase.DAWN / totalCases) * 100}%` }}
                ></div>
                <div 
                  className="bg-scroll-rise" 
                  style={{ width: `${(casesByPhase.RISE / totalCases) * 100}%` }}
                ></div>
                <div 
                  className="bg-scroll-ascend" 
                  style={{ width: `${(casesByPhase.ASCEND / totalCases) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-justice-dark text-white border-justice-tertiary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                System Health Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SystemHealthTimeline />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="border-justice-tertiary bg-justice-dark text-white">
            <CardHeader>
              <CardTitle>Principle Evolution Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <PrincipleTrendChart />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="border-justice-tertiary bg-justice-dark text-white">
            <CardHeader>
              <CardTitle>Case Volume Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <CaseVolumeChart />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-justice-tertiary bg-justice-dark text-white">
            <CardHeader>
              <CardTitle className="text-base">Regional Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>North America</span>
                    <span>42%</span>
                  </div>
                  <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                    <div className="h-full bg-justice-primary rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Europe</span>
                    <span>28%</span>
                  </div>
                  <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                    <div className="h-full bg-justice-primary rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Asia</span>
                    <span>18%</span>
                  </div>
                  <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                    <div className="h-full bg-justice-primary rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Africa</span>
                    <span>8%</span>
                  </div>
                  <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                    <div className="h-full bg-justice-primary rounded-full" style={{ width: '8%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>South America</span>
                    <span>3%</span>
                  </div>
                  <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                    <div className="h-full bg-justice-primary rounded-full" style={{ width: '3%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Oceania</span>
                    <span>1%</span>
                  </div>
                  <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                    <div className="h-full bg-justice-primary rounded-full" style={{ width: '1%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-justice-tertiary bg-justice-dark text-white">
            <CardHeader>
              <CardTitle className="text-base">Principle Prominence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Equal Protection</span>
                    <span className="bg-principle-strong text-justice-dark px-2 py-1 rounded-full text-xs">92%</span>
                  </div>
                  <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                    <div className="h-full bg-principle-strong rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Due Process</span>
                    <span className="bg-principle-strong text-justice-dark px-2 py-1 rounded-full text-xs">87%</span>
                  </div>
                  <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                    <div className="h-full bg-principle-strong rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Human Dignity</span>
                    <span className="bg-principle-medium text-justice-dark px-2 py-1 rounded-full text-xs">76%</span>
                  </div>
                  <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                    <div className="h-full bg-principle-medium rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Right to Privacy</span>
                    <span className="bg-principle-medium text-justice-dark px-2 py-1 rounded-full text-xs">68%</span>
                  </div>
                  <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                    <div className="h-full bg-principle-medium rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Representation Rights</span>
                    <span className="bg-principle-weak text-white px-2 py-1 rounded-full text-xs">45%</span>
                  </div>
                  <div className="h-2 w-full bg-justice-neutral/30 rounded-full">
                    <div className="h-full bg-principle-weak rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
