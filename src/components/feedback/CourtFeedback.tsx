
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Check, Star, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import type { FeedbackRating } from "@/types/courtroom";

interface CourtFeedbackProps {
  sessionId: string;
  sessionTitle: string;
  onClose: () => void;
}

export function CourtFeedback({ sessionId, sessionTitle, onClose }: CourtFeedbackProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [testimony, setTestimony] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async () => {
    if (!user || !rating || !testimony.trim()) return;
    
    setSubmitting(true);
    try {
      // Insert feedback into the database
      const { error } = await supabase.from('session_feedback').insert({
        session_id: sessionId,
        user_id: user.id,
        rating,
        testimony,
        is_anonymous: isAnonymous
      });
      
      if (error) throw error;
      
      // Log the feedback submission in scroll witness logs
      await supabase.from('scroll_witness_logs').insert({
        session_id: sessionId,
        user_id: user.id,
        action: 'feedback_submitted',
        details: `Feedback submitted for session: ${sessionTitle}`
      });
      
      setSubmitted(true);
      toast({
        title: "Sacred Feedback Received",
        description: "Thank you for sharing your testimony with the scrolls.",
      });
      
      // Close after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Sacred Challenge",
        description: "The scrolls could not record your testimony. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <GlassCard className="w-full max-w-lg mx-auto p-6">
      {submitted ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Sacred Feedback Received</h3>
          <p className="text-justice-light/80 mb-6">
            Thank you for sharing your testimony with the scrolls.
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{t('court.feedback')}</h3>
              <p className="text-justice-light/80">
                Share your sacred testimony about this court session
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-justice-light mb-2">How would you rate your experience?</p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value as FeedbackRating)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    rating === value 
                      ? 'bg-justice-primary text-white' 
                      : 'bg-black/30 text-justice-light hover:bg-justice-primary/20'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-justice-light/60 mt-1">
              <span>Needs Improvement</span>
              <span>Excellent</span>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-justice-light mb-2">
              Please share your testimony about this court experience:
            </label>
            <Textarea
              value={testimony}
              onChange={(e) => setTestimony(e.target.value)}
              placeholder="Your sacred feedback helps improve the ScrollJustice.AI system..."
              className="min-h-[120px]"
            />
          </div>
          
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="anonymous-feedback"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mr-2"
            />
            <label 
              htmlFor="anonymous-feedback" 
              className="text-sm text-justice-light cursor-pointer"
            >
              Submit testimony anonymously
            </label>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!rating || !testimony.trim() || submitting}
            >
              {submitting ? "Submitting..." : "Submit Testimony"}
            </Button>
          </div>
        </>
      )}
    </GlassCard>
  );
}
