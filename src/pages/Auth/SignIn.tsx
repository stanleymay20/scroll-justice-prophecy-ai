
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Gavel } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const SignIn = () => {
  const { signIn, loading } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there's a redirect parameter in the URL
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setErrorMessage("");
      await signIn(data.email, data.password);
      navigate(redirectPath);
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred during sign in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-justice-dark to-black p-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-justice-primary/20 flex items-center justify-center animate-pulse-glow">
              <Gavel className="h-8 w-8 text-justice-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-transparent bg-clip-text">
              ScrollJustice.AI
            </span>
          </h1>
          <p className="text-justice-light/80">Sign in to continue your sacred journey</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your@email.com" 
                      {...field} 
                      disabled={loading}
                      className="bg-black/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sacred Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      disabled={loading}
                      className="bg-black/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {errorMessage && (
              <div className="p-3 bg-destructive/20 border border-destructive/50 rounded text-sm text-white">
                {errorMessage}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-justice-primary to-justice-secondary hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Enter Sacred Portal"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-justice-light/60 text-sm">
            New to ScrollJustice.AI?{" "}
            <Link to="/signup" className="text-justice-primary font-medium hover:underline">
              Create Account
            </Link>
          </p>
          <Link to="/reset-password" className="text-justice-primary text-sm mt-2 inline-block hover:underline">
            Forgot sacred password?
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default SignIn;
