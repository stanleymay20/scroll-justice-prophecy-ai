
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { useAuth } from '@/contexts/AuthContext';
import { Scroll, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Sacred Challenge",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email || !formData.password) {
      toast({
        title: "Sacred Challenge",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Sacred Challenge",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Sacred Challenge",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return false;
    }

    if (!acceptTerms) {
      toast({
        title: "Sacred Challenge",
        description: "Please accept the terms and conditions",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password);
      toast({
        title: "Sacred Account Created",
        description: "Welcome to ScrollJustice! Please check your email for verification.",
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Sacred Challenge Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Scroll className="h-12 w-12 text-justice-primary mr-3" />
            <h1 className="text-3xl font-cinzel text-white">ScrollJustice</h1>
          </div>
          <p className="text-justice-light">Join the Sacred Order</p>
        </div>

        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-justice-light">
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="bg-black/20 border-justice-primary/30 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-justice-light">
                Sacred Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
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

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-justice-light">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="bg-black/20 border-justice-primary/30 text-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-justice-light hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-justice-light leading-relaxed">
                I accept the{" "}
                <Link to="/terms" className="text-justice-primary hover:text-justice-tertiary underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-justice-primary hover:text-justice-tertiary underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-justice-primary hover:bg-justice-tertiary"
              disabled={isLoading}
            >
              {isLoading ? "Creating Sacred Account..." : "Join the Sacred Order"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-justice-light">
              Already have a sacred account?{" "}
              <Link
                to="/login"
                className="text-justice-primary hover:text-justice-tertiary font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default RegisterPage;
