
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";

interface ProtectedRouteProps {
  children: ReactNode;
  requireSubscription?: boolean;
  requiredTier?: "basic" | "professional" | "enterprise";
}

const ProtectedRoute = ({ 
  children, 
  requireSubscription = false,
  requiredTier
}: ProtectedRouteProps) => {
  const { user, loading, subscriptionStatus, subscriptionTier } = useAuth();
  const location = useLocation();

  // Check if user has the required subscription tier
  const hasRequiredTier = () => {
    if (!requiredTier) return true;
    
    const tierHierarchy = ["basic", "professional", "enterprise"];
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier);
    const currentTierIndex = tierHierarchy.indexOf(subscriptionTier as any);
    
    return subscriptionStatus === "active" && currentTierIndex >= requiredTierIndex;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-justice-dark to-black">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <PulseEffect color="bg-justice-primary" size="lg" />
          </div>
          <p className="text-justice-light/80">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and save the current location
    return <Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requireSubscription && subscriptionStatus !== "active") {
    // User needs a subscription but doesn't have one
    return <Navigate to="/subscription/plans" replace />;
  }

  if (requiredTier && !hasRequiredTier()) {
    // User doesn't have the required subscription tier
    return <Navigate to="/subscription/plans" replace />;
  }

  // User is authenticated (and has required subscription if applicable)
  return <>{children}</>;
};

export default ProtectedRoute;
