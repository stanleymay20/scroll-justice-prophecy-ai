
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type UserRole = 'petitioner' | 'advocate' | 'scroll_judge' | 'prophet' | 'admin';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userRole: UserRole | null;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
  subscriptionEnd: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  checkSubscriptionStatus: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  refreshUserRole: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .order('assigned_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error);
        return;
      }
      
      if (data) {
        setUserRole(data.role as UserRole);
      } else {
        // Create default petitioner role
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'petitioner'
          });
        
        if (!insertError) {
          setUserRole('petitioner');
        }
      }
    } catch (error) {
      console.error('Error in refreshUserRole:', error);
    }
  };

  useEffect(() => {
    console.log("Auth Provider initialized");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        setTimeout(() => {
          refreshUserRole();
        }, 0);
      } else {
        setUserRole(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        setTimeout(() => {
          refreshUserRole();
        }, 0);
      }
    }).catch(error => {
      console.error("Error getting session:", error);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSubscriptionStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('scroll_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (data) {
        setSubscriptionTier(data.plan);
        setSubscriptionStatus(data.status);
        setSubscriptionEnd(data.current_period_end);
      } else {
        setSubscriptionTier('free');
        setSubscriptionStatus('inactive');
        setSubscriptionEnd(null);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionTier('free');
      setSubscriptionStatus('inactive');
      setSubscriptionEnd(null);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    if (!userRole) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      'petitioner': 1,
      'advocate': 2,
      'scroll_judge': 3,
      'prophet': 4,
      'admin': 5
    };
    
    return roleHierarchy[userRole] >= roleHierarchy[role];
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast({
        title: "Welcome back to ScrollJustice",
        description: "You've been signed in successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Sacred challenge appeared",
        description: error.message || "Please verify your scroll credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName
          }
        }
      });
      if (error) throw error;
      
      toast({
        title: "Welcome to ScrollJustice",
        description: "Your sacred account has been created. Please check your email for verification instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Sacred scrolls are troubled",
        description: error.message || "Please try again with different scroll credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUserRole(null);
      setSubscriptionTier(null);
      setSubscriptionStatus(null);
      setSubscriptionEnd(null);
      
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
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
        userRole,
        subscriptionTier,
        subscriptionStatus,
        subscriptionEnd,
        signIn,
        signUp,
        signOut,
        loading,
        checkSubscriptionStatus,
        hasRole,
        refreshUserRole,
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
