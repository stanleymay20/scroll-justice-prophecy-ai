
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Scale, Calendar, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Judgment {
  id: string;
  verdict: string;
  reasoning: string;
  judge_name: string;
  created_at: string;
  petitions: {
    title: string;
    description: string;
  };
}

const JudgmentsPage = () => {
  const { user } = useAuth();
  const [judgments, setJudgments] = useState<Judgment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJudgments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('judgments')
        .select(`
          id,
          verdict,
          reasoning,
          judge_name,
          created_at,
          petitions (
            title,
            description
          )
        `)
        .eq('petitioner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJudgments(data || []);
    } catch (error: any) {
      console.error('Error fetching judgments:', error);
      toast({
        title: "Sacred Error",
        description: "Failed to load judgments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchJudgments();
  }, [user]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-cinzel text-white flex items-center">
            <Scale className="h-8 w-8 mr-3 text-justice-tertiary" />
            Sacred Judgments
          </h1>
          <p className="text-justice-light mt-2">
            Divine verdicts rendered upon your petitions
          </p>
        </div>

        {/* Judgments List */}
        <div className="space-y-6">
          {loading ? (
            <GlassCard className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-justice-primary mx-auto mb-4"></div>
              <p className="text-justice-light">Loading sacred judgments...</p>
            </GlassCard>
          ) : judgments.length > 0 ? (
            judgments.map((judgment) => (
              <GlassCard key={judgment.id} className="p-6">
                <div className="space-y-4">
                  {/* Judgment Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {judgment.petitions?.title}
                      </h3>
                      <p className="text-justice-light text-sm mb-4">
                        {judgment.petitions?.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-justice-light text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(judgment.created_at)}</span>
                    </div>
                  </div>

                  {/* Verdict */}
                  <div className="bg-black/30 p-4 rounded-lg border border-justice-primary/20">
                    <div className="flex items-center space-x-2 mb-3">
                      <Scale className="h-5 w-5 text-justice-tertiary" />
                      <h4 className="text-lg font-semibold text-white">Divine Verdict</h4>
                    </div>
                    <p className="text-justice-light text-lg font-medium mb-2">
                      {judgment.verdict}
                    </p>
                    {judgment.reasoning && (
                      <div className="mt-3 pt-3 border-t border-justice-primary/10">
                        <h5 className="text-sm font-medium text-justice-light mb-2">Sacred Reasoning:</h5>
                        <p className="text-justice-light/80 text-sm leading-relaxed">
                          {judgment.reasoning}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Judge Information */}
                  <div className="flex items-center space-x-2 text-justice-light/70 text-sm">
                    <User className="h-4 w-4" />
                    <span>Rendered by: {judgment.judge_name}</span>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <GlassCard className="p-12 text-center">
              <Scale className="h-16 w-16 text-justice-light/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Judgments Yet</h3>
              <p className="text-justice-light mb-6">
                Judgments will appear here once your petitions have been reviewed and decided upon by the sacred court
              </p>
              <p className="text-justice-light/70 text-sm">
                Submit petitions to receive divine judgments
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default JudgmentsPage;
