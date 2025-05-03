
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CalendarIcon, HourglassIcon, ArrowRightCircle } from 'lucide-react';

// Constants for the scroll calendar
const SCROLL_GATES = [
  'Dawn', 'Morning', 'Midday', 'Afternoon', 
  'Evening', 'Dusk', 'Midnight', 'Deep Night'
];

const SCROLL_DAYS = [
  'Phoenix', 'Dragon', 'Tiger', 'Serpent', 
  'Horse', 'Ram', 'Monkey', 'Rooster', 
  'Dog', 'Boar', 'Rat', 'Ox'
];

export function ScrollCalendar() {
  const [scrollDay, setScrollDay] = useState('');
  const [scrollGate, setScrollGate] = useState('');
  const [solarHour, setSolarHour] = useState('');
  const [gateCloseTime, setGateCloseTime] = useState('');
  const [countdown, setCountdown] = useState('');
  
  useEffect(() => {
    updateScrollTime();
    const interval = setInterval(updateScrollTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const updateScrollTime = () => {
    const now = new Date();
    
    // Calculate Scroll Day (based on month and day)
    const dayOfYear = getDayOfYear(now);
    const scrollDayIndex = Math.floor((dayOfYear % 365) / 30.5) % SCROLL_DAYS.length;
    setScrollDay(SCROLL_DAYS[scrollDayIndex]);
    
    // Calculate Scroll Gate (based on time of day)
    const hour = now.getHours();
    const scrollGateIndex = Math.floor(hour / 3) % SCROLL_GATES.length;
    setScrollGate(SCROLL_GATES[scrollGateIndex]);
    
    // Calculate Solar Hour (1-12, based on daylight hours)
    const solarHourNum = ((hour + 11) % 12) + 1;
    setSolarHour(solarHourNum.toString());
    
    // Calculate Gate Close Time and Countdown
    const nextGateHour = (Math.floor(hour / 3) + 1) * 3;
    const nextGateTime = new Date(now);
    nextGateTime.setHours(nextGateHour, 0, 0, 0);
    
    // Format gate close time
    const closeTimeHour = nextGateHour % 24;
    const ampm = closeTimeHour < 12 ? 'AM' : 'PM';
    const formattedHour = closeTimeHour % 12 || 12;
    setGateCloseTime(`${formattedHour}:00 ${ampm}`);
    
    // Calculate countdown
    const diffMs = nextGateTime.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    setCountdown(`${diffHrs}h ${diffMins}m`);
  };
  
  // Helper function to get day of year (0-365)
  const getDayOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };
  
  return (
    <Card className="bg-gradient-to-br from-justice-dark to-black border-justice-primary/30 p-4">
      <h3 className="text-lg font-medium text-white mb-3">Sacred Scroll Calendar</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-justice-primary/20">
            <CalendarIcon className="h-5 w-5 text-justice-primary" />
          </div>
          <div>
            <p className="text-xs text-justice-light/70">Scroll Day</p>
            <p className="text-sm font-medium text-white">{scrollDay}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-justice-primary/20">
            <ArrowRightCircle className="h-5 w-5 text-justice-primary" />
          </div>
          <div>
            <p className="text-xs text-justice-light/70">Gate Name</p>
            <p className="text-sm font-medium text-white">{scrollGate}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-justice-primary/20">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-justice-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-justice-light/70">Solar Hour</p>
            <p className="text-sm font-medium text-white">{solarHour}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-justice-primary/20">
            <HourglassIcon className="h-5 w-5 text-justice-primary" />
          </div>
          <div>
            <p className="text-xs text-justice-light/70">Gate Closes</p>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-white">{gateCloseTime}</p>
              <span className="text-xs text-justice-light/60">({countdown})</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
