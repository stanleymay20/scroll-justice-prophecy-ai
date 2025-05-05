
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileLock, Mic, MicOff, Video, VideoOff, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { encryptWithScrollSeal } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [canRecord, setCanRecord] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    checkPermission();
    
    if (autoStart) {
      startRecording();
    }
    
    return () => {
      stopMediaTracks();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const checkPermission = async () => {
    try {
      const constraints = type === "audio" 
        ? { audio: true } 
        : { audio: true, video: true };
      
      await navigator.mediaDevices.getUserMedia(constraints);
      setHasPermission(true);
      setCanRecord(true);
    } catch (err) {
      console.error("Media permission error:", err);
      setHasPermission(false);
      setCanRecord(false);
    }
  };
  
  const startRecording = async () => {
    if (!canRecord) return;
    
    try {
      const constraints = type === "audio" 
        ? { audio: true } 
        : { audio: true, video: true };
        
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      recordedChunks.current = [];
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.current.push(e.data);
        }
      };
      
      mediaRecorder.current.onstop = saveRecording;
      
      mediaRecorder.current.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Log recording start in ScrollWitness logs
      await supabase
        .from('scroll_witness_logs')
        .insert({
          session_id: sessionId,
          user_id: userId,
          action: `${type}_recording_started`,
          details: `Started ${type} recording for court session`,
          timestamp: new Date().toISOString()
        });
    } catch (err) {
      console.error("Error starting recording:", err);
      toast({
        title: "Recording Failed",
        description: `Could not start ${type} recording. Please check permissions.`,
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      stopMediaTracks();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      setIsRecording(false);
    }
  };
  
  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  const saveRecording = async () => {
    try {
      if (recordedChunks.current.length > 0) {
        const recordingBlob = new Blob(recordedChunks.current, {
          type: type === "audio" ? "audio/webm" : "video/webm"
        });
        
        // Convert to base64 for encryption
        const reader = new FileReader();
        reader.readAsDataURL(recordingBlob);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          
          // Encrypt using ScrollSeal
          const { encryptedData, key } = await encryptWithScrollSeal(base64data);
          
          // Generate filename
          const timestamp = new Date().toISOString();
          const filename = `${sessionId}_${userId}_${type}_${timestamp}.bin`;
          
          // Upload encrypted file
          const { data: fileData, error: fileError } = await supabase
            .storage
            .from('court_recordings')
            .upload(filename, decode(encryptedData), {
              contentType: 'application/octet-stream'
            });
            
          if (fileError) throw fileError;
          
          // Create session recording record
          const { error: recordError } = await supabase
            .from('session_recordings')
            .insert({
              session_id: sessionId,
              user_id: userId,
              file_url: fileData?.path || filename,
              type,
              duration_seconds: recordingTime,
              created_at: timestamp,
              encrypted: true,
              encryption_key: key
            });
            
          if (recordError) throw recordError;
          
          // Log recording completion in ScrollWitness logs
          await supabase
            .from('scroll_witness_logs')
            .insert({
              session_id: sessionId,
              user_id: userId,
              action: `${type}_recording_saved`,
              details: `Saved encrypted ${type} recording (${formatTime(recordingTime)})`,
              timestamp: new Date().toISOString()
            });
            
          toast({
            title: "Recording Saved",
            description: `${type.charAt(0).toUpperCase() + type.slice(1)} recording secured with ScrollSeal encryption.`,
          });
        };
      }
    } catch (err) {
      console.error("Error saving recording:", err);
      toast({
        title: "Save Failed",
        description: `Could not save the ${type} recording.`,
        variant: "destructive"
      });
    }
  };
  
  // Helper functions
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const decode = (base64: string): Uint8Array => {
    const binaryString = window.atob(base64.split(',')[1]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };
  
  const getIcon = () => {
    if (type === "audio") {
      return isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />;
    } else if (type === "video") {
      return isRecording ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />;
    } else {
      return <FileText className="h-5 w-5" />;
    }
  };
  
  const getLabel = () => {
    if (isRecording) {
      return `Stop ${type} recording (${formatTime(recordingTime)})`;
    }
    return `Start ${type} recording`;
  };
  
  if (hasPermission === false) {
    return (
      <Card className="p-4 bg-muted/20">
        <div className="flex flex-col items-center justify-center">
          <FileLock className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-sm font-medium">Permission Required</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {`Please grant ${type === "audio" ? "microphone" : "camera"} access to record`}
          </p>
          <Button variant="outline" className="mt-4" onClick={checkPermission}>
            Request Permission
          </Button>
        </div>
      </Card>
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
        {getIcon()}
        <span>{getLabel()}</span>
      </Button>
      
      {isRecording && type === "audio" && (
        <div className="voice-wave mt-3 flex justify-center items-center h-8">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="h-8" style={{ animationDelay: `${i * 0.1}s` }}></span>
          ))}
        </div>
      )}
    </div>
  );
}
