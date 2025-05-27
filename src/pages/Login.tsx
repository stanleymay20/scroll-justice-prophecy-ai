
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { AlertCircle, Scale } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark via-black to-justice-primary/20 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Scale className="h-12 w-12 text-justice-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ScrollJustice AI</h1>
          <p className="text-justice-light/80">{t('auth.sacred_login')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-justice-light mb-2">
              {t('auth.email')}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sacred@scrolljustice.ai"
              required
              className="bg-black/30 border-justice-primary/30 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-justice-light mb-2">
              {t('auth.password')}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-black/30 border-justice-primary/30 text-white"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/50 rounded">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-justice-primary hover:bg-justice-tertiary"
          >
            {loading ? t('auth.signing_in') : t('auth.sign_in')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-justice-light/60 text-sm">
            {t('auth.no_account')}{' '}
            <Link to="/register" className="text-justice-primary hover:text-justice-tertiary font-medium">
              {t('auth.register')}
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default Login;
