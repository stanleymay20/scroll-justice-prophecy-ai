
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NavBar } from '@/components/layout/NavBar';
import { MetaTags } from '@/components/MetaTags';
import { useLanguage } from '@/contexts/language';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      toast({
        title: t("auth.success"),
        description: t("auth.welcome"),
      });
      navigate(redirectTo);
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: t("auth.failed"),
        description: t("auth.tryAgain"),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("auth.login")} />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-24 pb-16 flex justify-center">
        <div className="w-full max-w-md p-8 space-y-8 bg-black/30 backdrop-blur-sm border border-justice-primary/30 rounded-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-justice-light">{t("auth.login")}</h1>
            <p className="mt-2 text-justice-light/70">{t("auth.loginPrompt")}</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-justice-dark/50"
                />
              </div>
              <div>
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-justice-dark/50"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-justice-primary hover:bg-justice-secondary"
              disabled={isLoading}
            >
              {isLoading ? t("common.loading") : t("auth.login")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
