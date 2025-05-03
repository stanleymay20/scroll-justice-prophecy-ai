
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/language';

interface AudioVerdictPlayerProps {
  audioUrl: string;
  transcript?: string | null;
  className?: string;
}

export const AudioVerdictPlayer: React.FC<AudioVerdictPlayerProps> = ({ 
  audioUrl,
  transcript,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useLanguage();
  
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    const handleError = (e: Event) => {
      console.error('Audio loading error:', e);
      setIsLoading(false);
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Set initial volume
    audio.volume = volume;
    
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);
  
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newVolume = value[0];
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    
    if (newMuteState) {
      audioRef.current.volume = 0;
    } else {
      audioRef.current.volume = volume;
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={`${className} p-4 bg-black/30 rounded-md border border-justice-primary/30`}>
      <h3 className="text-lg font-medium text-white mb-3">
        {t("verdict.sealedVerdict")}
      </h3>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-justice-primary" />
            <span className="ml-2 text-justice-light">{t("verdict.loadingAudio")}</span>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={togglePlayPause} 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0 rounded-full"
              >
                {isPlaying ? 
                  <Pause className="h-4 w-4" /> : 
                  <Play className="h-4 w-4" />
                }
              </Button>
              
              <div className="flex-grow flex items-center space-x-2">
                <span className="text-xs text-justice-light/70 w-8">
                  {formatTime(currentTime)}
                </span>
                
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration}
                  step={0.1}
                  onValueChange={handleSliderChange}
                  className="flex-grow"
                />
                
                <span className="text-xs text-justice-light/70 w-8">
                  {formatTime(duration)}
                </span>
              </div>
              
              <div className="relative">
                <Button 
                  onClick={toggleMute} 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onMouseEnter={() => setShowVolumeControl(true)}
                  onMouseLeave={() => setShowVolumeControl(false)}
                >
                  {isMuted ? 
                    <VolumeX className="h-4 w-4" /> : 
                    <Volume2 className="h-4 w-4" />
                  }
                </Button>
                
                {showVolumeControl && (
                  <div 
                    className="absolute bottom-full right-0 mb-2 p-2 bg-black/80 rounded-md w-32"
                    onMouseEnter={() => setShowVolumeControl(true)}
                    onMouseLeave={() => setShowVolumeControl(false)}
                  >
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {transcript && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-justice-light mb-1">
                  {t("verdict.transcript")}:
                </h4>
                <p className="text-justice-light/90 text-sm whitespace-pre-wrap">
                  {transcript}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
