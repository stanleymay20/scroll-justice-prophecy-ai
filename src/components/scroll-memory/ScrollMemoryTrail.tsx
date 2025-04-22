
import { ScrollMemory } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScrollMemoryTrailProps {
  memory: ScrollMemory;
  cases: Record<string, string>;
}

export function ScrollMemoryTrail({ memory, cases }: ScrollMemoryTrailProps) {
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "DAWN": return "bg-scroll-dawn/20 border-scroll-dawn text-scroll-dawn";
      case "RISE": return "bg-scroll-rise/20 border-scroll-rise text-scroll-rise";
      case "ASCEND": return "bg-scroll-ascend/10 border-scroll-ascend text-scroll-ascend";
      default: return "bg-justice-primary/20 border-justice-primary text-justice-primary";
    }
  };

  return (
    <Card className="bg-justice-dark text-white border-justice-tertiary">
      <CardHeader className="border-b border-justice-secondary/20">
        <div className="flex justify-between items-center">
          <CardTitle className="text-justice-light">Trail {memory.trail_id}</CardTitle>
          <Badge className={`${getPhaseColor(memory.scroll_phase)}`}>
            {memory.scroll_phase} - Gate {memory.gate}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Related Cases</h4>
          <div className="flex flex-wrap gap-2">
            {memory.case_ids.map((caseId) => (
              <Badge key={caseId} variant="outline" className="bg-justice-secondary/20">
                {cases[caseId] || caseId}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Principles</h4>
          <div className="flex flex-wrap gap-2">
            {memory.principles.map((principle) => (
              <Badge key={principle} className="bg-justice-primary/20">
                {principle}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Prophetic Insight</h4>
          <p className="text-sm italic border-l-2 border-justice-light pl-3 py-1">
            "{memory.prophetic_insight}"
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t border-justice-secondary/20 text-right">
        <div className="ml-auto text-sm text-muted-foreground">
          Confidence: <span className="font-semibold">{(memory.confidence * 100).toFixed(1)}%</span>
        </div>
      </CardFooter>
    </Card>
  );
}
