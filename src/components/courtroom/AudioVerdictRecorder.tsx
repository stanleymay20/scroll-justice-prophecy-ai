
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Loader2, Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { uploadAudioVerdict } from '@/services/evidenceService';
import { useLanguage } from '@/contexts/language';
import { logAIInteraction } from '@/services/aiAuditService';
import { supabase } from '@/integrations/supabase/client';

interface AudioVerdictRecorderProps {
  petitionId: string;
  onVerdictRecorded: () => void;
}

export const AudioVerdictRecorder: React.FC<AudioVerdictRecorderProps> = ({ 
  petitionId,
  onVerdictRecorded
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recordingLimitExceeded, setRecordingLimitExceeded] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useLanguage();
  
  const MAX_RECORDING_TIME = 120; // 2 minutes in seconds
  
  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Reset state
      setRecordedChunks([]);
      setAudioURL(null);
      setTranscription(null);
      setElapsedTime(0);
      setRecordingLimitExceeded(false);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      
      mediaRecorder.onstop = () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        
        const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start the recorder
      mediaRecorder.start();
      setIsRecording(true);
      
      // Set up timer
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= MAX_RECORDING_TIME) {
            stopRecording();
            setRecordingLimitExceeded(true);
            return MAX_RECORDING_TIME;
          }
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: t("recorder.permissionDenied"),
        description: t("recorder.microphoneAccess"),
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsTranscribing(true);
      
      // Create a form data object to send the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob, 'verdict.webm');
      
      // Call the transcription service
      const response = await fetch('https://rgstpbaljoamkhjhomzp.supabase.co/functions/v1/transcribe-audio', {
        method: 'POST',
        body: formData,
        headers: {
          // No Content-Type header, it will be set automatically with the boundary for multipart/form-data
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTranscription(data.text);
      
      // Log AI interaction for the transcription
      await logAIInteraction({
        action_type: "AUDIO_TRANSCRIPTION",
        ai_model: "whisper-1",
        input_summary: `Audio verdict for petition ${petitionId.substring(0, 8)}`,
        output_summary: data.text.substring(0, 100) + (data.text.length > 100 ? '...' : '')
      });
      
      return data.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        title: t("recorder.transcriptionFailed"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
      return null;
    } finally {
      setIsTranscribing(false);
    }
  };
  
  const uploadVerdict = async () => {
    if (!audioURL || recordedChunks.length === 0) {
      toast({
        title: t("recorder.noRecording"),
        description: t("recorder.pleaseRecord"),
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Combine recorded chunks into a single blob
      const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
      
      // Transcribe the audio if not already done
      let textTranscription = transcription;
      if (!textTranscription) {
        textTranscription = await transcribeAudio(audioBlob);
      }
      
      // Upload the audio verdict
      await uploadAudioVerdict(petitionId, audioBlob, textTranscription);
      
      toast({
        title: t("recorder.verdictUploaded"),
        description: t("recorder.verdictSaved"),
      });
      
      // Notify parent component
      onVerdictRecorded();
    } catch (error) {
      console.error('Error uploading verdict:', error);
      toast({
        title: t("recorder.uploadFailed"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-white">
          {t("recorder.audioVerdict")}
        </h3>
        
        {elapsedTime > 0 && (
          <div className={`px-2 py-1 rounded text-sm ${
            elapsedTime >= MAX_RECORDING_TIME ? 'bg-red-500/20 text-red-300' : 'bg-justice-primary/20 text-justice-light'
          }`}>
            {formatTime(elapsedTime)} / {formatTime(MAX_RECORDING_TIME)}
          </div>
        )}
      </div>
      
      {recordingLimitExceeded && (
        <div className="flex items-center gap-2 p-2 bg-yellow-500/20 text-yellow-300 rounded-md text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>{t("recorder.maxTimeReached")}</span>
        </div>
      )}
      
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-2">
          {!isRecording && !audioURL && (
            <Button 
              onClick={startRecording} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Mic className="h-4 w-4 mr-2" />
              {t("recorder.startRecording")}
            </Button>
          )}
          
          {isRecording && (
            <Button 
              onClick={stopRecording} 
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              <Square className="h-4 w-4 mr-2" />
              {t("recorder.stopRecording")}
            </Button>
          )}
          
          {audioURL && (
            <Button 
              onClick={handlePlayPause} 
              variant="outline"
            >
              <Play className="h-4 w-4 mr-2" />
              {isPlaying ? t("recorder.pause") : t("recorder.play")}
            </Button>
          )}
        </div>
        
        {audioURL && (
          <div className="space-y-4">
            <audio 
              ref={audioRef}
              src={audioURL} 
              onEnded={handleAudioEnded} 
              className="hidden" 
            />
            
            {isTranscribing && (
              <div className="flex items-center space-x-2 text-justice-light">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("recorder.transcribing")}</span>
              </div>
            )}
            
            {transcription && (
              <div className="p-3 bg-black/30 border border-justice-primary/20 rounded-md">
                <h4 className="text-sm font-medium text-justice-light mb-1">
                  {t("recorder.transcription")}:
                </h4>
                <p className="text-justice-light/90 text-sm whitespace-pre-wrap">
                  {transcription}
                </p>
              </div>
            )}
            
            <Button
              onClick={uploadVerdict}
              disabled={isUploading}
              className="w-full bg-justice-tertiary hover:bg-justice-tertiary/80"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("recorder.uploading")}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {t("recorder.sealVerdict")}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
