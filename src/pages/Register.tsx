
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { AlertCircle, Scale, CheckCircle } from 'lucide-react';
import { countries } from '@/data/countries';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    country: '',
    role: 'petitioner' as const
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        country: formData.country,
        role: formData.role
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark via-black to-justice-primary/20 flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('auth.welcome_scroll')}</h2>
          <p className="text-justice-light/80">{t('auth.account_created')}</p>
        </GlassCard>
      </div>
    );
  }

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
          <p className="text-justice-light/80">{t('auth.join_sacred')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-justice-light mb-2">
              {t('auth.full_name')}
            </label>
            <Input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Sacred Name"
              required
              className="bg-black/30 border-justice-primary/30 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-justice-light mb-2">
              {t('auth.email')}
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="sacred@scrolljustice.ai"
              required
              className="bg-black/30 border-justice-primary/30 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-justice-light mb-2">
              {t('auth.country')}
            </label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
              <SelectTrigger className="bg-black/30 border-justice-primary/30 text-white">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-justice-light mb-2">
                {t('auth.password')}
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                required
                className="bg-black/30 border-justice-primary/30 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-justice-light mb-2">
                {t('auth.confirm_password')}
              </label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="••••••••"
                required
                className="bg-black/30 border-justice-primary/30 text-white"
              />
            </div>
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
            {loading ? t('auth.creating_account') : t('auth.create_account')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-justice-light/60 text-sm">
            {t('auth.have_account')}{' '}
            <Link to="/login" className="text-justice-primary hover:text-justice-tertiary font-medium">
              {t('auth.sign_in')}
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default Register;
