
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Scale, Shield, Scroll } from 'lucide-react';
import { MetaTags } from '@/components/MetaTags';

export default function ProductionLogin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate('/courtroom', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
      });
      return;
    }

    setAuthLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Sacred Access Granted",
          description: "You have been authenticated to access the ScrollJustice system.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/courtroom`
          }
        });

        if (error) throw error;

        toast({
          title: "Sacred Witness Registered",
          description: "Your account has been created. You may now access the ScrollJustice system.",
        });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate. Please try again.",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-justice-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="ScrollJustice - Sacred Global Legal System" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto space-y-8">
          {/* Sacred Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Scroll className="h-12 w-12 text-justice-primary" />
              <Scale className="h-10 w-10 text-justice-secondary" />
              <Shield className="h-12 w-12 text-justice-tertiary" />
            </div>
            <h1 className="text-4xl font-bold text-white">ScrollJustice</h1>
            <p className="text-justice-light text-lg">Sacred Global Legal System</p>
            <p className="text-justice-light/80 text-sm">
              AI-Powered Justice • Real Legal Frameworks • Divine Wisdom
            </p>
          </div>

          {/* Authentication Form */}
          <GlassCard className="p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              {mode === 'signin' ? 'Sacred Access' : 'Register as Witness'}
            </h2>

            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-justice-light mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                  className="bg-black/30 border-justice-primary/30 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-justice-light mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                  className="bg-black/30 border-justice-primary/30 text-white"
                />
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-justice-light mb-2">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your password"
                    required
                    className="bg-black/30 border-justice-primary/30 text-white"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={authLoading}
                className="w-full bg-justice-primary hover:bg-justice-tertiary"
              >
                {authLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {mode === 'signin' ? 'Enter Sacred Halls' : 'Register Sacred Witness'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-justice-primary hover:text-justice-secondary transition-colors"
              >
                {mode === 'signin' 
                  ? 'Need to register as a sacred witness?' 
                  : 'Already have sacred access?'
                }
              </button>
            </div>
          </GlassCard>

          {/* Legal Information */}
          <div className="space-y-4">
            <LegalDisclaimer />
            
            <div className="text-center text-xs text-justice-light/60">
              <p>© {new Date().getFullYear()} ScrollJustice • Sacred Global Legal System</p>
              <p>Real Legal Frameworks • Divine Justice • AI Wisdom</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
