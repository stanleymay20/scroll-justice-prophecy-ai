
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { PulseEffect } from '@/components/advanced-ui/PulseEffect';
import { Scroll, Scale, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DashboardStats {
  totalPetitions: number;
  pendingPetitions: number;
  totalJudgments: number;
  systemStatus: 'active' | 'maintenance' | 'offline';
}

interface Petition {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

interface Judgment {
  id: string;
  verdict: string;
  judge_name: string;
  created_at: string;
  petition_title?: string;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPetitions: 0,
    pendingPetitions: 0,
    totalJudgments: 0,
    systemStatus: 'active'
  });
  const [recentPetitions, setRecentPetitions] = useState<Petition[]>([]);
  const [recentJudgments, setRecentJudgments] = useState<Judgment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      console.log('Fetching dashboard data for user:', user.id);

      // Use the existing scroll_petitions table
      const { data: petitions, error: petitionsError } = await supabase
        .from('scroll_petitions')
        .select('id, title, status, created_at')
        .eq('petitioner_id', user.id)
        .order('created_at', { ascending: false });

      if (petitionsError) {
        console.error('Error fetching petitions:', petitionsError);
        throw petitionsError;
      }

      console.log('Fetched petitions:', petitions);

      // Create some sample judgments for demo purposes
      const sampleJudgments = [
        {
          id: '1',
          verdict: 'Case under divine review',
          judge_name: 'ScrollJustice AI',
          created_at: new Date().toISOString(),
          petition_title: 'Sample Petition'
        }
      ];

      // Calculate stats
      const totalPetitions = petitions?.length || 0;
      const pendingPetitions = petitions?.filter(p => p.status === 'pending').length || 0;
      const totalJudgments = sampleJudgments.length;

      setStats({
        totalPetitions,
        pendingPetitions,
        totalJudgments,
        systemStatus: 'active'
      });

      // Transform petitions data to match our interface
      const transformedPetitions = petitions?.map(p => ({
        id: p.id,
        title: p.title,
        status: p.status || 'pending',
        created_at: p.created_at
      })) || [];

      setRecentPetitions(transformedPetitions.slice(0, 5));
      setRecentJudgments(sampleJudgments);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Sacred Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'under_review':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'judged':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'dismissed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <PulseEffect color="bg-justice-primary" size="lg" />
            <p className="text-justice-light mt-4">Loading Sacred Dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-cinzel text-white mb-2">
            Welcome to ScrollJustice, {user?.email?.split('@')[0] || 'Sacred Seeker'}
          </h1>
          <p className="text-justice-light">
            Your Sacred Dashboard - {formatDate(new Date().toISOString())}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-justice-light">Total Petitions</p>
                <p className="text-2xl font-bold text-white">{stats.totalPetitions}</p>
              </div>
              <Scroll className="h-8 w-8 text-justice-primary" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-justice-light">Pending Review</p>
                <p className="text-2xl font-bold text-white">{stats.pendingPetitions}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-justice-light">Sacred Judgments</p>
                <p className="text-2xl font-bold text-white">{stats.totalJudgments}</p>
              </div>
              <Scale className="h-8 w-8 text-justice-tertiary" />
            </div>
          </GlassCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Petitions Panel */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-cinzel text-white mb-4 flex items-center">
              <Scroll className="h-5 w-5 mr-2 text-justice-primary" />
              My Recent Petitions
            </h2>
            <div className="space-y-3">
              {recentPetitions.length > 0 ? (
                recentPetitions.map((petition) => (
                  <div key={petition.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{petition.title}</h3>
                      <p className="text-sm text-justice-light">{formatDate(petition.created_at)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(petition.status)}
                      <span className="text-sm text-justice-light capitalize">{petition.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Scroll className="h-12 w-12 text-justice-light/50 mx-auto mb-3" />
                  <p className="text-justice-light">No petitions yet</p>
                  <p className="text-sm text-justice-light/70">Submit your first petition to begin</p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Recent Judgments Panel */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-cinzel text-white mb-4 flex items-center">
              <Scale className="h-5 w-5 mr-2 text-justice-tertiary" />
              Recent Judgments
            </h2>
            <div className="space-y-3">
              {recentJudgments.length > 0 ? (
                recentJudgments.map((judgment) => (
                  <div key={judgment.id} className="p-3 bg-black/20 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium">{judgment.petition_title}</h3>
                      <span className="text-sm text-justice-light">{formatDate(judgment.created_at)}</span>
                    </div>
                    <p className="text-sm text-justice-light mb-1">
                      <strong>Verdict:</strong> {judgment.verdict}
                    </p>
                    <p className="text-xs text-justice-light/70">
                      Judge: {judgment.judge_name}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Scale className="h-12 w-12 text-justice-light/50 mx-auto mb-3" />
                  <p className="text-justice-light">No judgments yet</p>
                  <p className="text-sm text-justice-light/70">Judgments will appear here once rendered</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* System Status Panel */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-cinzel text-white mb-4">System Status</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <PulseEffect color="bg-green-500" size="sm" />
                <span className="text-white font-medium">ScrollEngine: Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-justice-light text-sm">All systems operational</span>
              </div>
            </div>
            <div className="text-sm text-justice-light">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
