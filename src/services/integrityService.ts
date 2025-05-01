
import { supabase } from '@/integrations/supabase/client';

// Get AI suggested verdict
export async function getAiSuggestedVerdict(
  petitionTitle: string,
  petitionDescription: string,
  evidence?: string[]
): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke("get-ai-verdict", {
      body: {
        petitionTitle,
        petitionDescription,
        evidence,
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting AI verdict:", error);
    throw error;
  }
}

// Analyze content for integrity
export async function analyzeContent(text: string): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke("analyze-content", {
      body: { text }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error analyzing content:", error);
    throw error;
  }
}

// Log scroll integrity action
export async function logScrollIntegrityAction(
  actionType: string,
  integrityImpact: number,
  description: string,
  petitionId?: string
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const logEntry = {
      action_type: actionType,
      integrity_impact: integrityImpact,
      description,
      petition_id: petitionId,
      user_id: user.id
    };
    
    const { error } = await supabase
      .from('scroll_integrity_logs')
      .insert([logEntry]);
      
    return !error;
  } catch (error) {
    console.error("Error logging integrity action:", error);
    return false;
  }
}

// Get all scroll integrity logs
export async function getScrollIntegrityLogs(limit = 50): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('scroll_integrity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting integrity logs:", error);
    return [];
  }
}

// Calculate system integrity metrics
export async function calculateSystemIntegrityMetrics(): Promise<{
  overall: number;
  petitionIntegrity: number;
  userReputation: number;
  scrollSecurity: number;
}> {
  // In a real application, this would calculate actual metrics
  // For now, we'll return sample data
  return {
    overall: 96,
    petitionIntegrity: 98,
    userReputation: 94,
    scrollSecurity: 97
  };
}
