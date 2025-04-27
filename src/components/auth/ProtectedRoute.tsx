
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";

interface ProtectedRouteProps {
  children: ReactNode;
  requireSubscription?: boolean;
  requiredTier?: "basic" | "professional" | "enterprise";
  requiredRole?: "witness" | "advocate" | "steward" | "judge" | "admin";
}

const ProtectedRoute = ({ 
  children, 
  requireSubscription = false,
  requiredTier,
  requiredRole
}: ProtectedRouteProps) => {
  const { user, loading, subscriptionStatus, subscriptionTier, userRole, checkSubscription } = useAuth();
  const location = useLocation();

  // Check if user has any of the required roles
  const hasRequiredRole = () => {
    if (!requiredRole) return true;
    
    // Admin role has access to everything
    if (userRole === "admin") return true;
    
    // For judge role, access to judge and lower
    if (requiredRole === "judge" && userRole === "judge") return true;
    
    // For steward role, access to steward and lower
    if (requiredRole === "steward" && (userRole === "steward" || userRole === "judge")) return true;
    
    // For advocate role, access to advocate and lower
    if (requiredRole === "advocate" && ["advocate", "steward", "judge"].includes(userRole || "")) return true;
    
    // For witness role, access to all authenticated users
    if (requiredRole === "witness" && userRole) return true;
    
    return false;
  };

  // Check if user has the required subscription tier
  const hasRequiredTier = () => {
    if (!requiredTier) return true;
    
    const tierHierarchy = ["basic", "professional", "enterprise"];
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier);
    const currentTierIndex = tierHierarchy.indexOf(subscriptionTier as any || "basic");
    
    return subscriptionStatus === "active" && currentTierIndex >= requiredTierIndex;
  };

  // Refresh subscription status when route changes
  useEffect(() => {
    if (user && requireSubscription) {
      checkSubscription();
    }
  }, [user, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-justice-dark to-black">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <PulseEffect color="bg-justice-primary" size="lg" />
          </div>
          <p className="text-justice-light/80">Loading Sacred Scroll...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and save the current location
    return <Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requiredRole && !hasRequiredRole()) {
    // User doesn't have the required role
    return <Navigate to="/access-denied" replace />;
  }

  if (requireSubscription && subscriptionStatus !== "active") {
    // User needs a subscription but doesn't have one
    return <Navigate to="/subscription/plans" replace />;
  }

  if (requiredTier && !hasRequiredTier()) {
    // User doesn't have the required subscription tier
    return <Navigate to="/subscription/plans" replace />;
  }

  // User is authenticated and has required role/subscription
  return <>{children}</>;
};

export default ProtectedRoute;
