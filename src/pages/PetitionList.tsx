
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, FileText, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const PetitionList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [petitions, setPetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPetitions();
    }
  }, [user]);

  const fetchPetitions = async () => {
    try {
      const { data, error } = await supabase
        .from('scroll_petitions')
        .select('*')
        .eq('petitioner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPetitions(data || []);
    } catch (error) {
      console.error('Error fetching petitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500';
      case 'in_review': return 'bg-blue-500';
      case 'verdict_delivered': return 'bg-green-500';
      case 'sealed': return 'bg-purple-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Petitions</h1>
            <p className="text-justice-light/80">
              Track your submitted cases and their verdicts
            </p>
          </div>
          <Button
            onClick={() => navigate('/petition/new')}
            className="bg-justice-primary hover:bg-justice-tertiary"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Petition
          </Button>
        </div>

        {petitions.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <FileText className="h-16 w-16 text-justice-light/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Petitions Yet</h3>
            <p className="text-justice-light/70 mb-4">
              You haven't filed any petitions yet. Start by submitting your first case.
            </p>
            <Button
              onClick={() => navigate('/petition/new')}
              className="bg-justice-primary hover:bg-justice-tertiary"
            >
              <Plus className="mr-2 h-4 w-4" />
              File Your First Petition
            </Button>
          </GlassCard>
        ) : (
          <div className="grid gap-6">
            {petitions.map((petition) => (
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
                  <Badge className={`${getStatusColor(petition.status)} text-white ml-4`}>
                    {petition.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-justice-light/60">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(petition.created_at), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Case #{petition.id.substring(0, 8)}
                  </div>
                  {petition.scroll_integrity_score && (
                    <div className="flex items-center">
                      <span>Integrity: {petition.scroll_integrity_score}/100</span>
                    </div>
                  )}
                </div>
                
                {petition.verdict && (
                  <div className="mt-4 p-3 bg-green-900/20 border border-green-500/50 rounded">
                    <p className="text-green-400 text-sm font-medium">Verdict Available</p>
                    <p className="text-green-300 text-sm">Click to view full judgment</p>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetitionList;
