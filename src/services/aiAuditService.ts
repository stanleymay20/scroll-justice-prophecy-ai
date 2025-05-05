
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface for AI interaction log entries
 */
export interface AIInteractionLog {
  action_type: string;
  ai_model: string;
  input_summary: string;
  output_summary: string;
  user_id?: string;
  created_at?: string;
}

/**
 * Log an AI interaction to the audit log
 */
export async function logAIInteraction(interaction: AIInteractionLog): Promise<boolean> {
  try {
    // Get current user if available
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    // Prepare the payload with the user ID if available
    const payload = {
      user_id_param: userId || null,
      action_type_param: interaction.action_type,
      ai_model_param: interaction.ai_model,
      input_summary_param: interaction.input_summary,
      output_summary_param: interaction.output_summary
    };
    
    // Call the edge function to log the interaction
    const { error } = await supabase.functions.invoke('log-ai-interaction', {
      body: payload
    });
    
    if (error) {
      console.error('Error logging AI interaction:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in logAIInteraction:', error);
    return false;
  }
}

/**
 * Fetch AI interaction logs for the current user or a specific user
 */
export async function fetchAIInteractionLogs(
  userId?: string, 
  limit = 50, 
  offset = 0
): Promise<AIInteractionLog[]> {
  try {
    // If no userId provided, get the current user
    let targetUserId = userId;
    if (!targetUserId) {
      const { data: userData } = await supabase.auth.getUser();
      targetUserId = userData?.user?.id;
    }
    
    if (!targetUserId) {
      throw new Error('No user ID available for fetching AI logs');
    }
    
    // Fetch logs from the AI audit logs table
    const { data, error } = await supabase
      .from('ai_audit_logs')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (error) {
      throw error;
    }
    
    return data as AIInteractionLog[];
  } catch (error) {
    console.error('Error fetching AI interaction logs:', error);
    return [];
  }
}
