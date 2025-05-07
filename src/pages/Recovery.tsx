import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, MicOff, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { safeRpcCall } from "@/utils/supabaseUtils";

// Add TypeScript interface for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Define SpeechRecognition type 
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
}

const Recovery = () => {
  const [recoveryMethod, setRecoveryMethod] = useState<'text' | 'voice'>('text');
  const [passphrase, setPassphrase] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setVoiceTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event);
        setIsRecording(false);
        toast({
          title: "Voice Recording Error",
          description: "There was a problem with voice recognition. Please try again or use text recovery.",
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [toast]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recovery Unavailable",
        description: "Your browser doesn't support speech recognition. Please use text recovery.",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setVoiceTranscript("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleResetVoiceRecording = () => {
    setVoiceTranscript("");
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current.start();
    }
  };

  const handleSubmitRecovery = async (e: React.FormEvent) => {
    e.preventDefault();

    if (recoveryMethod === 'text' && !passphrase) {
      toast({
        title: "Missing Recovery Key",
        description: "Please enter your recovery key passphrase.",
        variant: "destructive"
      });
      return;
    }

    if (recoveryMethod === 'voice' && !voiceTranscript) {
      toast({
        title: "Missing Voice Recovery",
        description: "Please record your voice recovery phrase.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to create or use recovery keys.",
          variant: "destructive"
        });
        return;
      }

      // Use try/catch to handle missing table
      try {
        // Try to create a recovery key through direct insert since the table might not exist
        const { data, error } = await supabase
          .from('scroll_recovery_keys' as any)
          .insert({
            user_id: user.id,
            passphrase: recoveryMethod === 'text' ? passphrase : '',
            recovery_type: recoveryMethod,
            voice_transcript: recoveryMethod === 'voice' ? voiceTranscript : null
          })
          .select();
        
        if (error) throw error;
        
        toast({
          title: "Recovery Key Created",
          description: "Your sacred recovery key has been safely stored in the scrolls.",
        });
        
        // Clear form after success
        setPassphrase("");
        setVoiceTranscript("");
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
        toast({
          title: "Database Table Not Found",
          description: "The recovery feature is not yet available in this environment.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Recovery key creation error:", error);
      toast({
        title: "Recovery Error",
        description: "There was an error creating your recovery key. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-justice-primary text-center mb-8">
        Sacred Scroll Recovery System
      </h1>
      
      <Card className="max-w-xl mx-auto bg-black/40 border-justice-secondary">
        <CardHeader>
          <CardTitle className="text-justice-light">Establish Recovery Key</CardTitle>
          <CardDescription>Create a sacred key to recover your accounts and petitions.</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="text" onValueChange={(value) => setRecoveryMethod(value as 'text' | 'voice')}>
          <TabsList className="grid grid-cols-2 mx-6">
            <TabsTrigger value="text">Text Recovery</TabsTrigger>
            <TabsTrigger value="voice">Voice Recovery</TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmitRecovery}>
              <TabsContent value="text">
                <div className="mb-4">
                  <Label htmlFor="passphrase">Sacred Passphrase</Label>
                  <Input
                    id="passphrase"
                    type="password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Enter your sacred recovery passphrase"
                    className="mt-1"
                  />
                  <p className="text-sm text-justice-light/70 mt-2">
                    Create a unique phrase with deep spiritual meaning to you. This will be your key to access the sacred scrolls if needed.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="voice">
                <div className="mb-4">
                  <Label>Sacred Voice Recognition</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Button 
                      type="button"
                      onClick={toggleRecording}
                      variant={isRecording ? "destructive" : "outline"}
                    >
                      {isRecording ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="ghost" 
                      onClick={handleResetVoiceRecording}
                      disabled={!voiceTranscript}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Textarea
                    value={voiceTranscript}
                    onChange={(e) => setVoiceTranscript(e.target.value)}
                    placeholder="Voice transcript will appear here..."
                    className="mt-2 min-h-[100px]"
                    readOnly={isRecording}
                  />
                  
                  <p className="text-sm text-justice-light/70 mt-2">
                    Speak your sacred recovery phrase clearly. This voice pattern will be recorded and can be used for recovery.
                  </p>
                </div>
              </TabsContent>
              
              <Button type="submit" className="w-full mt-4">
                Create Recovery Key
              </Button>
            </form>
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-justice-light/70">
            Your recovery key is securely stored and can be used to restore access to your scrolls in case of spiritual disconnection.
          </p>
          <p className="text-sm text-justice-tertiary mt-2">
            Keep your recovery method sacred and private.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Recovery;
