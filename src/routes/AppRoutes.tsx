
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";

// Public pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// Protected pages
import Dashboard from "@/pages/Dashboard";
import PetitionNew from "@/pages/PetitionNew";
import PetitionList from "@/pages/PetitionList";
import PetitionDetail from "@/pages/PetitionDetail";
import JudgmentChamber from "@/pages/JudgmentChamber";
import PublicArchive from "@/pages/PublicArchive";
import Simulation from "@/pages/Simulation";
import Billing from "@/pages/Billing";
import AdminPanel from "@/pages/AdminPanel";
import Profile from "@/pages/Profile";

// Route protection component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-justice-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <TooltipProvider>
      <Routes>
        {/* Default route - redirect based on auth state */}
        <Route 
          path="/" 
          element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />
        
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        
        {/* Public archive is accessible to everyone */}
        <Route path="/public-archive" element={<PublicArchive />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/petition/new" element={
          <ProtectedRoute>
            <PetitionNew />
          </ProtectedRoute>
        } />
        
        <Route path="/petitions" element={
          <ProtectedRoute>
            <PetitionList />
          </ProtectedRoute>
        } />
        
        <Route path="/petition/:id" element={
          <ProtectedRoute>
            <PetitionDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/judgment-chamber" element={
          <ProtectedRoute>
            <JudgmentChamber />
          </ProtectedRoute>
        } />
        
        <Route path="/simulation" element={
          <ProtectedRoute>
            <Simulation />
          </ProtectedRoute>
        } />
        
        <Route path="/billing" element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Catch-all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </TooltipProvider>
  );
};
