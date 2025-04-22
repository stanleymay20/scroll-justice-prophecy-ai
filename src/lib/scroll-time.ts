
import { useState, useEffect } from 'react';

// Interface for the sunrise-sunset API response
interface SunriseSunsetResponse {
  results: {
    sunrise: string;
    sunset: string;
    solar_noon: string;
    day_length: number; // in seconds
  };
  status: string;
}

// Interface for eHour data
export interface EHourData {
  currentEHour: number;
  totalEHours: number;
  eHourDurationMinutes: number;
  remainingMinutes: number;
  remainingSeconds: number;
  progress: number;
  sunriseTime: Date | null;
  sunsetTime: Date | null;
}

// Function to fetch sunrise and sunset times for a given location
export async function fetchSunriseSunset(
  latitude: number, 
  longitude: number
): Promise<SunriseSunsetResponse> {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${dateStr}&formatted=0`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sunrise/sunset data:", error);
    throw error;
  }
}

// Convert UTC time string from API to local Date object
function convertToLocalTime(utcTimeStr: string): Date {
  const utcDate = new Date(utcTimeStr);
  return utcDate;
}

// Calculate eHour data based on sunrise, sunset, and current time
export function calculateEHourData(
  sunriseTime: Date | null,
  sunsetTime: Date | null,
  currentTime: Date
): EHourData {
  // Default values in case something goes wrong
  const defaultEHourData: EHourData = {
    currentEHour: 6,
    totalEHours: 12,
    eHourDurationMinutes: 60,
    remainingMinutes: 30,
    remainingSeconds: 0,
    progress: 0.5,
    sunriseTime,
    sunsetTime
  };
  
  // If we don't have sunrise or sunset time, return defaults
  if (!sunriseTime || !sunsetTime) {
    return defaultEHourData;
  }
  
  try {
    // Calculate the scroll day duration in milliseconds
    const scrollDayDuration = sunsetTime.getTime() - sunriseTime.getTime();
    
    // Each day has 12 eHours
    const totalEHours = 12;
    
    // Calculate eHour duration in milliseconds
    const eHourDuration = scrollDayDuration / totalEHours;
    const eHourDurationMinutes = Math.round(eHourDuration / (1000 * 60));
    
    // Check if current time is within scroll day
    if (currentTime < sunriseTime) {
      // Before sunrise - night time, use the last eHour
      return {
        ...defaultEHourData,
        currentEHour: 12,
        remainingMinutes: Math.floor((sunriseTime.getTime() - currentTime.getTime()) / (1000 * 60)),
        remainingSeconds: Math.floor(((sunriseTime.getTime() - currentTime.getTime()) / 1000) % 60),
        progress: 1.0
      };
    } else if (currentTime > sunsetTime) {
      // After sunset - night time, use the last eHour
      return {
        ...defaultEHourData,
        currentEHour: 12,
        remainingMinutes: 0,
        remainingSeconds: 0,
        progress: 1.0
      };
    }
    
    // Calculate elapsed time since sunrise
    const elapsedSinceSunrise = currentTime.getTime() - sunriseTime.getTime();
    
    // Calculate which eHour we're in (1-indexed)
    const currentEHourIndex = Math.floor(elapsedSinceSunrise / eHourDuration);
    const currentEHour = currentEHourIndex + 1; // 1-indexed
    
    // Calculate remaining time in current eHour
    const elapsedInCurrentEHour = elapsedSinceSunrise % eHourDuration;
    const remainingInCurrentEHour = eHourDuration - elapsedInCurrentEHour;
    const remainingMinutes = Math.floor(remainingInCurrentEHour / (1000 * 60));
    const remainingSeconds = Math.floor((remainingInCurrentEHour / 1000) % 60);
    
    // Calculate progress through current eHour (0.0 to 1.0)
    const progress = elapsedInCurrentEHour / eHourDuration;
    
    return {
      currentEHour,
      totalEHours,
      eHourDurationMinutes,
      remainingMinutes,
      remainingSeconds,
      progress,
      sunriseTime,
      sunsetTime
    };
  } catch (error) {
    console.error("Error calculating eHour data:", error);
    return defaultEHourData;
  }
}

// Hook to get the user's location
export function useUserLocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // First try to get the user's actual location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          console.warn("Geolocation error:", err);
          setError("Could not access location. Using default.");
          // Use a default location (New York)
          setLocation({ latitude: 40.7128, longitude: -74.0060 });
        }
      );
    } else {
      setError("Geolocation is not supported by this browser. Using default.");
      // Use a default location (New York)
      setLocation({ latitude: 40.7128, longitude: -74.0060 });
    }
  }, []);
  
  return { location, error };
}

// Hook to get current eHour data
export function useScrollTime() {
  const { location, error: locationError } = useUserLocation();
  const [sunData, setSunData] = useState<{
    sunrise: Date | null;
    sunset: Date | null;
  }>({
    sunrise: null,
    sunset: null
  });
  const [eHourData, setEHourData] = useState<EHourData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(locationError);
  
  // Fetch sunrise/sunset when location is available
  useEffect(() => {
    if (location) {
      setLoading(true);
      fetchSunriseSunset(location.latitude, location.longitude)
        .then((data) => {
          if (data.status === "OK") {
            setSunData({
              sunrise: convertToLocalTime(data.results.sunrise),
              sunset: convertToLocalTime(data.results.sunset)
            });
          } else {
            throw new Error("Failed to fetch sunrise/sunset data");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          setError("Failed to fetch sun data. Using defaults.");
          
          // Use default sunrise/sunset times (6 AM to 6 PM)
          const today = new Date();
          const sunrise = new Date(today);
          sunrise.setHours(6, 0, 0, 0);
          
          const sunset = new Date(today);
          sunset.setHours(18, 0, 0, 0);
          
          setSunData({ sunrise, sunset });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location]);
  
  // Update eHour data every second
  useEffect(() => {
    if (!sunData.sunrise || !sunData.sunset) return;
    
    const updateEHourData = () => {
      const now = new Date();
      const data = calculateEHourData(sunData.sunrise, sunData.sunset, now);
      setEHourData(data);
    };
    
    // Update immediately
    updateEHourData();
    
    // Then update every second
    const intervalId = setInterval(updateEHourData, 1000);
    
    return () => clearInterval(intervalId);
  }, [sunData.sunrise, sunData.sunset]);
  
  return { eHourData, loading, error };
}
