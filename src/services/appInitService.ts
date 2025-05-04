
import { supabase } from '@/integrations/supabase/client';

// Initialize the app services
export async function applyRlsPolicies() {
  console.log("Applying RLS policies...");
  // This is a placeholder function for app initialization
  // In a real app, you would ensure that RLS policies are applied correctly
  return true;
}

// Initialize the AI audit log table if it doesn't exist
export async function initializeAiAuditLog() {
  console.log("Initializing AI audit log...");
  try {
    // Check if the table exists
    const { data, error } = await supabase
      .from('ai_audit_logs')
      .select('id')
      .limit(1);
      
    if (error) {
      console.warn("AI audit log table may not exist. This is expected on first run.");
    } else {
      console.log("AI audit log table exists, with data:", data);
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing AI audit log:", error);
    return false;
  }
}

// Set up window size logger for debugging
export function setupWindowSizeLogger() {
  console.log(`Window size: ${window.innerWidth}x${window.innerHeight}`);
  
  // Set up event listener for window resize
  const resizeListener = () => {
    console.log(`Window resized to: ${window.innerWidth}x${window.innerHeight}`);
  };
  
  window.addEventListener('resize', resizeListener);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', resizeListener);
  };
}
