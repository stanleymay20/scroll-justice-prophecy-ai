
import React, { createContext, useContext } from "react";
import { useAuthState } from "./useAuthState";
import { useAuthMethods } from "./useAuthMethods";
import { AuthContextType } from "./types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const {
    user,
    session,
    loading,
    subscriptionStatus,
    subscriptionTier,
    subscriptionEnd,
    userRole,
    setLoading,
    setSubscriptionStatus,
    setSubscriptionTier,
    setSubscriptionEnd,
    setUserRole,
    checkSubscriptionStatus
  } = useAuthState();

  const {
    signIn,
    signUp,
    signOut
  } = useAuthMethods(
    setLoading,
    checkSubscriptionStatus,
    setSubscriptionStatus,
    setSubscriptionTier,
    setSubscriptionEnd,
    setUserRole
  );

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
