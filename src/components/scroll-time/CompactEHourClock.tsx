
import { useScrollTime } from "@/lib/scroll-time";
import { CircleChevronUp } from "lucide-react";

export function CompactEHourClock() {
  const { eHourData, loading, error } = useScrollTime();
  
  // Determine the phase color based on the current eHour
  const getEHourPhaseColor = () => {
    if (!eHourData) return "text-scroll-dawn";
    
    const hour = eHourData.currentEHour;
    if (hour <= 4) return "text-scroll-dawn";
    if (hour <= 8) return "text-scroll-rise";
    return "text-scroll-ascend";
  };

  if (loading || error || !eHourData) {
    return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <CircleChevronUp size={16} />
        <span className="text-sm">--</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <CircleChevronUp className={getEHourPhaseColor()} size={16} />
      <span className={`text-sm ${getEHourPhaseColor()}`}>
        eHour {eHourData.currentEHour}
      </span>
    </div>
  );
}
