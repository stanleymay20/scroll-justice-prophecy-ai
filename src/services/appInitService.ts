
import { supabase } from "@/integrations/supabase/client";

/**
 * Applies RLS policies to the database
 */
export const applyRlsPolicies = async () => {
  try {
    const { data, error } = await supabase.functions.invoke("add-rls-policies");
    if (error) {
      console.error("Error applying RLS policies:", error);
    } else {
      console.log("RLS policies applied:", data);
    }
  } catch (err) {
    console.error("Failed to invoke add-rls-policies function:", err);
  }
};

/**
 * Initializes the AI audit log table
 */
export const initializeAiAuditLog = async () => {
  try {
    const { data, error } = await supabase.functions.invoke("create-ai-audit-table");
    if (error) {
      console.error("Error creating AI audit log table:", error);
    } else {
      console.log("AI audit log table status:", data);
    }
  } catch (err) {
    console.error("Failed to invoke create-ai-audit-table function:", err);
  }
};

/**
 * Logs window dimensions to help with responsive design debugging
 */
export const setupWindowSizeLogger = () => {
  const logDimensions = () => {
    console.log(`info: Window size: ${window.innerWidth}x${window.innerHeight}`);
  };
  
  logDimensions();
  window.addEventListener('resize', logDimensions);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', logDimensions);
  };
};
