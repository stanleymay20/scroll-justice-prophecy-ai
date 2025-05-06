
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { AudioVerdictPlayerProps } from "@/types/petitions";

export function AudioVerdictPlayer({ audioUrl, onComplete }: AudioVerdictPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    // Set up audio element events
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onComplete) onComplete();
    });
    
    // Set initial volume
    audio.volume = volume;
    
    return () => {
      // Cleanup
      audio.pause();
      audio.src = "";
      audio.removeEventListener("loadedmetadata", () => {});
      audio.removeEventListener("timeupdate", () => {});
      audio.removeEventListener("ended", () => {});
    };
  }, [audioUrl, onComplete]);
  
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };
  
  const handleVolumeChange = (newVolume: number[]) => {
    if (!audioRef.current) return;
    
    const volumeValue = newVolume[0];
    audioRef.current.volume = volumeValue;
    setVolume(volumeValue);
    
    // If changing from zero, unmute
    if (volumeValue > 0 && isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    }
    
    // If changing to zero, mute
    if (volumeValue === 0 && !isMuted) {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };
  
  const handleTimeChange = (newTime: number[]) => {
    if (!audioRef.current) return;
    
    const timeValue = newTime[0];
    audioRef.current.currentTime = timeValue;
    setCurrentTime(timeValue);
  };
  
  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <div className="bg-black/20 rounded-md p-4 border border-justice-primary/20">
      <h3 className="text-sm font-medium text-justice-light/70 mb-2">Sacred Verdict Audio</h3>
      
      <div className="flex items-center gap-4 mb-3">
        <Button 
          variant="outline" 
          size="icon"
          className={isPlaying ? "bg-justice-primary/20" : ""}
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>
        
        <div className="flex-1">
          <Slider 
            defaultValue={[0]} 
            value={[currentTime]} 
            max={duration || 100}
            step={0.1}
            onValueChange={handleTimeChange} 
            className="my-2"
          />
          <div className="flex justify-between text-xs text-justice-light/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-24">
          <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </Button>
          <Slider 
            defaultValue={[0.75]} 
            value={[volume]} 
            max={1} 
            step={0.05}
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
      
      <p className="text-xs text-justice-light/50">
        This sacred verdict has been recorded by the Scroll Elder Judge and is immutably stored.
      </p>
    </div>
  );
}
