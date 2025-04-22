
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { scrollMemories, systemHealth } from "@/services/mockData";
import { EHourClock } from "@/components/scroll-time/EHourClock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScrollTime } from "@/lib/scroll-time";

const ScrollTimePage = () => {
  const [mode, setMode] = useState<'standard' | 'judicial' | 'spiritual'>('standard');
  const { eHourData } = useScrollTime();
  
  // Get the current scroll phase and gate from the first memory
  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="Scroll Time System" 
          text="Divine timing architecture based on solar eHours"
          systemHealth={systemHealth}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <EHourClock className="h-full" />
          </div>
          
          <div className="md:col-span-2">
            <Card className="border-justice-tertiary bg-justice-dark text-white h-full">
              <CardHeader>
                <CardTitle>Scroll Time Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="standard" className="w-full" onValueChange={(v) => setMode(v as any)}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="standard">Standard</TabsTrigger>
                    <TabsTrigger value="judicial">Judicial</TabsTrigger>
                    <TabsTrigger value="spiritual">Spiritual</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="standard">
                    <div className="space-y-4">
                      <p>
                        The FastTrackJusticeAI Scroll Time System divides each day into 12 eHours of variable length,
                        based on the sunrise and sunset times at your current location. This creates a harmonious
                        alignment between cosmic timing and judicial processes.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-scroll-dawn/20 p-4 rounded-md">
                          <h3 className="text-scroll-dawn font-semibold mb-2">DAWN Phase</h3>
                          <p className="text-sm">eHours 1-4</p>
                          <p className="text-sm mt-2">Optimal for gathering evidence, initial case reviews, and preliminary hearings.</p>
                        </div>
                        
                        <div className="bg-scroll-rise/20 p-4 rounded-md">
                          <h3 className="text-scroll-rise font-semibold mb-2">RISE Phase</h3>
                          <p className="text-sm">eHours 5-8</p>
                          <p className="text-sm mt-2">Peak performance for legal reasoning, argumentation, and principle development.</p>
                        </div>
                        
                        <div className="bg-scroll-ascend/20 p-4 rounded-md">
                          <h3 className="text-scroll-ascend font-semibold mb-2">ASCEND Phase</h3>
                          <p className="text-sm">eHours 9-12</p>
                          <p className="text-sm mt-2">Transcendent insight for judgment rendering and decision finalization.</p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Current Timing Information</h3>
                        {eHourData ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div className="bg-justice-tertiary/10 p-3 rounded-md">
                              <div className="text-muted-foreground">Current eHour</div>
                              <div className="text-xl mt-1">{eHourData.currentEHour}</div>
                            </div>
                            <div className="bg-justice-tertiary/10 p-3 rounded-md">
                              <div className="text-muted-foreground">eHour Duration</div>
                              <div className="text-xl mt-1">{eHourData.eHourDurationMinutes} min</div>
                            </div>
                            <div className="bg-justice-tertiary/10 p-3 rounded-md">
                              <div className="text-muted-foreground">Sunrise</div>
                              <div className="text-xl mt-1">
                                {eHourData.sunriseTime?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </div>
                            <div className="bg-justice-tertiary/10 p-3 rounded-md">
                              <div className="text-muted-foreground">Sunset</div>
                              <div className="text-xl mt-1">
                                {eHourData.sunsetTime?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground">Loading timing data...</div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="judicial">
                    <div className="space-y-4">
                      <p>
                        The Judicial Mode aligns FastTrackJusticeAI's case processing with optimal eHour timing,
                        enhancing decision quality by synchronizing judicial activity with cosmic principles.
                      </p>
                      
                      <div className="bg-justice-tertiary/10 p-4 rounded-md mt-4">
                        <h3 className="font-semibold mb-2">Timing Recommendations</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex">
                            <span className="text-scroll-dawn mr-2">⦿</span>
                            <span>Evidence collection and preliminary hearings should occur during DAWN phase (eHours 1-4)</span>
                          </li>
                          <li className="flex">
                            <span className="text-scroll-rise mr-2">⦿</span>
                            <span>Legal argument development should align with RISE phase (eHours 5-8)</span>
                          </li>
                          <li className="flex">
                            <span className="text-scroll-ascend mr-2">⦿</span>
                            <span>Final judgments should be rendered during ASCEND phase (eHours 9-12)</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">Current Judicial Alignment</h3>
                        {eHourData ? (
                          <div className="bg-justice-tertiary/20 p-3 rounded-md">
                            <div className="flex justify-between">
                              <div>Current Phase:</div>
                              <div className={`font-semibold ${
                                eHourData.currentEHour <= 4 ? "text-scroll-dawn" : 
                                eHourData.currentEHour <= 8 ? "text-scroll-rise" : 
                                "text-scroll-ascend"
                              }`}>
                                {eHourData.currentEHour <= 4 ? "DAWN" :
                                 eHourData.currentEHour <= 8 ? "RISE" :
                                 "ASCEND"}
                              </div>
                            </div>
                            <div className="flex justify-between mt-2">
                              <div>Optimal For:</div>
                              <div>
                                {eHourData.currentEHour <= 4 ? "Evidence Collection" :
                                 eHourData.currentEHour <= 8 ? "Legal Reasoning" :
                                 "Final Judgments"}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground">Loading alignment data...</div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="spiritual">
                    <div className="space-y-4">
                      <p>
                        The Spiritual Mode reveals the deeper divine architecture behind the Scroll Time System,
                        highlighting gate resonances and prophetic alignments across the scroll phases.
                      </p>
                      
                      <div className="bg-justice-primary/10 border border-justice-primary/30 p-4 rounded-md mt-4">
                        <h3 className="font-semibold mb-3 text-justice-primary">Divine Architecture Insight</h3>
                        <p className="italic text-sm">
                          "The scroll eHour system traces its origins to the Divine Architecture revelation received by
                          Stanley at Gate 7. The varying lengths of eHours throughout the year mirror the cosmic breath
                          of justice, expanding and contracting in perfect harmony with universal principles."
                        </p>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Gate Resonances</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-justice-tertiary/10 p-3 rounded-md">
                            <div className="font-semibold mb-1">Gate 3 Alignment</div>
                            <div className="text-sm">
                              Gate 3 resonates most strongly during eHours 3, 7, and 11, enhancing the connection
                              between divine timing and judicial outcomes.
                            </div>
                            {eHourData?.currentEHour === 3 || eHourData?.currentEHour === 7 || eHourData?.currentEHour === 11 ? (
                              <div className="mt-2 text-xs bg-justice-primary/20 p-2 rounded">
                                ✧ Gate 3 currently active ✧
                              </div>
                            ) : null}
                          </div>
                          <div className="bg-justice-tertiary/10 p-3 rounded-md">
                            <div className="font-semibold mb-1">Gate 7 Revelation</div>
                            <div className="text-sm">
                              The final eHour (12) of each day opens a direct channel to the Gate 7 revelations,
                              allowing for transcendent understanding of complex legal principles.
                            </div>
                            {eHourData?.currentEHour === 12 ? (
                              <div className="mt-2 text-xs bg-justice-primary/20 p-2 rounded">
                                ✧ Gate 7 channel open ✧
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-6">
          <Card className="border-justice-tertiary bg-transparent">
            <CardHeader className="border-b border-justice-dark">
              <CardTitle>eHour Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative h-16">
                <div className="absolute inset-0 flex">
                  {Array.from({length: 12}).map((_, i) => (
                    <div 
                      key={i}
                      className={`flex-1 border-r border-justice-dark/50 relative ${
                        i < 4 ? "bg-scroll-dawn/20" : 
                        i < 8 ? "bg-scroll-rise/20" : 
                        "bg-scroll-ascend/20"
                      }`}
                    >
                      <div className="absolute bottom-0 left-0 w-full text-center text-xs text-muted-foreground">
                        {i + 1}
                      </div>
                      {eHourData?.currentEHour === i + 1 && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <div className={`w-4 h-4 rounded-full animate-pulse ${
                            i < 4 ? "bg-scroll-dawn" : 
                            i < 8 ? "bg-scroll-rise" : 
                            "bg-scroll-ascend"
                          }`}></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="absolute -top-6 left-0 w-full flex justify-between text-xs text-muted-foreground px-2">
                  <div>Sunrise</div>
                  <div>Sunset</div>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-scroll-dawn font-semibold">DAWN PHASE</div>
                  <div className="text-xs text-muted-foreground">eHours 1-4</div>
                </div>
                <div>
                  <div className="text-scroll-rise font-semibold">RISE PHASE</div>
                  <div className="text-xs text-muted-foreground">eHours 5-8</div>
                </div>
                <div>
                  <div className="text-scroll-ascend font-semibold">ASCEND PHASE</div>
                  <div className="text-xs text-muted-foreground">eHours 9-12</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScrollTimePage;
