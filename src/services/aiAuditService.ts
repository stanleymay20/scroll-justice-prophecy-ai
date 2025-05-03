
import { supabase } from "@/integrations/supabase/client";

// Types for AI audit logging
export interface AIAuditLogEntry {
  action_type: string;
  ai_model: string;
  input_summary?: string;
  output_summary?: string;
}

/**
 * Logs an AI interaction to the audit log
 */
export const logAIInteraction = async (entry: AIAuditLogEntry) => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    // Use rpc to insert the audit log entry instead of direct table access
    // This avoids TypeScript errors with table definitions
    const { error } = await supabase.rpc('log_ai_interaction', {
      user_id_param: userId,
      action_type_param: entry.action_type,
      ai_model_param: entry.ai_model,
      input_summary_param: entry.input_summary,
      output_summary_param: entry.output_summary
    });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error logging AI interaction:", err);
    return false;
  }
}

/**
 * Fetches AI audit logs for the current user
 */
export const fetchUserAILogs = async () => {
  try {
    // Use rpc to fetch logs instead of direct table access
    const { data, error } = await supabase.rpc('get_user_ai_logs');

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching AI logs:", err);
    return [];
  }
}
