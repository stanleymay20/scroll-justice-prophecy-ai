
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      // Check for existing session
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      setUser(sessionData.session?.user ?? null);
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          console.log("Auth state change:", event);
          setSession(newSession);
          setUser(newSession?.user ?? null);
        }
      );
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initialize();
  }, []);

  // Refresh the session
  const refreshSession = async () => {
    try {
      const { data: { session: freshSession } } = await supabase.auth.refreshSession();
      setSession(freshSession);
      setUser(freshSession?.user ?? null);
    } catch (error) {
      console.error("Failed to refresh session:", error);
    }
  };

  return {
    user,
    session,
    isLoading,
    refreshSession,
    setUser,
    setSession,
    setIsLoading
  };
}
