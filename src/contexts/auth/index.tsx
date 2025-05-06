
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  userRole: string | null;
  refreshSession: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  profile: any | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAdmin: false,
  userRole: null,
  refreshSession: async () => {},
  refreshUserProfile: async () => {},
  profile: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initial session check and auth state listener
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      // Check for existing session
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      setUser(sessionData.session?.user ?? null);
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log("Auth state change:", event);
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // If user signed in, fetch their profile
          if (event === 'SIGNED_IN' && newSession?.user) {
            fetchUserProfile(newSession.user.id);
            fetchUserRole(newSession.user.id);
            checkSubscriptionStatus();
          } else if (event === 'SIGNED_OUT') {
            setProfile(null);
            setUserRole(null);
            setIsAdmin(false);
          }
        }
      );
      
      // If there's an active session, fetch user profile
      if (sessionData.session?.user) {
        await fetchUserProfile(sessionData.session.user.id);
        await fetchUserRole(sessionData.session.user.id);
        await checkSubscriptionStatus();
      }
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initialize();
  }, []);
  
  // Fetch user profile from profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setProfile(null);
    }
  };
  
  // Fetch user role
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) throw error;
      
      const role = data?.role || 'petitioner'; // Default role
      setUserRole(role);
      
      // Check if user is an admin
      setIsAdmin(role === 'admin' || role === 'judge');
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole('petitioner'); // Default to basic role
      setIsAdmin(false);
    }
  };
  
  // Check subscription status
  const checkSubscriptionStatus = async () => {
    try {
      // Call check-subscription edge function
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        return;
      }
      
      if (data?.subscribed) {
        console.log("Active subscription found:", data);
        
        // If enterprise tier, update role to advanced roles if applicable
        if (data.subscription_tier?.toLowerCase() === 'enterprise') {
          if (userRole === 'petitioner') {
            // Possibly upgrade user role based on subscription
            console.log("Enterprise user eligible for role upgrade");
          }
        }
      }
    } catch (error) {
      console.error("Subscription check failed:", error);
    }
  };

  // Refresh the session
  const refreshSession = async () => {
    try {
      const { data: { session: freshSession } } = await supabase.auth.refreshSession();
      setSession(freshSession);
      setUser(freshSession?.user ?? null);
      
      return freshSession;
    } catch (error) {
      console.error("Failed to refresh session:", error);
    }
  };
  
  // Refresh user profile
  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
      await fetchUserRole(user.id);
      await checkSubscriptionStatus();
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    userRole,
    refreshSession,
    refreshUserProfile,
    profile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
