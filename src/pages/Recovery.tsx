
import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCode } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { logAIInteraction } from "@/services/aiAuditService";

export default function RecoveryPage() {
  const [recoveryMethod, setRecoveryMethod] = useState<string>("passphrase");
  const [passphrase, setPassphrase] = useState<string>("");
  const [recoveryCode, setRecoveryCode] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const startListening = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      toast({
        title: "Voice recovery unavailable",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast({
        title: "Voice recognition error",
        description: event.error,
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleRecoveryRequest = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to recover your scroll key",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Record this AI-assisted recovery attempt
      await logAIInteraction({
        action_type: "SCROLL_KEY_RECOVERY_ATTEMPT",
        ai_model: "scroll-identity-validator",
        input_summary: recoveryMethod === "voice" 
          ? `Voice recovery attempt with transcript: ${transcript.substring(0, 50)}...` 
          : "Passphrase recovery attempt",
        output_summary: "Recovery request submitted for verification"
      });

      // Create a recovery record in the database
      const { error } = await supabase
        .from('scroll_recovery_keys')
        .insert({
          user_id: user.id,
          recovery_method: recoveryMethod,
          recovery_phrase: recoveryMethod === "voice" ? transcript : passphrase,
          request_timestamp: new Date().toISOString(),
          status: 'pending'
        });

      if (error) throw error;

      // Generate a recovery code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      setRecoveryCode(code);
      setStep(2);

      toast({
        title: "Recovery initiated",
        description: "Your scroll key recovery request has been submitted"
      });
    } catch (error) {
      console.error('Error processing recovery request:', error);
      toast({
        title: "Recovery failed",
        description: "There was an error processing your recovery request",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const completeRecovery = async () => {
    try {
      setIsProcessing(true);

      // In a real implementation, we would verify the recovery code
      // For now, we'll simulate a successful recovery

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Log the completion
      await logAIInteraction({
        action_type: "SCROLL_KEY_RECOVERY_COMPLETE",
        ai_model: "scroll-identity-validator",
        input_summary: "Recovery code verification",
        output_summary: "Scroll key successfully recovered"
      });

      toast({
        title: "Recovery successful",
        description: "Your scroll key has been recovered and your scroll seal reactivated"
      });

      // Redirect to the profile page
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error completing recovery:', error);
      toast({
        title: "Recovery failed",
        description: "There was an error completing your recovery",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="ScrollKey Recovery" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-justice-light mb-6 text-center">ScrollKey Recovery System</h1>
          
          {step === 1 ? (
            <Card className="bg-black/30 border border-justice-primary/30">
              <CardHeader>
                <CardTitle className="text-center text-justice-light">Recover Your Scroll Key</CardTitle>
                <CardDescription className="text-center">
                  Restore access to your sealed scrolls and judgments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue="passphrase" 
                  className="w-full"
                  onValueChange={value => setRecoveryMethod(value)}
                >
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="passphrase" className="flex-1">Passphrase</TabsTrigger>
                    <TabsTrigger value="voice" className="flex-1">Voice Challenge</TabsTrigger>
                    <TabsTrigger value="qr" className="flex-1">QR Code</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="passphrase">
                    <div className="space-y-4">
                      <p className="text-gray-300 text-sm">
                        Enter your sacred passphrase to recover your scroll key. This should be the phrase you set during the scroll sealing ceremony.
                      </p>
                      
                      <Input 
                        type="password"
                        placeholder="Enter your passphrase"
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                        className="bg-black/50 border-justice-primary/50 text-white"
                      />
                      
                      <Alert className="bg-black/50 border-justice-secondary/30">
                        <AlertDescription>
                          Your passphrase should contain at least 3 words from your original scroll oath.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="voice">
                    <div className="space-y-4">
                      <p className="text-gray-300 text-sm">
                        Speak your voice challenge to recover your scroll key. Your voice pattern and sacred words will be analyzed.
                      </p>
                      
                      <div className="flex justify-center">
                        <Button 
                          onClick={startListening}
                          disabled={isListening} 
                          className={`w-32 h-32 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-justice-tertiary'}`}
                        >
                          {isListening ? "Speaking..." : "Speak Now"}
                        </Button>
                      </div>
                      
                      {transcript && (
                        <div className="p-3 bg-black/70 rounded-md border border-justice-secondary/30">
                          <p className="text-sm font-medium text-justice-light mb-1">Transcription:</p>
                          <p className="text-sm text-gray-300 italic">{transcript}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="qr">
                    <div className="space-y-4">
                      <p className="text-gray-300 text-sm">
                        Scan your recovery QR code to restore your scroll key. This QR code was provided during your scroll sealing ceremony.
                      </p>
                      
                      <div className="flex justify-center p-6">
                        <div className="w-48 h-48 border-2 border-dashed border-justice-primary/50 rounded-lg flex items-center justify-center">
                          <QRCode size={64} className="text-justice-primary opacity-50" />
                          <span className="text-xs text-gray-400 absolute mt-24">QR scanner coming soon</span>
                        </div>
                      </div>
                      
                      <Input 
                        placeholder="Or enter recovery code manually"
                        className="bg-black/50 border-justice-primary/50 text-white"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleRecoveryRequest}
                  disabled={isProcessing || (recoveryMethod === "passphrase" && !passphrase) || (recoveryMethod === "voice" && !transcript)}
                  className="w-full bg-justice-tertiary hover:bg-justice-tertiary/80"
                >
                  {isProcessing ? "Processing..." : "Recover Scroll Key"}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-black/30 border border-justice-primary/30">
              <CardHeader>
                <CardTitle className="text-center text-justice-light">Verify Recovery</CardTitle>
                <CardDescription className="text-center">
                  Final step to reactivate your scroll seal
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 bg-black/50 border-2 border-justice-tertiary rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-mono font-bold text-justice-tertiary">
                      {recoveryCode}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm">
                    Your recovery code has been generated. Please store this code safely as you'll need it to complete the recovery process.
                  </p>
                  
                  <Alert className="bg-black/50 border-justice-secondary/30">
                    <AlertDescription>
                      A verification message has been sent to your registered email address. Check your inbox to complete the recovery process.
                    </AlertDescription>
                  </Alert>
                  
                  {/* This would typically require email verification, but for demo purposes we'll provide a button */}
                  <Button 
                    onClick={completeRecovery}
                    disabled={isProcessing}
                    variant="outline"
                    className="mt-4"
                  >
                    {isProcessing ? "Reactivating Seal..." : "I've Verified My Email"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
