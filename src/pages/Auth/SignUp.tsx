
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Shield } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the sacred terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Sacred passwords don't match",
  path: ["confirmPassword"],
});

const SignUp = () => {
  const { signUp, loading } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setErrorMessage("");
      await signUp(data.email, data.password);
      setSuccessMessage("Check your email for a verification link to complete your sacred registration.");
      form.reset();
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred during sign up");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-justice-dark to-black p-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-justice-primary/20 flex items-center justify-center animate-pulse-glow">
              <Shield className="h-8 w-8 text-justice-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-transparent bg-clip-text">
              Join ScrollJustice.AI
            </span>
          </h1>
          <p className="text-justice-light/80">Create your sacred account</p>
        </div>
        
        {successMessage ? (
          <div className="text-center p-4">
            <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg mb-4 text-white">
              {successMessage}
            </div>
            <Button asChild className="mt-4 bg-gradient-to-r from-justice-primary to-justice-secondary hover:opacity-90 transition-opacity">
              <Link to="/signin">Return to Sacred Portal</Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Sacred Password</FormLabel>
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

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                        className="data-[state=checked]:bg-justice-primary data-[state=checked]:border-justice-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        I accept the{" "}
                        <Link to="/terms" className="text-justice-primary hover:underline">
                          Sacred Terms
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-justice-primary hover:underline">
                          Privacy Covenant
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
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
                {loading ? "Creating Sacred Account..." : "Create Sacred Account"}
              </Button>
            </form>
          </Form>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-justice-light/60 text-sm">
            Already have a sacred account?{" "}
            <Link to="/signin" className="text-justice-primary font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default SignUp;
