
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black flex items-center justify-center">
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
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
