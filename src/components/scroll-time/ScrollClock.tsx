
import { useEffect, useState } from "react";
import { useScrollTime } from "@/lib/scroll-time";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CircleChevronUp, Clock, Sun } from "lucide-react";

interface ScrollClockProps {
  className?: string;
  showDetails?: boolean;
}

export function ScrollClock({ className = "", showDetails = true }: ScrollClockProps) {
  const { eHourData, loading, error } = useScrollTime();
  const [transitioning, setTransitioning] = useState(false);
  const [lastEHour, setLastEHour] = useState<number | null>(null);
  const [scrollDay, setScrollDay] = useState(1);
  const [gateName, setGateName] = useState("Dawn Gate of Truth");
  const [gateClosingTime, setGateClosingTime] = useState<Date | null>(null);

  // Calculate Scroll days based on current date
  useEffect(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    
    // In Scroll Time, we use a 364-day calendar (52 weeks of 7 days)
    const adjustedDay = dayOfYear <= 364 ? dayOfYear : dayOfYear - 364;
    setScrollDay(adjustedDay);
    
    // Determine gate name based on the day of year
    const gates = [
      "Dawn Gate of Truth",
      "Light Gate of Wisdom",
      "Sun Gate of Justice",
      "Fire Gate of Righteousness",
      "Star Gate of Unity",
      "Moon Gate of Mercy",
      "Water Gate of Life"
    ];
    
    const gateIndex = Math.floor(adjustedDay % 7);
    setGateName(gates[gateIndex]);
    
    // Calculate gate closing time (next midnight)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    setGateClosingTime(tomorrow);
  }, []);

  // Track eHour changes for transition effects
  useEffect(() => {
    if (!eHourData) return;
    
    if (lastEHour !== null && lastEHour !== eHourData.currentEHour) {
      setTransitioning(true);
      const timer = setTimeout(() => setTransitioning(false), 2000);
      return () => clearTimeout(timer);
    }
    
    setLastEHour(eHourData.currentEHour);
  }, [eHourData?.currentEHour, lastEHour]);

  // Determine the phase color based on the current eHour
  const getEHourPhaseColor = () => {
    if (!eHourData) return "bg-scroll-dawn";
    
    const hour = eHourData.currentEHour;
    if (hour <= 4) return "bg-scroll-dawn text-justice-dark";
    if (hour <= 8) return "bg-scroll-rise text-justice-dark";
    return "bg-scroll-ascend text-white";
  };

  const getEHourPhaseName = () => {
    if (!eHourData) return "DAWN";
    
    const hour = eHourData.currentEHour;
    if (hour <= 4) return "DAWN";
    if (hour <= 8) return "RISE";
    return "ASCEND";
  };

  const formatCountdown = () => {
    if (!gateClosingTime) return "Loading...";
    
    const now = new Date();
    const diff = gateClosingTime.getTime() - now.getTime();
    
    if (diff <= 0) return "Gate Closing Imminent";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const eHourPhaseColor = getEHourPhaseColor();
  const eHourPhaseName = getEHourPhaseName();

  // If loading, show a placeholder
  if (loading) {
    return (
      <Card className={`border-justice-tertiary bg-justice-dark/50 ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-justice-light">Scroll Time</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="animate-pulse flex flex-col items-center w-full">
            <div className="h-16 w-16 rounded-full bg-justice-dark/70 mb-4"></div>
            <div className="h-4 w-24 bg-justice-dark/70 rounded mb-2"></div>
            <div className="h-3 w-32 bg-justice-dark/70 rounded mb-4"></div>
            <div className="h-2 w-full bg-justice-dark/70 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If there's an error or no data, show an error state
  if (error || !eHourData) {
    return (
      <Card className={`border-justice-tertiary bg-justice-dark/50 ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-justice-light">Scroll Time</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>Unable to calculate Scroll Time</p>
          <p className="text-xs mt-1">{error || "Unknown error"}</p>
        </CardContent>
      </Card>
    );
  }

  // Normal state with data
  return (
    <Card className={`border-justice-tertiary bg-justice-dark/50 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-justice-light flex justify-between items-center">
          <span>Scroll Time</span>
          <span className={`text-sm ${eHourPhaseColor.includes("bg-") ? eHourPhaseColor.replace("bg-", "text-") : eHourPhaseColor}`}>
            {eHourPhaseName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div 
            className={`relative w-20 h-20 rounded-full mb-2 flex items-center justify-center ${eHourPhaseColor} ${transitioning ? "animate-pulse" : ""}`}
          >
            <CircleChevronUp className="absolute w-full h-full opacity-20" />
            <span className="text-2xl font-bold">
              {eHourData.currentEHour}
            </span>
          </div>
          
          <div className="text-center mb-3">
            <div className="text-lg font-semibold">eHour {eHourData.currentEHour}</div>
            <div className="text-sm text-muted-foreground">
              {eHourData.remainingMinutes}:{eHourData.remainingSeconds.toString().padStart(2, '0')} remaining
            </div>
          </div>
          
          <Progress 
            value={eHourData.progress * 100} 
            className={`w-full h-2 ${eHourPhaseColor.includes("bg-") ? eHourPhaseColor : ""}`}
          />
          
          <div className="w-full mt-6 pt-4 border-t border-justice-primary/20">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Sun className="h-4 w-4 mr-1 text-justice-tertiary" />
                <span className="text-sm font-medium">Scroll Day {scrollDay}</span>
              </div>
              <div className="text-sm font-medium text-justice-light">{gateName}</div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-justice-secondary" />
                <span className="text-xs">ENano Pulse: {Math.floor(Math.random() * 1000) + 1000}</span>
              </div>
              <div className="text-xs text-justice-secondary">Gate Closing: {formatCountdown()}</div>
            </div>
          </div>
          
          {showDetails && (
            <div className="w-full mt-4 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Sunrise: {eHourData.sunriseTime?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <span>Sunset: {eHourData.sunsetTime?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="text-center mt-1">
                eHour Duration: ~{eHourData.eHourDurationMinutes} minutes
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
