
import { createClient } from '@supabase/supabase-js';

// Use the environment variables with the provided values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rgstpbaljoamkhjhomzp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnc3RwYmFsam9hbWtoamhvbXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjYxMzMsImV4cCI6MjA2MTM0MjEzM30.DLpKUaIo0REcRQzCAYV1bxW2bqqIdHNcsgBYf9SNRuE';

// Initialize Supabase client with the provided credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
