
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/language';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/layout/NavBar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { PetitionQuickFile } from '@/components/petition/PetitionQuickFile';
import { RecentPetitions } from '@/components/petition/RecentPetitions';
import { Plus, Scale, Gavel, FileText, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, userRole, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPetitions: 0,
    pendingPetitions: 0,
    judgedPetitions: 0,
    successRate: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const { data: petitions } = await supabase
        .from('scroll_petitions')
        .select('status')
        .eq('petitioner_id', user.id);

      if (petitions) {
        const total = petitions.length;
        const pending = petitions.filter(p => p.status === 'pending' || p.status === 'under_review').length;
        const judged = petitions.filter(p => p.status === 'judged').length;
        const success = judged > 0 ? Math.round((judged / total) * 100) : 0;

        setStats({
          totalPetitions: total,
          pendingPetitions: pending,
          judgedPetitions: judged,
          successRate: success
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-justice-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('dashboard.welcome')}, {user.user_metadata?.full_name || 'Sacred Petitioner'}
          </h1>
          <p className="text-justice-light/80">
            {t('dashboard.manage_petitions')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-justice-light/70 text-sm">{t('dashboard.total_petitions')}</p>
                <p className="text-2xl font-bold text-white">{stats.totalPetitions}</p>
              </div>
              <FileText className="h-8 w-8 text-justice-primary" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-justice-light/70 text-sm">{t('dashboard.pending')}</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pendingPetitions}</p>
              </div>
              <Scale className="h-8 w-8 text-yellow-400" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-justice-light/70 text-sm">{t('dashboard.judged')}</p>
                <p className="text-2xl font-bold text-green-400">{stats.judgedPetitions}</p>
              </div>
              <Gavel className="h-8 w-8 text-green-400" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-justice-light/70 text-sm">{t('dashboard.success_rate')}</p>
                <p className="text-2xl font-bold text-justice-primary">{stats.successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-justice-primary" />
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{t('dashboard.file_petition')}</h2>
              <PetitionQuickFile onSuccess={fetchUserStats} />
            </GlassCard>
          </div>

          <div>
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{t('dashboard.quick_actions')}</h2>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/petition/new')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('dashboard.new_petition')}
                </Button>
                
                <Button
                  onClick={() => navigate('/petitions')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t('dashboard.view_all')}
                </Button>
                
                <Button
                  onClick={() => navigate('/simulation')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Scale className="mr-2 h-4 w-4" />
                  {t('dashboard.simulation')}
                </Button>

                {(userRole === 'scroll_judge' || userRole === 'admin') && (
                  <Button
                    onClick={() => navigate('/judgment-chamber')}
                    className="w-full justify-start bg-justice-primary hover:bg-justice-tertiary"
                  >
                    <Gavel className="mr-2 h-4 w-4" />
                    {t('dashboard.judgment_chamber')}
                  </Button>
                )}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Recent Petitions */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">{t('dashboard.recent_petitions')}</h2>
          <RecentPetitions userId={user.id} />
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
