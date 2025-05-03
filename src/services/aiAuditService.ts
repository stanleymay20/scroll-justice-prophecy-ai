
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
    
    // Insert the audit log entry
    const { error } = await supabase
      .from('ai_audit_log')
      .insert({
        user_id: userId,
        action_type: entry.action_type,
        ai_model: entry.ai_model,
        input_summary: entry.input_summary,
        output_summary: entry.output_summary
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
    const { data, error } = await supabase
      .from('ai_audit_log')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching AI logs:", err);
    return [];
  }
}
