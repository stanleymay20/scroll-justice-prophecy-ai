
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, User, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
}

const SettingsPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: ''
  });

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          username: data.username || ''
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Sacred Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          username: formData.username,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Sacred Profile Updated",
        description: "Your profile has been successfully updated",
      });

      fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Sacred Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-justice-primary mx-auto mb-4"></div>
            <p className="text-justice-light">Loading sacred settings...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-cinzel text-white flex items-center">
            <Settings className="h-8 w-8 mr-3 text-justice-primary" />
            Sacred Settings
          </h1>
          <p className="text-justice-light mt-2">
            Manage your sacred profile and preferences
          </p>
        </div>

        {/* Profile Settings */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-6 w-6 text-justice-primary" />
            <h2 className="text-xl font-cinzel text-white">Profile Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="full_name" className="block text-sm font-medium text-justice-light">
                  Full Name
                </label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="bg-black/20 border-justice-primary/30 text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-justice-light">
                  Username
                </label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your username"
                  className="bg-black/20 border-justice-primary/30 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-justice-light">
                Email Address
              </label>
              <Input
                value={user?.email || ''}
                disabled
                className="bg-black/30 border-justice-primary/20 text-justice-light/70"
              />
              <p className="text-xs text-justice-light/70">
                Email cannot be changed from this interface
              </p>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="bg-justice-primary hover:bg-justice-tertiary"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </GlassCard>

        {/* Account Information */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-cinzel text-white mb-4">Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-justice-light">Account Email:</span>
              <span className="text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-justice-light">Account Created:</span>
              <span className="text-white">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-justice-light">Sacred Status:</span>
              <span className="text-justice-primary">Active Member</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
