
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";
import { SubscriptionTier } from "@/types/subscription";

interface ProtectedRouteProps {
  children: ReactNode;
  requireSubscription?: boolean;
  requiredTier?: SubscriptionTier;
  requiredRole?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireSubscription = false,
  requiredTier,
  requiredRole
}: ProtectedRouteProps) => {
  const { user, loading, subscriptionStatus, subscriptionTier, userRole, checkSubscriptionStatus } = useAuth();
  const location = useLocation();

  // Check subscription on mount and when changing routes
  useEffect(() => {
    if (user && requireSubscription) {
      console.log("Checking subscription status in ProtectedRoute");
      checkSubscriptionStatus();
    }
  }, [user, requireSubscription, checkSubscriptionStatus, location.pathname]);

  // Check if user has the required subscription tier
  const hasRequiredTier = () => {
    if (!requiredTier) return true;
    
    const tierHierarchy: SubscriptionTier[] = ["basic", "professional", "enterprise"];
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier);
    const currentTierIndex = tierHierarchy.indexOf(subscriptionTier as SubscriptionTier);
    
    return subscriptionStatus === "active" && currentTierIndex >= requiredTierIndex;
  };

  // Check if user has the required role
  const hasRequiredRole = () => {
    if (!requiredRole) return true;
    
    const roleHierarchy = ["flame_seeker", "scroll_advocate", "elder_judge", "admin"];
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
    const currentRoleIndex = roleHierarchy.indexOf(userRole || "flame_seeker");
    
    return currentRoleIndex >= requiredRoleIndex;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-justice-dark to-black">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <PulseEffect color="bg-justice-primary" size="lg" />
          </div>
          <p className="text-justice-light/80">Consulting the sacred scrolls...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and save the current location
    console.log("User not authenticated, redirecting to signin");
    return <Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requireSubscription && !subscriptionStatus) {
    console.log("Refreshing subscription status for verification...");
    checkSubscriptionStatus();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-justice-dark to-black">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <PulseEffect color="bg-justice-primary" size="lg" />
          </div>
          <p className="text-justice-light/80">Verifying subscription status...</p>
        </div>
      </div>
    );
  }

  if (requireSubscription && subscriptionStatus !== "active") {
    // User needs a subscription but doesn't have one
    console.log("Subscription required but user doesn't have active subscription");
    return <Navigate to="/subscription/plans" replace />;
  }

  if (requiredTier && !hasRequiredTier()) {
    // User doesn't have the required subscription tier
    console.log("Required tier not met, redirecting to plans");
    return <Navigate to="/subscription/plans" replace />;
  }

  if (requiredRole && !hasRequiredRole()) {
    // User doesn't have the required role
    console.log("Required role not met, redirecting to plans");
    return <Navigate to="/subscription/plans" replace />;
  }

  // User is authenticated and has required subscription/role if applicable
  return <>{children}</>;
};

export default ProtectedRoute;
