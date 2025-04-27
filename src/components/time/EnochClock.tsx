
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CircleChevronUp, CalendarDays } from "lucide-react";
import { EnochTime } from "@/types/time";
import { useScrollTime } from "@/lib/scroll-time";

interface EnochClockProps {
  compact?: boolean;
  showCalendar?: boolean;
}

export function EnochClock({ compact = false, showCalendar = true }: EnochClockProps) {
  const { eHourData, loading, error } = useScrollTime();
  const [enochTime, setEnochTime] = useState<EnochTime>({
    eHour: 1,
    dayNumber: 1,
    week: 1,
    sabbathDay: false,
    phase: "dawn"
  });
  
  useEffect(() => {
    if (eHourData) {
      // Calculate the Enoch calendar based on current date
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
      
      // Adjust to 364-day calendar (52 weeks of 7 days)
      const adjustedDay = dayOfYear <= 364 ? dayOfYear : dayOfYear - 364;
      const week = Math.ceil(adjustedDay / 7);
      const sabbathDay = adjustedDay % 7 === 0;
      
      setEnochTime({
        eHour: eHourData.currentEHour,
        dayNumber: adjustedDay,
        week,
        sabbathDay,
        phase: getPhase(eHourData.currentEHour)
      });
    }
  }, [eHourData]);
  
  const getPhase = (hour: number): "dawn" | "rise" | "ascend" => {
    if (hour <= 4) return "dawn";
    if (hour <= 8) return "rise";
    return "ascend";
  };
  
  const getPhaseColor = () => {
    const phase = enochTime.phase;
    if (phase === "dawn") return "text-scroll-dawn";
    if (phase === "rise") return "text-scroll-rise";
    return "text-scroll-ascend";
  };
  
  if (loading || error) {
    return (
      <div className="text-muted-foreground text-sm">
        Loading solar time...
      </div>
    );
  }
  
  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <CircleChevronUp className={getPhaseColor()} size={16} />
        <span className={`text-sm ${getPhaseColor()}`}>
          eHour {enochTime.eHour}
        </span>
      </div>
    );
  }
  
  return (
    <Card className="p-4 bg-card/80 backdrop-blur-sm border border-border">
      <div className="flex items-center space-x-3 mb-2">
        <CircleChevronUp className={`h-5 w-5 ${getPhaseColor()}`} />
        <h3 className="text-sm font-medium">ENOCH Solar Time</h3>
      </div>
      
      <div className={`text-2xl font-bold mb-1 ${getPhaseColor()}`}>
        eHour {enochTime.eHour} <span className="text-sm font-normal">({enochTime.phase})</span>
      </div>
      
      {showCalendar && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>
            Day {enochTime.dayNumber} • Week {enochTime.week}
            {enochTime.sabbathDay && <span className="ml-1 text-justice-primary">• Sabbath</span>}
          </span>
        </div>
      )}
    </Card>
  );
}
