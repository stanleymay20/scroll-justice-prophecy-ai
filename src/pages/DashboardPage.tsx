
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollProphetService } from '@/services/scrollProphetService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Scroll, 
  Scale, 
  Clock, 
  Eye, 
  Download, 
  Zap,
  FileText,
  Award
} from 'lucide-react';
import { PetitionForm } from '@/components/petition/PetitionForm';
import { ScrollPetition } from '@/types/petition';

interface DashboardStats {
  totalPetitions: number;
  pendingPetitions: number;
  judgedPetitions: number;
  totalCompensation: number;
}

const DashboardPage = () => {
  const { user, userRole } = useAuth();
  const [petitions, setPetitions] = useState<ScrollPetition[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPetitions: 0,
    pendingPetitions: 0,
    judgedPetitions: 0,
    totalCompensation: 0
  });
  const [loading, setLoading] = useState(true);
  const [processingJudgment, setProcessingJudgment] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch user's petitions
      const { data: petitionsData, error: petitionsError } = await supabase
        .from('scroll_petitions')
        .select('*')
        .eq('petitioner_id', user.id)
        .order('created_at', { ascending: false });
      
      if (petitionsError) throw petitionsError;
      setPetitions(petitionsData || []);
      
      // Calculate stats
      const totalPetitions = petitionsData?.length || 0;
      const pendingPetitions = petitionsData?.filter(p => p.status === 'pending').length || 0;
      const judgedPetitions = petitionsData?.filter(p => p.status === 'verdict_delivered').length || 0;
      
      setStats({
        totalPetitions,
        pendingPetitions,
        judgedPetitions,
        totalCompensation: 0 // Will implement when scroll_judgments table exists
      });
      
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

  const triggerAIJudgment = async (petitionId: string) => {
    setProcessingJudgment(petitionId);
    
    try {
      await ScrollProphetService.triggerJudgment(petitionId);
      
      toast({
        title: "Sacred Judgment Rendered",
        description: "The ScrollProphet has delivered divine judgment",
      });
      
      // Refresh data
      await fetchDashboardData();
      
    } catch (error: any) {
      console.error('Error triggering judgment:', error);
      toast({
        title: "Sacred Error", 
        description: "Failed to render judgment",
        variant: "destructive"
      });
    } finally {
      setProcessingJudgment(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
      case 'in_review': return 'bg-blue-500/20 text-blue-300 border-blue-500';
      case 'verdict_delivered': return 'bg-green-500/20 text-green-300 border-green-500';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500';
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-justice-primary"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-cinzel text-white flex items-center">
              <Scroll className="h-8 w-8 mr-3 text-justice-tertiary" />
              Sacred Dashboard
            </h1>
            <p className="text-justice-light mt-2">
              Track your petitions and divine judgments
            </p>
          </div>
          <Badge className="bg-justice-primary/20 text-justice-primary border-justice-primary">
            {userRole && userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-justice-primary" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalPetitions}</p>
                <p className="text-sm text-justice-light">Total Petitions</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.pendingPetitions}</p>
                <p className="text-sm text-justice-light">Pending</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3">
              <Scale className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.judgedPetitions}</p>
                <p className="text-sm text-justice-light">Judged</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-justice-tertiary" />
              <div>
                <p className="text-2xl font-bold text-white">€0</p>
                <p className="text-sm text-justice-light">Compensation</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Petition Form */}
          <div>
            <PetitionForm />
          </div>

          {/* Recent Petitions */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-cinzel text-white mb-4 flex items-center">
              <Scroll className="h-5 w-5 mr-2 text-justice-primary" />
              Your Petitions
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {petitions.length === 0 ? (
                <p className="text-justice-light text-center py-8">
                  No petitions filed yet. File your first sacred petition!
                </p>
              ) : (
                petitions.map((petition) => (
                  <div key={petition.id} className="bg-black/20 p-4 rounded-lg border border-justice-primary/10">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm">{petition.title}</h3>
                      <Badge className={getStatusColor(petition.status || 'pending')}>
                        {(petition.status || 'pending').replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <p className="text-justice-light text-xs mb-3 line-clamp-2">
                      {petition.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-justice-light">
                        {new Date(petition.created_at).toLocaleDateString()}
                      </span>
                      
                      <div className="flex space-x-2">
                        {petition.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => triggerAIJudgment(petition.id)}
                            disabled={processingJudgment === petition.id}
                            className="h-7 text-xs"
                          >
                            {processingJudgment === petition.id ? (
                              <>Processing...</>
                            ) : (
                              <>
                                <Zap className="h-3 w-3 mr-1" />
                                Judge Now
                              </>
                            )}
                          </Button>
                        )}
                        
                        {petition.status === 'verdict_delivered' && (
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            View Verdict
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
