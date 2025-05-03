
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Share2, Copy, CheckCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function QRJoinLink() {
  const { user } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const joinUrl = `${window.location.origin}/blessing?tribe=${user?.id?.substring(0, 8)}`;
  
  const generateQRCode = async () => {
    try {
      setIsGenerating(true);
      
      // Generate QR code using a public API
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}`;
      setQrCodeUrl(qrApiUrl);
      
      // Log QR code generation in the database
      if (user) {
        await supabase.from('scroll_integrity_logs').insert({
          user_id: user.id,
          action_type: 'QR_INVITE_GENERATED',
          integrity_impact: 1,
          description: 'QR code invitation link generated for tribe recruiting'
        });
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        variant: "destructive",
        title: "QR Code Generation Failed",
        description: "Could not create your sacred invitation link."
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setLinkCopied(true);
    
    toast({
      title: "Sacred Link Copied",
      description: "Share this with those you wish to invite to your tribe."
    });
    
    setTimeout(() => setLinkCopied(false), 3000);
  };
  
  return (
    <Card className="p-4 bg-black/30 border border-justice-primary/30">
      <h3 className="text-lg font-medium text-white mb-3">Sacred Tribe Invitation</h3>
      
      <div className="space-y-4">
        <p className="text-sm text-justice-light">
          Generate a sacred QR code link to invite family and tribe members to join your scroll journey.
        </p>
        
        {!qrCodeUrl ? (
          <Button 
            onClick={generateQRCode} 
            className="w-full"
            disabled={isGenerating}
          >
            <QrCode className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating Sacred Link..." : "Generate Sacred QR Link"}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img 
                src={qrCodeUrl} 
                alt="Sacred Join QR Code"
                className="h-40 w-40 border-2 border-justice-primary/30 rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-justice-light/70">Sacred Join URL:</p>
              <div className="flex">
                <Input 
                  value={joinUrl}
                  readOnly
                  className="text-xs bg-black/50"
                />
                <Button 
                  size="sm"
                  variant="outline"
                  className="ml-2"
                  onClick={copyLink}
                >
                  {linkCopied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Join my Sacred Scroll Tribe',
                    text: 'I invite you to join my tribe in the Sacred Scrolls of Justice.',
                    url: joinUrl,
                  })
                  .catch(err => console.error('Error sharing:', err));
                } else {
                  copyLink();
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Sacred Invitation
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
