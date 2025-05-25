
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { useAuth } from '@/contexts/AuthContext';
import { Scroll, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Sacred Challenge",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Sacred Challenge Rejected",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Scroll className="h-12 w-12 text-justice-primary mr-3" />
            <h1 className="text-3xl font-cinzel text-white">ScrollJustice</h1>
          </div>
          <p className="text-justice-light">Enter the Sacred Chambers</p>
        </div>

        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-justice-light">
                Sacred Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-black/20 border-justice-primary/30 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-justice-light">
                Sacred Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your sacred password"
                  className="bg-black/20 border-justice-primary/30 text-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-justice-light hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <label htmlFor="remember" className="text-sm text-justice-light">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-justice-primary hover:text-justice-tertiary"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-justice-primary hover:bg-justice-tertiary"
              disabled={isLoading}
            >
              {isLoading ? "Entering Sacred Chambers..." : "Enter Sacred Chambers"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-justice-light">
              Seek to join the Sacred Order?{" "}
              <Link
                to="/register"
                className="text-justice-primary hover:text-justice-tertiary font-medium"
              >
                Register Here
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default LoginPage;
