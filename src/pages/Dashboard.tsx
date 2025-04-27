
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import ScrollLayout from "@/components/layout/ScrollLayout";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Gavel, Users, FileText, MessageSquare } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, userRole, subscriptionTier } = useAuth();

  return (
    <ScrollLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Scroll Dashboard</h1>
        
        <p className="text-white/70 mb-8">
          Welcome to your sacred journey, {user?.email?.split('@')[0]}. Your scroll status awaits your guidance.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center">
              <div className="bg-justice-primary/20 p-3 rounded-full mr-4">
                <Gavel className="h-6 w-6 text-justice-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Active Courtrooms</h3>
                <p className="text-white/70">No active sessions</p>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" asChild>
              <Link to="/courtrooms">View Courtrooms</Link>
            </Button>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center">
              <div className="bg-justice-primary/20 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-justice-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Scroll Community</h3>
                <p className="text-white/70">Join the discussion</p>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" asChild>
              <Link to="/community">View Community</Link>
            </Button>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center">
              <div className="bg-justice-primary/20 p-3 rounded-full mr-4">
                <FileText className="h-6 w-6 text-justice-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Documents</h3>
                <p className="text-white/70">Upload and analyze</p>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" asChild>
              <Link to="/documents">View Documents</Link>
            </Button>
          </GlassCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 col-span-1">
            <h3 className="font-bold text-lg mb-4">Your Scroll Status</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white/60 text-sm">Role</h4>
                <p className="font-medium">{userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)}` : 'Witness'}</p>
              </div>
              
              <div>
                <h4 className="text-white/60 text-sm">Subscription</h4>
                <p className="font-medium">{subscriptionTier ? `${subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}` : 'Free'}</p>
              </div>
              
              <div>
                <h4 className="text-white/60 text-sm">Scroll Points</h4>
                <p className="font-medium">0</p>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/profile">View Profile</Link>
                </Button>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6 col-span-1 lg:col-span-2">
            <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
            
            <div className="text-center py-6 text-white/60">
              <p>No recent scroll activity</p>
              <p className="text-sm mt-2">Join a courtroom or community discussion to begin</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Button variant="outline" asChild>
                <Link to="/courtrooms">Join Courtroom</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/community">View Community</Link>
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </ScrollLayout>
  );
};

export default Dashboard;
