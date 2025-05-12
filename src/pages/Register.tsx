
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/layout/NavBar';
import { MetaTags } from '@/components/MetaTags';
import { useLanguage } from '@/contexts/language';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const { t } = useLanguage();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: t("auth.passwordMismatch"),
        description: t("auth.passwordMismatchDesc"),
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password);
      toast({
        title: t("auth.registerSuccess"),
        description: t("auth.checkEmail"),
      });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: t("auth.registerFailed"),
        description: t("auth.tryAgain"),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("auth.register")} />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-24 pb-16 flex justify-center">
        <div className="w-full max-w-md p-8 space-y-8 bg-black/30 backdrop-blur-sm border border-justice-primary/30 rounded-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-justice-light">{t("auth.register")}</h1>
            <p className="mt-2 text-justice-light/70">{t("auth.registerPrompt")}</p>
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
              <div>
                <Label htmlFor="confirm-password">{t("auth.confirmPassword")}</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? t("common.loading") : t("auth.register")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
