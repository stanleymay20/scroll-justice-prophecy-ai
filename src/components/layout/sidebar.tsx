
import { cn } from "@/lib/utils";
import { ScrollPhase, ScrollGate } from "@/types";

interface SidebarProps {
  currentPhase?: ScrollPhase;
  currentGate?: ScrollGate;
  className?: string;
}

export function Sidebar({ currentPhase = "DAWN", currentGate = 3, className }: SidebarProps) {
  return (
    <div className={cn("w-64 bg-justice-dark border-r border-justice-tertiary p-4", className)}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Scroll Status</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Phase:</span>
            <span className="text-sm font-medium text-white">{currentPhase}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Gate:</span>
            <span className="text-sm font-medium text-white">{currentGate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
