
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Scroll, Plus, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Petition {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

const PetitionsPage = () => {
  const { user } = useAuth();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchPetitions = async () => {
    if (!user) return;

    try {
      console.log('Fetching petitions for user:', user.id);
      
      const { data, error } = await supabase
        .from('scroll_petitions')
        .select('*')
        .eq('petitioner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching petitions:', error);
        throw error;
      }

      console.log('Fetched petitions:', data);
      
      // Transform the data to match our interface
      const transformedPetitions = data?.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        status: p.status || 'pending',
        created_at: p.created_at
      })) || [];
      
      setPetitions(transformedPetitions);
    } catch (error: any) {
      console.error('Error fetching petitions:', error);
      toast({
        title: "Sacred Error",
        description: "Failed to load petitions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Sacred Challenge",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      console.log('Submitting petition:', formData);
      
      const { error } = await supabase
        .from('scroll_petitions')
        .insert({
          petitioner_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          status: 'pending'
        });

      if (error) {
        console.error('Error submitting petition:', error);
        throw error;
      }

      toast({
        title: "Sacred Petition Submitted",
        description: "Your petition has been submitted for divine judgment",
      });

      setFormData({ title: '', description: '' });
      setShowForm(false);
      fetchPetitions(); // Refresh the list
    } catch (error: any) {
      console.error('Error submitting petition:', error);
      toast({
        title: "Sacred Error",
        description: error.message || "Failed to submit petition",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchPetitions();
  }, [user]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-cinzel text-white flex items-center">
              <Scroll className="h-8 w-8 mr-3 text-justice-primary" />
              Sacred Petitions
            </h1>
            <p className="text-justice-light mt-2">Submit and track your petitions for divine judgment</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-justice-primary hover:bg-justice-tertiary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Petition
          </Button>
        </div>

        {/* New Petition Form */}
        {showForm && (
          <GlassCard className="p-6">
            <h2 className="text-xl font-cinzel text-white mb-4">Submit Sacred Petition</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-justice-light">
                  Petition Title
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter the title of your petition"
                  className="bg-black/20 border-justice-primary/30 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-justice-light">
                  Petition Description
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your petition in detail..."
                  rows={6}
                  className="bg-black/20 border-justice-primary/30 text-white"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-justice-primary hover:bg-justice-tertiary"
                >
                  {submitting ? "Submitting..." : "Submit Petition"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-justice-primary/30 text-justice-light hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </GlassCard>
        )}

        {/* Petitions List */}
        <div className="space-y-4">
          {loading ? (
            <GlassCard className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-justice-primary mx-auto mb-4"></div>
              <p className="text-justice-light">Loading sacred petitions...</p>
            </GlassCard>
          ) : petitions.length > 0 ? (
            petitions.map((petition) => (
              <GlassCard key={petition.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{petition.title}</h3>
                    <p className="text-justice-light mb-3">{petition.description}</p>
                    <p className="text-sm text-justice-light/70">
                      Submitted: {formatDate(petition.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {getStatusIcon(petition.status)}
                    <span className="text-sm text-justice-light capitalize">
                      {petition.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <GlassCard className="p-12 text-center">
              <Scroll className="h-16 w-16 text-justice-light/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Petitions Yet</h3>
              <p className="text-justice-light mb-6">
                Submit your first petition to begin your journey with ScrollJustice
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-justice-primary hover:bg-justice-tertiary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit First Petition
              </Button>
            </GlassCard>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default PetitionsPage;
