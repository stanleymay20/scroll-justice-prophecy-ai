
import { Button } from "@/components/ui/button";
import { useMediaRecording } from "@/hooks/useMediaRecording";
import { getRecordingIcon, getRecordingLabel } from "@/utils/mediaUtils";
import { AudioVisualizer } from "./recording/AudioVisualizer";
import { PermissionRequest } from "./recording/PermissionRequest";

interface SessionRecordingProps {
  sessionId: string;
  userId: string;
  type?: "audio" | "video" | "transcript";
  autoStart?: boolean;
}

export function SessionRecording({ 
  sessionId, 
  userId, 
  type = "audio",
  autoStart = false
}: SessionRecordingProps) {
  const {
    isRecording,
    recordingTime,
    canRecord,
    hasPermission,
    checkPermission,
    startRecording,
    stopRecording,
    formatTime
  } = useMediaRecording({
    sessionId,
    userId,
    type,
    autoStart
  });

  if (hasPermission === false) {
    return (
      <PermissionRequest 
        mediaType={type} 
        onRequestPermission={checkPermission} 
      />
    );
  }
  
  return (
    <div>
      <Button
        variant={isRecording ? "destructive" : "secondary"}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={!canRecord}
        className="gap-2"
      >
        {getRecordingIcon(type, isRecording)}
        <span>{getRecordingLabel(type, isRecording, formatTime(recordingTime))}</span>
      </Button>
      
      <AudioVisualizer isVisible={isRecording && type === "audio"} />
    </div>
  );
}
