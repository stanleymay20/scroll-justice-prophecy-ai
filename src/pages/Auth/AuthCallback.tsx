
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Process the OAuthCallback or email link
        const { data: authData, error: authError } = await supabase.auth.getSession();
        
        if (authError) throw authError;
        
        if (authData?.session) {
          // Session exists, redirect to dashboard
          navigate("/dashboard");
        } else {
          // No session found, possibly in the middle of email confirmation
          // We'll wait briefly before checking again
          setTimeout(async () => {
            const { data: retryData, error: retryError } = await supabase.auth.getSession();
            if (retryError) throw retryError;
            
            if (retryData?.session) {
              navigate("/dashboard");
            } else {
              // Still no session, redirect to sign in
              navigate("/signin");
            }
          }, 2000);
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        setError(error.message || "Authentication failed. Please try again.");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-justice-dark to-black p-4">
      <GlassCard className="w-full max-w-md p-8 text-center">
        {error ? (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Authentication Error</h2>
            <p className="text-justice-light/80 mb-6">{error}</p>
            <button 
              onClick={() => navigate("/signin")}
              className="px-4 py-2 bg-justice-primary text-white rounded hover:bg-justice-primary/90 transition-colors"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Verifying your account...</h2>
            <div className="flex justify-center mb-6">
              <PulseEffect color="bg-justice-primary" size="lg" />
            </div>
            <p className="text-justice-light/80">Please wait while we complete the authentication process.</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default AuthCallback;
