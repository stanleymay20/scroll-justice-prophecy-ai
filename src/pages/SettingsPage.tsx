
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Settings, User, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

const SettingsPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: ''
  });

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (data) {
        const profileData: Profile = {
          id: data.id,
          full_name: data.full_name || null,
          username: data.username || null,
          avatar_url: data.avatar_url || null,
          bio: data.bio || null,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          username: profileData.username || '',
          bio: profileData.bio || ''
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
          full_name: formData.full_name.trim() || null,
          username: formData.username.trim() || null,
          bio: formData.bio.trim() || null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Sacred Profile Updated",
        description: "Your profile has been successfully updated",
      });

      fetchProfile(); // Refresh profile data
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Sacred Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-cinzel text-white flex items-center">
            <Settings className="h-8 w-8 mr-3 text-justice-tertiary" />
            Sacred Settings
          </h1>
          <p className="text-justice-light mt-2">
            Manage your sacred profile and preferences
          </p>
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-6 w-6 text-justice-primary" />
            <h2 className="text-xl font-cinzel text-white">Profile Information</h2>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-justice-primary mx-auto mb-4"></div>
              <p className="text-justice-light">Loading sacred profile...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="full_name" className="block text-sm font-medium text-justice-light">
                  Full Name
                </label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
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
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="bg-black/20 border-justice-primary/30 text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-medium text-justice-light">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="bg-black/20 border-justice-primary/30 text-white"
                />
              </div>

              <div className="flex space-x-3">
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
          )}
        </GlassCard>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
