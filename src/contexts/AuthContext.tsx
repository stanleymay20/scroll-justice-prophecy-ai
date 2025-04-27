
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

type UserRole = "witness" | "advocate" | "steward" | "judge" | "admin";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  subscriptionStatus: "active" | "inactive" | "pending" | null;
  subscriptionTier: string | null;
  userRole: UserRole | null;
  isCheckingSubscription: boolean;
  checkSubscription: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<"active" | "inactive" | "pending" | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth Provider initialized with Supabase configuration");
    
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
        checkSubscription();
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
        await checkSubscription();
      } else {
        setUserRole(null);
        setSubscriptionStatus("inactive");
        setSubscriptionTier(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      
      if (data) {
        setUserRole(data.role as UserRole);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const checkSubscription = async () => {
    if (!user) return;
    
    try {
      setIsCheckingSubscription(true);
      console.log("Checking subscription for user:", user.id);
      
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error invoking check-subscription function:", error);
        throw error;
      }
      
      console.log("Subscription verification response:", data);
      
      if (data?.subscribed) {
        setSubscriptionStatus("active");
        setSubscriptionTier(data.subscription_tier);
      } else {
        setSubscriptionStatus("inactive");
        setSubscriptionTier(null);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscriptionStatus("inactive");
      setSubscriptionTier(null);
      toast({
        title: "Subscription Error",
        description: "Could not verify your subscription status. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Welcome to ScrollJustice.AI",
        description: "You've been signed in successfully.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`
        }
      });
      if (error) throw error;
      toast({
        title: "Check your email",
        description: "We've sent you a verification link to complete your registration.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again with a different email",
        variant: "destructive",
      });
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
        subscriptionStatus,
        subscriptionTier,
        userRole,
        isCheckingSubscription,
        checkSubscription,
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
