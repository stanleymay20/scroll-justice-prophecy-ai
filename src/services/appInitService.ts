
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
    // This is just a check to see if the table exists
    // We'll use the edge function to actually create it if needed
    const { error } = await supabase.functions.invoke('create-ai-audit-table', {
      body: {}
    });
      
    if (error) {
      console.warn("Error initializing AI audit log table:", error);
      return false;
    }
    
    console.log("AI audit log table initialization completed");
    return true;
  } catch (error) {
    console.error("Error initializing AI audit log:", error);
    return false;
  }
}

// Set up window size logger for debugging
export function setupWindowSizeLogger() {
  console.log(`Window size: ${window.innerWidth}x${window.innerHeight}`);
  console.log(`Document URL: ${document.URL}`);
  console.log(`Document domain: ${document.domain}`);
  console.log(`Document location: ${document.location.href}`);
  
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
