
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { TraditionalTime } from "@/types/time";

interface TraditionalClockProps {
  compact?: boolean;
  showDate?: boolean;
}

export function TraditionalClock({ compact = false, showDate = true }: TraditionalClockProps) {
  const [time, setTime] = useState<TraditionalTime>({
    hour: 0,
    minute: 0,
    second: 0,
    day: 1,
    month: 1,
    year: 2025,
    dayOfWeek: 0
  });
  
  useEffect(() => {
    // Update time immediately
    updateTime();
    
    // Then update every second
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const updateTime = () => {
    const now = new Date();
    setTime({
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds(),
      day: now.getDate(),
      month: now.getMonth() + 1, // JavaScript months are 0-indexed
      year: now.getFullYear(),
      dayOfWeek: now.getDay()
    });
  };
  
  const formatTime = (hour: number, minute: number, second: number) => {
    const h = hour < 10 ? `0${hour}` : hour;
    const m = minute < 10 ? `0${minute}` : minute;
    const s = second < 10 ? `0${second}` : second;
    return `${h}:${m}:${s}`;
  };
  
  const formatDate = (day: number, month: number, year: number, dayOfWeek: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    return `${days[dayOfWeek]}, ${months[month - 1]} ${day}, ${year}`;
  };
  
  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {formatTime(time.hour, time.minute, time.second)}
        </span>
      </div>
    );
  }
  
  return (
    <Card className="p-4 bg-card border border-border">
      <div className="flex items-center space-x-3 mb-2">
        <Clock className="h-5 w-5 text-justice-primary" />
        <h3 className="text-sm font-medium">Traditional Time</h3>
      </div>
      
      <div className="text-2xl font-bold mb-1">
        {formatTime(time.hour, time.minute, time.second)}
      </div>
      
      {showDate && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>{formatDate(time.day, time.month, time.year, time.dayOfWeek)}</span>
        </div>
      )}
    </Card>
  );
}
