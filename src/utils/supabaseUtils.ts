
/**
 * Safely calls a database function through RPC, handling the case where the function might not exist yet
 * @param functionName The name of the database function to call
 * @param params The parameters to pass to the function
 * @param fallbackFn A fallback function to execute if the RPC fails
 */
export async function safeRpcCall<T, F>(
  functionName: string, 
  params: Record<string, any>,
  fallbackFn: () => Promise<F>
): Promise<T | F> {
  try {
    // Import the supabase client directly instead of using the window object
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Try to call the database function through RPC
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      // If the function doesn't exist, use the fallback
      console.warn(`RPC function ${functionName} failed: ${error.message}. Using fallback.`);
      return await fallbackFn();
    }
    
    return data as T;
  } catch (err) {
    console.warn(`Error calling ${functionName}. Using fallback.`, err);
    return await fallbackFn();
  }
}
