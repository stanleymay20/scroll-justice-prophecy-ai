
import { supabase } from "@/integrations/supabase/client";

// Types for AI audit logging
export interface AIAuditLogEntry {
  action_type: string;
  ai_model: string;
  input_summary?: string;
  output_summary?: string;
}

// Define types for our RPC function parameters
interface LogAIInteractionParams {
  user_id_param: string | null;
  action_type_param: string;
  ai_model_param: string;
  input_summary_param: string | null;
  output_summary_param: string | null;
}

// Define the expected return type for log_ai_interaction
type LogAIInteractionResponse = boolean;

// Define the expected return type for get_user_ai_logs
interface AILogEntry {
  id: string;
  user_id: string;
  action_type: string;
  ai_model: string;
  input_summary: string | null;
  output_summary: string | null;
  created_at: string;
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
    const { error } = await supabase.rpc<LogAIInteractionResponse, LogAIInteractionParams>('log_ai_interaction', {
      user_id_param: userId,
      action_type_param: entry.action_type,
      ai_model_param: entry.ai_model,
      input_summary_param: entry.input_summary || null,
      output_summary_param: entry.output_summary || null
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
    const { data, error } = await supabase.rpc<AILogEntry[], Record<string, never>>('get_user_ai_logs', {});

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching AI logs:", err);
    return [];
  }
}
