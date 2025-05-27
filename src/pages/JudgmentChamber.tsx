
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Gavel, Clock, Users, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JudgmentChamber = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [pendingPetitions, setPendingPetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (userRole === 'scroll_judge' || userRole === 'admin')) {
      fetchPendingPetitions();
    }
  }, [user, userRole]);

  const fetchPendingPetitions = async () => {
    try {
      const { data, error } = await supabase
        .from('scroll_petitions')
        .select('*')
        .in('status', ['pending', 'in_review'])
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPendingPetitions(data || []);
    } catch (error) {
      console.error('Error fetching petitions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (userRole !== 'scroll_judge' && userRole !== 'admin')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
        <NavBar />
        <div className="container mx-auto px-4 pt-20 pb-16">
          <GlassCard className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Access Denied</h3>
            <p className="text-justice-light/70">
              Only authorized Scroll Judges and Administrators can access the Judgment Chamber.
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
            <Gavel className="inline mr-3 h-8 w-8" />
            Sacred Judgment Chamber
          </h1>
          <p className="text-justice-light/80">
            Review pending petitions and deliver AI-assisted verdicts
          </p>
          <div className="mt-4 p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg">
            <p className="text-amber-200 text-sm">
              <strong>Judicial Responsibility:</strong> All verdicts rendered through this system are AI-assisted advisory opinions. 
              Ensure proper legal review and disclaimer inclusion before finalizing any judgment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-justice-light/70 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-amber-400">{pendingPetitions.length}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-400" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-justice-light/70 text-sm">Active Judges</p>
                <p className="text-2xl font-bold text-green-400">1</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-justice-light/70 text-sm">Your Role</p>
                <p className="text-lg font-semibold text-justice-primary capitalize">
                  {userRole?.replace('_', ' ')}
                </p>
              </div>
              <Gavel className="h-8 w-8 text-justice-primary" />
            </div>
          </GlassCard>
        </div>

        {pendingPetitions.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Gavel className="h-16 w-16 text-justice-light/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Pending Cases</h3>
            <p className="text-justice-light/70">
              All petitions have been reviewed. New cases will appear here when submitted.
            </p>
          </GlassCard>
        ) : (
          <div className="grid gap-6">
            {pendingPetitions.map((petition) => (
              <GlassCard 
                key={petition.id} 
                className="p-6 hover:bg-justice-dark/60 transition-colors cursor-pointer"
                onClick={() => navigate(`/petition/${petition.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {petition.title}
                    </h3>
                    <p className="text-justice-light/70 line-clamp-2">
                      {petition.description}
                    </p>
                  </div>
                  <Badge className="bg-amber-500 text-black ml-4">
                    AWAITING JUDGMENT
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-justice-light/60 mb-4">
                  <span>Case #{petition.id.substring(0, 8)}</span>
                  <span>Submitted: {new Date(petition.created_at).toLocaleDateString()}</span>
                  <span>Integrity: {petition.scroll_integrity_score || 100}/100</span>
                </div>

                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/petition/${petition.id}`);
                  }}
                  className="bg-justice-primary hover:bg-justice-tertiary"
                >
                  <Gavel className="mr-2 h-4 w-4" />
                  Review & Judge
                </Button>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgmentChamber;
