
import { CSSProperties } from "react";

interface AudioVisualizerProps {
  isVisible: boolean;
}

export function AudioVisualizer({ isVisible }: AudioVisualizerProps) {
  if (!isVisible) return null;
  
  return (
    <div className="voice-wave mt-3 flex justify-center items-center h-8">
      {[...Array(5)].map((_, i) => (
        <span 
          key={i} 
          className="h-8" 
          style={{ animationDelay: `${i * 0.1}s` } as CSSProperties}
        />
      ))}
    </div>
  );
}
