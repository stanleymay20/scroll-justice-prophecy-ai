
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { encryptWithScrollSeal } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

interface UseMediaRecordingProps {
  sessionId: string;
  userId: string;
  type: "audio" | "video" | "transcript";
  autoStart?: boolean;
}

export function useMediaRecording({
  sessionId,
  userId,
  type,
  autoStart = false
}: UseMediaRecordingProps) {
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
      
      // Log recording start in ScrollWitness logs with proper type assertion
      const logData = {
        session_id: sessionId,
        user_id: userId,
        action: `${type}_recording_started`,
        details: `Started ${type} recording for court session`,
        timestamp: new Date().toISOString()
      } as Database["public"]["Tables"]["scroll_witness_logs"]["Insert"];
      
      await supabase
        .from('scroll_witness_logs')
        .insert([logData]);
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
          
          // Create session recording record with proper type assertion
          const recordingData = {
            session_id: sessionId,
            user_id: userId,
            file_url: fileData?.path || filename,
            type,
            duration_seconds: recordingTime,
            created_at: timestamp,
            encrypted: true,
            encryption_key: key
          } as Database["public"]["Tables"]["session_recordings"]["Insert"];
          
          const { error: recordError } = await supabase
            .from('session_recordings')
            .insert([recordingData]);
            
          if (recordError) throw recordError;
          
          // Log recording completion in ScrollWitness logs with proper type assertion
          const logData = {
            session_id: sessionId,
            user_id: userId,
            action: `${type}_recording_saved`,
            details: `Saved encrypted ${type} recording (${formatTime(recordingTime)})`,
            timestamp: new Date().toISOString()
          } as Database["public"]["Tables"]["scroll_witness_logs"]["Insert"];
          
          await supabase
            .from('scroll_witness_logs')
            .insert([logData]);
            
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

  // Helper function to decode base64 for storage
  const decode = (base64: string): Uint8Array => {
    const binaryString = window.atob(base64.split(',')[1]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Helper function to format time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    isRecording,
    recordingTime,
    canRecord,
    hasPermission,
    checkPermission,
    startRecording,
    stopRecording,
    formatTime
  };
}
