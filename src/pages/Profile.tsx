
import { useEffect, useState } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { MetaTags } from '@/components/MetaTags';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, LogOut } from 'lucide-react';
import { FlameIntegrityMonitor } from '@/components/courtroom/FlameIntegrityMonitor';
import { QRJoinLink } from '@/components/onboarding/QRJoinLink';

export default function Profile() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    avatar_url: ''
  });
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setProfile({
          username: data.username || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          bio: profile.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your scroll identity has been saved."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update your profile."
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
  };
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.id}.${fileExt}`;
    
    try {
      setSaving(true);
      
      // Upload avatar to storage
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update profile with avatar URL
      const avatar_url = urlData.publicUrl;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      setProfile(prev => ({
        ...prev,
        avatar_url
      }));
      
      toast({
        title: "Avatar Updated",
        description: "Your sacred image has been changed."
      });
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        variant: "destructive",
        title: "Avatar Update Failed",
        description: "Could not update your avatar image."
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="Profile" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Sacred Scroll Identity</h1>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-justice-primary" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <div className="flex flex-col items-center space-y-3">
                      <Avatar className="h-24 w-24">
                        {profile.avatar_url ? (
                          <AvatarImage src={profile.avatar_url} alt="Profile" />
                        ) : (
                          <AvatarFallback className="bg-justice-primary/20 text-justice-primary text-xl">
                            {profile.username?.charAt(0) || user?.email?.charAt(0) || '?'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div>
                        <label className="block">
                          <span className="sr-only">Choose profile photo</span>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="w-full text-sm text-justice-light
                              file:mr-4 file:py-2 file:px-4 file:rounded
                              file:border-0 file:text-sm file:font-semibold
                              file:bg-justice-primary/20 file:text-justice-primary
                              hover:file:bg-justice-primary/30"
                          />
                        </label>
                      </div>
                    </div>
                    
                    {/* Basic Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-justice-light mb-1">
                          Sacred Identity Name
                        </label>
                        <Input
                          value={profile.username}
                          onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                          placeholder="Your seeker name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-justice-light mb-1">
                          Email
                        </label>
                        <Input
                          value={user?.email || ''}
                          disabled
                          className="text-justice-light/70"
                        />
                        <p className="text-xs mt-1 text-justice-light/50">
                          Email cannot be changed
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-justice-light mb-1">
                      Sacred Bio
                    </label>
                    <Textarea
                      value={profile.bio || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Share your purpose in seeking justice..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="pt-2 flex justify-between">
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={saving}
                      className="bg-justice-tertiary hover:bg-justice-tertiary/80"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> 
                          Save Changes
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={handleLogout} 
                      variant="outline"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> 
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </GlassCard>
            
            <GlassCard className="p-6 mt-6">
              <h2 className="text-xl font-bold text-white mb-4">Sacred Account Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-justice-light/70">User ID</p>
                    <p className="text-justice-light font-mono text-xs">
                      {user?.id || 'Not logged in'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-justice-light/70">Account Created</p>
                    <p className="text-justice-light">
                      {user?.created_at ? 
                        new Date(user.created_at).toLocaleDateString() : 
                        'Unknown'}
                    </p>
                  </div>
                </div>
                
                <Separator className="my-4 bg-justice-light/10" />
                
                <Button
                  variant="ghost"
                  onClick={() => navigate('/subscription/manage')}
                  className="w-full justify-start"
                >
                  Manage Subscription
                </Button>
              </div>
            </GlassCard>
          </div>
          
          <div className="space-y-6">
            <FlameIntegrityMonitor 
              userId={user?.id}
            />
            
            <QRJoinLink />
          </div>
        </div>
      </div>
    </div>
  );
}
