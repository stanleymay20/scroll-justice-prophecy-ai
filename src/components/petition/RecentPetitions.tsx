
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentPetitionsProps {
  userId: string;
}

export const RecentPetitions: React.FC<RecentPetitionsProps> = ({ userId }) => {
  const [petitions, setPetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentPetitions();
  }, [userId]);

  const fetchRecentPetitions = async () => {
    try {
      const { data, error } = await supabase
        .from('scroll_petitions')
        .select('*')
        .eq('petitioner_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setPetitions(data || []);
    } catch (error) {
      console.error('Error fetching recent petitions:', error);
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
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-justice-primary"></div>
      </div>
    );
  }

  if (petitions.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-justice-light/50 mx-auto mb-3" />
        <p className="text-justice-light/70">No petitions filed yet</p>
        <Button
          onClick={() => navigate('/petition/new')}
          className="mt-3 bg-justice-primary hover:bg-justice-tertiary"
          size="sm"
        >
          File Your First Petition
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {petitions.map((petition) => (
        <div
          key={petition.id}
          className="flex items-center justify-between p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer"
          onClick={() => navigate(`/petition/${petition.id}`)}
        >
          <div className="flex-1">
            <h4 className="font-medium text-white line-clamp-1">{petition.title}</h4>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center text-sm text-justice-light/60">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(petition.created_at).toLocaleDateString()}
              </div>
              <Badge className={`${getStatusColor(petition.status)} text-white text-xs`}>
                {petition.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-justice-light/50" />
        </div>
      ))}
      
      {petitions.length >= 5 && (
        <Button
          onClick={() => navigate('/petitions')}
          variant="outline"
          className="w-full mt-4"
          size="sm"
        >
          View All Petitions
        </Button>
      )}
    </div>
  );
};
