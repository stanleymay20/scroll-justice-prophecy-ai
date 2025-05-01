
import { useState } from 'react';
import { ScrollPetition } from '@/types/petition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { PulseEffect } from '@/components/advanced-ui/PulseEffect';
import { useNavigate } from 'react-router-dom';
import { Loader2, Shield, Gavel, User, Calendar, Lock, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PetitionCardProps {
  petition: ScrollPetition;
  isAdmin?: boolean;
  onUpdate: (petition: ScrollPetition) => void;
}

export function PetitionCard({ petition, isAdmin = false, onUpdate }: PetitionCardProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/courtroom/${petition.id}`);
  };
  
  // Status badge color
  const getStatusBadge = () => {
    switch (petition.status) {
      case 'pending':
        return <Badge className="bg-amber-500 text-justice-dark">Awaiting Review</Badge>;
      case 'in_review':
        return <Badge className="bg-blue-500 text-justice-dark">In Review</Badge>;
      case 'verdict_delivered':
        return <Badge className="bg-green-500 text-justice-dark">Verdict Delivered</Badge>;
      case 'sealed':
        return <Badge className="bg-purple-500 text-justice-dark">Sealed</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive text-white">Rejected</Badge>;
      default:
        return <Badge className="bg-justice-light/50">Unknown</Badge>;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  return (
    <GlassCard className={`p-6 ${petition.is_sealed ? 'border-purple-500/50' : ''}`}>
      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1 pr-20">
            {petition.title}
            {petition.is_sealed && (
              <Lock className="h-4 w-4 text-purple-500 ml-2 inline-block" />
            )}
          </h3>
          
          <div className="flex flex-wrap gap-2 items-center text-sm text-justice-light/70">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(petition.created_at)}
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              Petitioner #{petition.petitioner_id.substring(0, 8)}
            </div>
            {petition.assigned_judge_id && (
              <div className="flex items-center">
                <Gavel className="h-4 w-4 mr-1" />
                Judge #{petition.assigned_judge_id.substring(0, 8)}
              </div>
            )}
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Integrity: {petition.scroll_integrity_score}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {getStatusBadge()}
        </div>
      </div>
      
      <p className={`text-justice-light mb-4 ${petition.is_sealed ? 'blur-sm select-none' : ''}`}>
        {petition.description.length > 200
          ? `${petition.description.substring(0, 200)}...`
          : petition.description}
      </p>
      
      {petition.verdict && !petition.is_sealed && (
        <div className="mb-4 p-3 bg-justice-primary/10 border border-justice-primary/30 rounded-md">
          <div className="flex items-center mb-2">
            <Gavel className="h-5 w-5 text-justice-primary mr-2" />
            <h4 className="text-lg font-medium text-white">Sacred Verdict</h4>
          </div>
          <p className="text-justice-light">
            {petition.verdict.length > 100
              ? `${petition.verdict.substring(0, 100)}...`
              : petition.verdict}
          </p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          onClick={handleViewDetails}
          disabled={loading}
          variant={petition.is_sealed && !isAdmin ? "outline" : "default"}
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {petition.is_sealed && !isAdmin 
            ? "View Sealed Record" 
            : petition.verdict 
              ? "View Full Verdict" 
              : "View Details"}
        </Button>
        
        {petition.verdict && !petition.is_sealed && (
          <div className="relative">
            <Button 
              variant="outline" 
              className="border-justice-primary text-justice-primary"
              onClick={() => navigate(`/courtroom/${petition.id}/seal`)}
            >
              Seal Verdict
            </Button>
            <div className="absolute -top-1 -right-1">
              <PulseEffect color="bg-justice-primary" size="sm" />
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
