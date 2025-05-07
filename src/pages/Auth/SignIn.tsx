
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { NavBar } from "@/components/layout/NavBar";
import { Loader2 } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { signIn, user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract redirect URL from query parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get("redirect") || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirectUrl);
    }
  }, [user, navigate, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await signIn(email, password);
      // Redirect handled in AuthContext after successful login
    } catch (error: any) {
      console.error("Error signing in:", error);
      setErrorMessage(error.message || "Failed to sign in. Please check your credentials and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <NavBar />
      
      <div className="flex items-center justify-center min-h-screen px-4">
        <GlassCard className="w-full max-w-md p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {t("nav.signin")}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-justice-light">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-justice-light">
                  Password
                </label>
                <Link 
                  to="/reset-password" 
                  className="text-sm text-justice-primary hover:text-justice-tertiary"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
            
            {errorMessage && (
              <div className="p-3 bg-destructive/20 border border-destructive/50 rounded text-sm text-white">
                {errorMessage}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("app.loading")}
                </>
              ) : (
                t("nav.signin")
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-justice-light">
              Don't have an account?{" "}
              <Link to="/signup" className="text-justice-primary hover:text-justice-tertiary">
                Register
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SignIn;
