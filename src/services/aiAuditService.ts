
import { supabase } from '@/integrations/supabase/client';

/**
 * Logs AI interactions for audit and compliance purposes
 * @param params Parameters including action type, AI model, and summaries
 */
export const logAIInteraction = async (params: {
  action_type: string;
  ai_model: string;
  input_summary: string;
  output_summary: string;
}) => {
  try {
    // Check if the table exists using our table check function
    const tableExists = await supabase.rpc('check_table_exists', {
      table_name: 'ai_audit_logs'
    });
    
    if (!tableExists) {
      // Try to create the table if it doesn't exist
      await supabase.rpc('create_ai_audit_logs_table');
    }
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Insert the log entry
    await supabase.from('ai_audit_logs').insert({
      user_id: user?.id,
      action_type: params.action_type,
      ai_model: params.ai_model,
      input_summary: params.input_summary,
      output_summary: params.output_summary
    });
    
    console.log('AI interaction logged successfully');
    return true;
  } catch (error) {
    console.error('Error logging AI interaction:', error);
    // Silently fail - don't interrupt user experience for logging failures
    return false;
  }
};

/**
 * Fetches AI usage logs for a specific user
 * @param userId User ID to fetch logs for
 */
export const getAIUsageLogs = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('ai_audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching AI usage logs:', error);
    return [];
  }
};

/**
 * Requests deletion of AI training data for a user (GDPR compliance)
 * @param userId User ID requesting data deletion
 */
export const requestAIDataDeletion = async (userId: string): Promise<boolean> => {
  try {
    // In a real implementation, this would create a deletion request
    // For now, we'll just log the request
    await supabase.from('ai_audit_logs').insert({
      user_id: userId,
      action_type: 'DATA_DELETION_REQUEST',
      ai_model: 'all',
      input_summary: 'User requested deletion of all AI training data',
      output_summary: 'Deletion request logged and scheduled for processing'
    });
    
    return true;
  } catch (error) {
    console.error('Error requesting AI data deletion:', error);
    return false;
  }
};
