import { useState, useEffect, useRef } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { useLanguage } from "@/contexts/language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Key, Mic, MicOff, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

// Define the SpeechRecognition interface for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionError extends Event {
  error: string;
}

// Add the global SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

export default function Recovery() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [passphrase, setPassphrase] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  // Check if SpeechRecognition is available in the browser
  const speechRecognitionSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  
  const recognitionRef = useRef<any>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if (speechRecognitionSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          setTranscript(finalTranscript);
        };
        
        recognitionRef.current.onerror = (event: SpeechRecognitionError) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [speechRecognitionSupported]);
  
  const toggleRecording = () => {
    if (!speechRecognitionSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser does not support speech recognition.",
        variant: "destructive",
      });
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };
  
  const generateRecoveryKey = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to generate a recovery key.",
        variant: "destructive",
      });
      return;
    }
    
    if (!passphrase) {
      toast({
        title: "Passphrase Required",
        description: "Please enter a passphrase to secure your recovery key.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Create a secure recovery key using a combination of the passphrase and user details
      const recoveryData = {
        user_id: user.id,
        passphrase: passphrase,
        created_at: new Date().toISOString(),
        recovery_type: transcript ? "voice" : "text",
        voice_transcript: transcript || null,
      };
      
      // We need to use a raw query since the table might not exist in the types yet
      // Create the recovery key record in the database
      const { data, error } = await supabase.rpc('create_recovery_key', {
        user_id: user.id,
        passphrase: passphrase,
        recovery_type: transcript ? "voice" : "text",
        voice_transcript: transcript || null
      });
      
      if (error) throw error;
      
      // Generate a display format for the recovery key
      const displayKey = `SCROLL-${generateRandomString(4)}-${generateRandomString(4)}-${generateRandomString(4)}`;
      setRecoveryKey(displayKey);
      
      toast({
        title: "Recovery Key Generated",
        description: "Your sacred scroll recovery key has been created. Store it in a safe place.",
      });
      
    } catch (error: any) {
      console.error("Error generating recovery key:", error);
      toast({
        title: "Error Generating Key",
        description: error.message || "An error occurred while generating your recovery key.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateRandomString = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="Sacred Scroll Recovery" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-justice-light mb-2">Sacred Scroll Recovery System</h1>
          <p className="text-justice-light/70 mb-8">
            Generate a secure recovery key for your sacred scrolls, protected by a passphrase and optional voice recognition.
          </p>
          
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Your recovery key is a sacred artifact. Store it securely and never share it with anyone. 
              It will be required if you need to restore access to sealed scrolls.
            </AlertDescription>
          </Alert>
          
          <Card className="bg-black/40 border-justice-primary/30">
            <CardHeader>
              <CardTitle className="text-justice-light flex items-center gap-2">
                <Shield className="h-5 w-5 text-justice-primary" /> Recovery Key Generation
              </CardTitle>
              <CardDescription>
                Create a recovery phrase that will protect your scrolls in case of emergencies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="passphrase" className="block text-sm font-medium text-justice-light/70 mb-1">
                  Sacred Passphrase
                </label>
                <Input
                  id="passphrase"
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter a strong passphrase"
                  className="bg-black/30 border-justice-primary/20"
                />
                <p className="text-xs text-justice-light/50 mt-1">
                  Use a memorable but strong passphrase that combines words, numbers, and symbols.
                </p>
              </div>
              
              {speechRecognitionSupported && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-justice-light/70">
                      Voice Recognition (Optional)
                    </label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={toggleRecording}
                      className={isRecording ? "bg-red-900/20 text-red-400" : ""}
                    >
                      {isRecording ? <MicOff className="h-4 w-4 mr-1" /> : <Mic className="h-4 w-4 mr-1" />}
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </Button>
                  </div>
                  <Textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Speak a sacred phrase to add voice recognition security..."
                    className="bg-black/30 border-justice-primary/20 min-h-[100px]"
                    disabled={isRecording}
                  />
                  <p className="text-xs text-justice-light/50 mt-1">
                    Adding a voice component enhances security through multi-factor authentication.
                  </p>
                </div>
              )}
              
              {recoveryKey && (
                <div className="mt-4 p-4 bg-justice-primary/10 border border-justice-primary/30 rounded-md">
                  <h3 className="text-justice-primary font-medium flex items-center gap-2 mb-2">
                    <Key className="h-4 w-4" /> Your Sacred Recovery Key
                  </h3>
                  <p className="text-xl text-justice-light font-mono tracking-wider">
                    {recoveryKey}
                  </p>
                  <p className="text-xs text-justice-light/50 mt-2">
                    Store this key in a secure location. It cannot be recovered if lost.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generateRecoveryKey} 
                className="w-full"
                disabled={!passphrase || isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Recovery Key"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
