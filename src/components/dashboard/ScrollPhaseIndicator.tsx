
import { ScrollPhase, ScrollGate } from "@/types";
import { cn } from "@/lib/utils";

interface ScrollPhaseIndicatorProps {
  phase: ScrollPhase;
  gate: ScrollGate;
}

export function ScrollPhaseIndicator({ phase, gate }: ScrollPhaseIndicatorProps) {
  const getPhaseColor = (currentPhase: ScrollPhase, checkPhase: ScrollPhase) => {
    if (currentPhase === checkPhase) {
      switch (checkPhase) {
        case "DAWN": return "bg-scroll-dawn text-justice-dark";
        case "RISE": return "bg-scroll-rise text-justice-dark";
        case "ASCEND": return "bg-scroll-ascend text-justice-dark border border-justice-light";
      }
    }
    return "bg-justice-dark/50 text-muted-foreground";
  };

  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-justice-dark p-4 bg-justice-dark/10">
      <div className="text-lg font-semibold mb-3">Scroll Phase & Gate</div>
      <div className="flex mb-6">
        <div className={cn("flex-1 py-3 px-4 text-center font-semibold rounded-l-md", getPhaseColor(phase, "DAWN"))}>
          DAWN
        </div>
        <div className={cn("flex-1 py-3 px-4 text-center font-semibold", getPhaseColor(phase, "RISE"))}>
          RISE
        </div>
        <div className={cn("flex-1 py-3 px-4 text-center font-semibold rounded-r-md", getPhaseColor(phase, "ASCEND"))}>
          ASCEND
        </div>
      </div>
      
      <div className="text-lg font-semibold mb-3">Gate</div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5, 6, 7].map((g) => (
          <div 
            key={g}
            className={cn(
              "flex-1 py-2 text-center rounded-md font-semibold", 
              g === gate ? "bg-justice-primary text-white" : "bg-justice-dark/20 text-muted-foreground"
            )}
          >
            {g}
          </div>
        ))}
      </div>
    </div>
  );
}
