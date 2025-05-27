
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Users, 
  FileText, 
  Gavel, 
  AlertTriangle, 
  Activity,
  Database,
  Settings
} from 'lucide-react';

const AdminPanel = () => {
  const { user, userRole } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPetitions: 0,
    pendingReviews: 0,
    activeJudges: 0,
    systemHealth: 'healthy' as 'healthy' | 'warning' | 'critical'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && userRole === 'admin') {
      fetchAdminStats();
    }
  }, [user, userRole]);

  const fetchAdminStats = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact' });

      // Fetch petition count
      const { count: petitionCount } = await supabase
        .from('scroll_petitions')
        .select('*', { count: 'exact' });

      // Fetch pending reviews
      const { count: pendingCount } = await supabase
        .from('scroll_petitions')
        .select('*', { count: 'exact' })
        .in('status', ['pending', 'in_review']);

      // Fetch active judges
      const { count: judgeCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact' })
        .eq('role', 'scroll_judge');

      setStats({
        totalUsers: userCount || 0,
        totalPetitions: petitionCount || 0,
        pendingReviews: pendingCount || 0,
        activeJudges: judgeCount || 0,
        systemHealth: 'healthy'
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
        <NavBar />
        <div className="container mx-auto px-4 pt-20 pb-16">
          <GlassCard className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Access Denied</h3>
            <p className="text-justice-light/70">
              Only system administrators can access this panel.
            </p>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
        <NavBar />
        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-justice-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            <Shield className="inline mr-3 h-8 w-8" />
            ScrollJustice Admin Panel
          </h1>
          <p className="text-justice-light/80">
            System administration and oversight for the Sacred Legal Platform
          </p>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-justice-light/70 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-justice-light/70 text-sm">Total Petitions</p>
                <p className="text-2xl font-bold text-white">{stats.totalPetitions}</p>
              </div>
              <FileText className="h-8 w-8 text-green-400" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-justice-light/70 text-sm">Pending Reviews</p>
                <p className="text-2xl font-bold text-amber-400">{stats.pendingReviews}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-400" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-justice-light/70 text-sm">Active Judges</p>
                <p className="text-2xl font-bold text-white">{stats.activeJudges}</p>
              </div>
              <Gavel className="h-8 w-8 text-purple-400" />
            </div>
          </GlassCard>
        </div>

        {/* System Status */}
        <GlassCard className="p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            System Status
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
              <span className="text-white">AI Verdict Engine</span>
              <Badge className="bg-green-500 text-white">Operational</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
              <span className="text-white">Database</span>
              <Badge className="bg-green-500 text-white">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
              <span className="text-white">File Storage</span>
              <Badge className="bg-green-500 text-white">Available</Badge>
            </div>
          </div>
        </GlassCard>

        {/* Admin Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">User Management</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage User Roles
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Security Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="mr-2 h-4 w-4" />
                View User Activity
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">System Management</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Database className="mr-2 h-4 w-4" />
                Database Management
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                System Configuration
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Emergency Alerts
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Recent Activity */}
        <GlassCard className="p-6 mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Recent System Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-justice-dark/30 rounded">
              <span className="text-justice-light">New user registered</span>
              <span className="text-justice-light/60 text-sm">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-justice-dark/30 rounded">
              <span className="text-justice-light">AI verdict generated</span>
              <span className="text-justice-light/60 text-sm">5 minutes ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-justice-dark/30 rounded">
              <span className="text-justice-light">Petition submitted</span>
              <span className="text-justice-light/60 text-sm">12 minutes ago</span>
            </div>
          </div>
        </GlassCard>

        {/* Legal Compliance Notice */}
        <div className="mt-8 p-6 bg-amber-900/20 border border-amber-500/50 rounded-lg">
          <h4 className="text-amber-200 font-semibold mb-2">Administrative Responsibility</h4>
          <p className="text-amber-200/80 text-sm">
            As a system administrator, you have access to sensitive user data and system controls. 
            All actions are logged and monitored. Ensure compliance with data protection regulations 
            and maintain the security and integrity of the ScrollJustice platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
