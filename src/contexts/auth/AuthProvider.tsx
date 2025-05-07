
import React, { createContext } from "react";
import { useAuthSession } from "./hooks/useAuthSession";
import { useUserProfile } from "./hooks/useUserProfile";
import { useSubscription } from "./hooks/useSubscription";
import { useAuthMethods } from "./hooks/useAuthMethods";
import { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType>({
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
  subscriptionTier: null,
  subscriptionStatus: null,
  subscriptionEnd: null,
  checkSubscriptionStatus: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our custom hooks
  const { 
    user, 
    session, 
    isLoading: sessionLoading, 
    refreshSession 
  } = useAuthSession();
  
  const { 
    profile, 
    userRole, 
    isAdmin, 
    isJudge, 
    refreshUserProfile 
  } = useUserProfile(user);
  
  const { 
    subscription, 
    subscriptionTier,
    subscriptionStatus,
    subscriptionEnd,
    checkSubscriptionStatus 
  } = useSubscription(user);
  
  const { 
    signIn, 
    signUp, 
    signOut, 
    authLoading 
  } = useAuthMethods();

  // Combine loading states
  const isLoading = sessionLoading || authLoading;

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAdmin,
    isJudge,
    userRole,
    subscription,
    loading: isLoading, // Alias for compatibility
    refreshSession,
    refreshUserProfile,
    profile,
    signIn,
    signOut,
    signUp,
    subscriptionTier,
    subscriptionStatus,
    subscriptionEnd,
    checkSubscriptionStatus
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
