
import { ScrollPhase } from "@/types";

const mockScrollData = {
  currentPhase: "DAWN" as ScrollPhase,
  currentGate: 3,
  phaseProgress: 65
};

const getPhaseIcon = (phase: ScrollPhase) => {
  switch (phase) {
    case "DAWN":
      return "🌅";
    case "RISE":
      return "☀️";
    case "ASCEND":
      return "🌟";
    default:
      return "🌅";
  }
};

const getPhaseColor = (phase: ScrollPhase, current: ScrollPhase) => {
  if (phase === current) {
    switch (phase) {
      case "DAWN":
        return "text-yellow-400 bg-yellow-400/10";
      case "RISE":
        return "text-orange-400 bg-orange-400/10";
      case "ASCEND":
        return "text-purple-400 bg-purple-400/10";
    }
  }
  return "text-gray-400 bg-gray-400/10";
};

export function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <span className="font-semibold">ScrollJustice AI</span>
        </div>
        
        <div className="flex-1 p-4">
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-3">Scroll Phase Status</h3>
              <div className="space-y-2">
                {(["DAWN", "RISE", "ASCEND"] as ScrollPhase[]).map((phase) => (
                  <div key={phase} className={`flex items-center gap-2 p-2 rounded ${getPhaseColor(phase, mockScrollData.currentPhase)}`}>
                    <span>{getPhaseIcon(phase)}</span>
                    <span className="text-sm">{phase}</span>
                    {phase === mockScrollData.currentPhase && (
                      <span className="text-xs">Gate {mockScrollData.currentGate}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
