
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireSubscription?: boolean; 
  requiredTier?: "basic" | "professional" | "enterprise";
}

const hasAccess = (currentTier: string, requiredTier: string): boolean => {
  const tierLevels: Record<string, number> = {
    'basic': 0,
    'professional': 1,
    'enterprise': 2
  };
  
  return tierLevels[currentTier.toLowerCase()] >= tierLevels[requiredTier.toLowerCase()];
};

const ProtectedRoute = ({ 
  children, 
  requireSubscription = false,
  requiredTier = "basic"
}: ProtectedRouteProps) => {
  const { user, loading, subscription } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    // Redirect to login page with returnUrl
    return <Navigate to="/signin" state={{ returnUrl: location.pathname }} replace />;
  }

  // Check subscription if required
  if (requireSubscription) {
    if (!subscription || !subscription.active) {
      return <Navigate to="/subscription/plans" state={{ returnUrl: location.pathname }} replace />;
    }

    // Check tier level if required
    if (!hasAccess(subscription.tier || 'basic', requiredTier)) {
      return <Navigate to="/subscription/plans" state={{ requiredTier, returnUrl: location.pathname }} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
