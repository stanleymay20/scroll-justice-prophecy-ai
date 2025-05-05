
import React, { ReactNode } from "react";
import { Mic, MicOff, Video, VideoOff, FileText } from "lucide-react";

export function getRecordingIcon(type: "audio" | "video" | "transcript", isRecording: boolean): ReactNode {
  if (type === "audio") {
    return isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />;
  } else if (type === "video") {
    return isRecording ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />;
  } else {
    return <FileText className="h-5 w-5" />;
  }
}

export function getRecordingLabel(type: "audio" | "video" | "transcript", isRecording: boolean, formattedTime?: string): string {
  if (isRecording) {
    return `Stop ${type} recording${formattedTime ? ` (${formattedTime})` : ''}`;
  }
  return `Start ${type} recording`;
}
