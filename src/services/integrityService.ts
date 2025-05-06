
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { generateHash } from "@/utils/cryptoUtils";

/**
 * Records an integrity violation for a petition
 * @param petitionId The ID of the petition
 * @param userId The ID of the user reporting the violation
 * @param violationType The type of violation being reported
 * @param description A description of the violation
 * @returns Success status
 */
export const flagIntegrityViolation = async (
  petitionId: string,
  userId: string,
  violationType: string,
  description: string
): Promise<boolean> => {
  try {
    // Calculate impact based on violation type
    const impactMap: Record<string, number> = {
      'minor': -1,
      'moderate': -5,
      'severe': -10,
      'critical': -20
    };
    
    const impact = impactMap[violationType] || -5;
    
    // Log the violation
    await supabase.from("scroll_integrity_logs").insert({
      petition_id: petitionId,
      user_id: userId,
      action_type: `violation_${violationType}`,
      description,
      integrity_impact: impact
    });
    
    // Update the petition's integrity score
    try {
      // For now, manually update the score since the RPC function may not exist yet
      const { data: currentScore } = await supabase
        .from("scroll_petitions")
        .select("scroll_integrity_score")
        .eq("id", petitionId)
        .single();
      
      if (currentScore) {
        const newScore = Math.max(0, Math.min(100, currentScore.scroll_integrity_score + impact));
        
        await supabase
          .from("scroll_petitions")
          .update({ scroll_integrity_score: newScore })
          .eq("id", petitionId);
      }
      
      return true;
    } catch (error) {
      console.error("Failed to update integrity score:", error);
      return false;
    }
  } catch (error) {
    console.error("Error flagging integrity violation:", error);
    toast({
      title: "Error",
      description: "Failed to report integrity violation. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Checks if a user has submitted a verdict on their own petition
 * @param petitionId The ID of the petition
 * @param userId The ID of the user
 * @returns Whether the user attempted to self-verdict
 */
export const checkSelfVerdict = async (
  petitionId: string,
  userId?: string
): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data: petition } = await supabase
      .from("scroll_petitions")
      .select("petitioner_id")
      .eq("id", petitionId)
      .single();
    
    if (petition && petition.petitioner_id === userId) {
      // Log self-verdict attempt as an integrity violation
      await flagIntegrityViolation(
        petitionId,
        userId,
        "severe",
        "Attempted to submit verdict on own petition"
      );
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking for self-verdict:", error);
    return false;
  }
};

/**
 * Gets an AI-suggested verdict for a petition
 * @param petitionId The ID of the petition
 * @returns The suggested verdict or null if unavailable
 */
export const getAiSuggestedVerdict = async (
  petitionId: string
): Promise<string | null> => {
  try {
    const { data } = await supabase
      .from("scroll_petitions")
      .select("ai_suggested_verdict")
      .eq("id", petitionId)
      .single();
    
    return data?.ai_suggested_verdict || null;
  } catch (error) {
    console.error("Error getting AI verdict suggestion:", error);
    return null;
  }
};

/**
 * Gets a user's integrity score based on their actions
 * @param userId The ID of the user
 * @returns The user's integrity score as a number between 0 and 100
 */
export const getUserIntegrityScore = async (userId: string): Promise<number> => {
  try {
    // For now, implement a simple calculation since the function may not exist
    const { data: positiveActions } = await supabase
      .from("scroll_petitions")
      .select("id")
      .eq("petitioner_id", userId)
      .eq("verdict", "approved");
    
    const { data: negativeActions } = await supabase
      .from("scroll_integrity_logs")
      .select("id")
      .eq("user_id", userId)
      .lt("integrity_impact", 0);
    
    const { data: rejectedPetitions } = await supabase
      .from("scroll_petitions")
      .select("id")
      .eq("petitioner_id", userId)
      .eq("verdict", "rejected");
    
    // Calculate a basic score
    const baseScore = 50;
    const positive = (positiveActions?.length || 0) * 5;
    const negative = ((negativeActions?.length || 0) + (rejectedPetitions?.length || 0)) * 10;
    
    let score = baseScore + positive - negative;
    // Ensure the score is between 0 and 100
    score = Math.min(Math.max(score, 0), 100);
    
    return score;
  } catch (error) {
    console.error("Error getting user integrity score:", error);
    return 50; // Default middle score
  }
};

/**
 * Analyzes content for potential integrity issues
 * @param content The content to analyze
 * @returns Analysis results
 */
export const analyzeContent = async (content: string): Promise<{
  score: number;
  issues: string[];
}> => {
  try {
    // For now, a simple implementation that checks for certain red flags
    const issues: string[] = [];
    let score = 100;
    
    const redFlags = [
      { pattern: /\b(fake|false|lie|fraud)\b/i, penalty: 5, message: "Potential false information detected" },
      { pattern: /\b(hate|racist|bigot)\b/i, penalty: 10, message: "Potential hate speech detected" },
      { pattern: /\b(attack|harm|kill|threat)\b/i, penalty: 8, message: "Potential threatening content detected" },
      { pattern: /\b(cheat|steal|scam)\b/i, penalty: 7, message: "Potential dishonest behavior referenced" }
    ];
    
    redFlags.forEach(flag => {
      if (flag.pattern.test(content)) {
        score -= flag.penalty;
        issues.push(flag.message);
      }
    });
    
    return { score, issues };
  } catch (error) {
    console.error("Error analyzing content:", error);
    return { score: 75, issues: ["Error analyzing content"] };
  }
};

/**
 * Generates a flame signature hash for integrity verification
 * @param content The content to hash
 * @param userId The ID of the user
 * @returns A integrity verification hash
 */
export const generateFlameSignatureHash = async (
  content: string,
  userId: string
): Promise<string> => {
  try {
    const timestamp = new Date().toISOString();
    const dataToHash = `${content}|${userId}|${timestamp}`;
    return generateHash(dataToHash);
  } catch (error) {
    console.error("Error generating flame signature:", error);
    return "";
  }
};
