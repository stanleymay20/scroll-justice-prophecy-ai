
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { SubscriptionStatus, SubscriptionTier } from "@/types/subscription";
import { mapTierToRole } from "@/lib/stripe";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  checkSubscriptionStatus: () => Promise<void>;
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionTier: SubscriptionTier | null;
  subscriptionEnd: string | null;
  userRole: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth Provider initialized");
    
    if (!isSupabaseConfigured()) {
      console.warn("Supabase is not properly configured. Authentication and database features will not work correctly.");
      toast({
        title: "Configuration Error",
        description: "Authentication services are not properly configured. Please check environment variables.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Use setTimeout to defer subscription check to avoid auth deadlocks
        setTimeout(() => {
          checkSubscriptionStatus();
          fetchUserRole(session.user.id);
        }, 0);
      } else {
        setSubscriptionStatus(null);
        setSubscriptionTier(null);
        setSubscriptionEnd(null);
        setUserRole(null);
      }
      
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkSubscriptionStatus();
        fetchUserRole(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching user role:", error);
        return;
      }
      
      if (data) {
        console.log("User role from database:", data.role);
        setUserRole(data.role);
      } else {
        console.log("No role found, setting to flame_seeker");
        setUserRole("flame_seeker");
        
        // Create default role if none exists
        await supabase.from("user_roles").upsert({
          user_id: userId,
          role: "flame_seeker",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_role_change: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!user) return;
    
    try {
      console.log("Checking subscription status for user:", user.id);
      
      // First try to get subscription from database
      const { data: dbSubscription, error: dbError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      if (dbError && dbError.code !== "PGRST116") {
        console.error("Error fetching subscription from database:", dbError);
      }

      if (dbSubscription) {
        console.log("Found subscription in database:", dbSubscription);
        setSubscriptionStatus(dbSubscription.status as SubscriptionStatus);
        setSubscriptionTier(dbSubscription.tier as SubscriptionTier);
        setSubscriptionEnd(dbSubscription.current_period_end);
        
        // Update user role based on subscription tier if needed
        const expectedRole = mapTierToRole(dbSubscription.tier);
        if (expectedRole !== userRole) {
          await fetchUserRole(user.id);
        }
      }

      // Then call the check-subscription function to verify with Stripe and update database
      console.log("Invoking check-subscription edge function");
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        return;
      }
      
      if (data) {
        console.log("Received subscription data from edge function:", data);
        setSubscriptionStatus(data.subscribed ? "active" : "inactive");
        setSubscriptionTier(data.subscription_tier);
        setSubscriptionEnd(data.subscription_end);
        
        // Update user role from the API response if provided
        if (data.user_role) {
          console.log("Setting user role from API response:", data.user_role);
          setUserRole(data.user_role);
        }
      }
    } catch (error) {
      console.error("Error in checkSubscriptionStatus:", error);
      setSubscriptionStatus("inactive");
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
      // Clear subscription data on signOut
      setSubscriptionStatus(null);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
      setUserRole(null);
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signIn,
        signUp,
        signOut,
        loading,
        checkSubscriptionStatus,
        subscriptionStatus,
        subscriptionTier,
        subscriptionEnd,
        userRole,
      }}
    >
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
