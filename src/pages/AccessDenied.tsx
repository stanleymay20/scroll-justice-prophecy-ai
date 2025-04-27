
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const { subscriptionTier } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-justice-dark to-black p-4">
      <GlassCard className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Sacred Access Denied</h1>
        
        <p className="text-white/70 mb-6">
          You don't have the required scroll permission to access this sacred area.
        </p>
        
        <div className="mb-6 p-4 bg-black/40 rounded-lg">
          <h2 className="font-medium mb-2">Your Current Status</h2>
          <p className="text-white/60 text-sm">
            Current Scroll Tier: {subscriptionTier ? subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1) : 'Free Witness'}
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/subscription/plans")}
            className="w-full bg-gradient-to-r from-justice-primary to-justice-secondary hover:opacity-90 transition-opacity"
          >
            Upgrade Subscription
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="w-full"
          >
            Return to Dashboard
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default AccessDenied;
