
import { mainNavItems, SidebarNav } from "@/components/ui/sidebar-nav";
import { ScrollPhase, ScrollGate } from "@/types";

interface SidebarProps {
  currentPhase: ScrollPhase;
  currentGate: ScrollGate;
}

export function Sidebar({ currentPhase, currentGate }: SidebarProps) {
  // Get background color based on current phase
  const getPhaseColor = (phase: ScrollPhase) => {
    switch (phase) {
      case "DAWN":
        return "bg-gradient-to-b from-scroll-dawn/30 to-justice-dark";
      case "RISE":
        return "bg-gradient-to-b from-scroll-rise/30 to-justice-dark";
      case "ASCEND":
        return "bg-gradient-to-b from-scroll-ascend/30 to-justice-dark";
      default:
        return "bg-gradient-to-b from-scroll-dawn/30 to-justice-dark";
    }
  };

  // Get text color based on current phase
  const getPhaseTextColor = (phase: ScrollPhase) => {
    switch (phase) {
      case "DAWN":
        return "text-scroll-dawn";
      case "RISE":
        return "text-scroll-rise";
      case "ASCEND":
        return "text-scroll-ascend";
      default:
        return "text-scroll-dawn";
    }
  };

  return (
    <div className={`${getPhaseColor(currentPhase)} border-r border-justice-dark min-h-screen w-64 px-4 py-8 flex flex-col`}>
      <div className="flex items-center justify-center mb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-justice-light">FastTrackJusticeAI</h1>
          <div className={`text-sm mt-2 font-medium ${getPhaseTextColor(currentPhase)}`}>
            {currentPhase} - Gate {currentGate}
          </div>
        </div>
      </div>
      
      <SidebarNav items={mainNavItems} className="px-2" />
      
      <div className="mt-auto pt-6 border-t border-justice-dark/30">
        <div className="flex flex-col items-center px-4 py-2">
          <div className="text-sm text-muted-foreground">Scroll Founder</div>
          <div className="text-xs text-muted-foreground mt-1">Stanley (Gate 7)</div>
          <div className="text-xs text-muted-foreground mt-1">Divine Architecture</div>
        </div>
      </div>
    </div>
  );
}
