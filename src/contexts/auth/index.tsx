
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isJudge: boolean;
  userRole: string | null;
  subscription: any | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  profile: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAdmin: false,
  isJudge: false,
  userRole: null,
  subscription: null,
  loading: true,
  refreshSession: async () => {},
  refreshUserProfile: async () => {},
  profile: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isJudge, setIsJudge] = useState(false);
  const [subscription, setSubscription] = useState<any | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
            setIsJudge(false);
            setSubscription(null);
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
      setIsJudge(role === 'judge');
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole('petitioner'); // Default to basic role
      setIsAdmin(false);
      setIsJudge(false);
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
        setSubscription(data);
        
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

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Welcome back to ScrollJustice.AI",
        description: "You've been signed in successfully.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Sacred challenge appeared",
        description: "Please verify your scroll credentials and try again",
        variant: "destructive",
      });
      throw error; // Re-throw for handling in the component
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      toast({
        title: "Welcome to ScrollJustice.AI",
        description: "Your sacred account has been created. Please check your email for verification instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Sacred scrolls are troubled",
        description: "Please try again with different scroll credentials",
        variant: "destructive",
      });
      throw error; // Re-throw for handling in the component
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
      // Clear subscription data on signOut
      setSubscription(null);
      setUserRole('petitioner'); // Default when logged out
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    loading: isLoading, // Alias for compatibility
    isAdmin,
    isJudge,
    userRole,
    subscription,
    refreshSession,
    refreshUserProfile,
    profile,
    signIn,
    signOut,
    signUp
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
