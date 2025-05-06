
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JurisdictionFilter } from "@/components/filtering/JurisdictionFilter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/language";

// Form validation schema
const courtRegistrationSchema = z.object({
  courtName: z.string().min(3, "Court name is required and must be at least 3 characters"),
  jurisdiction: z.string().min(1, "Jurisdiction is required"),
  courtType: z.string().min(1, "Court type is required"),
  description: z.string().min(10, "Please provide a brief description of the court"),
  contactName: z.string().min(3, "Contact person name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().optional(),
  registrationCode: z.string().optional(),
  verificationNotes: z.string().optional()
});

type CourtRegistrationFormValues = z.infer<typeof courtRegistrationSchema>;

export const CourtRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Initialize form with react-hook-form
  const form = useForm<CourtRegistrationFormValues>({
    resolver: zodResolver(courtRegistrationSchema),
    defaultValues: {
      courtName: "",
      jurisdiction: "",
      courtType: "",
      description: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      registrationCode: "",
      verificationNotes: ""
    }
  });

  const onSubmit = async (data: CourtRegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to register a court.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Store the court registration
      const { data: registrationData, error } = await supabase
        .from('court_registrations')
        .insert({
          court_name: data.courtName,
          jurisdiction: data.jurisdiction,
          court_type: data.courtType,
          description: data.description,
          contact_name: data.contactName,
          contact_email: data.contactEmail,
          contact_phone: data.contactPhone || null,
          registration_code: data.registrationCode || null,
          verification_notes: data.verificationNotes || null,
          registered_by: user.id,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Success submission
      toast({
        title: "Court Registration Submitted",
        description: "Your sacred court registration has been submitted for verification.",
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error("Court registration error:", error);
      toast({
        title: "Registration Error",
        description: "There was a problem submitting your court registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJurisdictionChange = (jurisdiction: string | null) => {
    form.setValue("jurisdiction", jurisdiction || "", { shouldValidate: true });
  };

  // Court type options
  const courtTypes = [
    { value: "trial", label: "Trial Court" },
    { value: "appellate", label: "Appellate Court" },
    { value: "supreme", label: "Supreme Court" },
    { value: "specialized", label: "Specialized Court" },
    { value: "administrative", label: "Administrative Tribunal" },
    { value: "religious", label: "Religious Court" },
    { value: "traditional", label: "Traditional/Customary Court" },
    { value: "sacred", label: "Sacred Scroll Court" },
    { value: "other", label: "Other" }
  ];

  if (submitted) {
    return (
      <Card className="bg-black/40 border-justice-secondary">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
            Court Registration Submitted
          </CardTitle>
          <CardDescription>
            Your sacred court registration has been submitted for verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-justice-primary/10 border-justice-primary/20">
            <AlertTitle className="text-justice-primary">Next Steps</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Your registration will be reviewed by the ScrollJustice.AI council. This typically takes 2-3 business days.
              </p>
              <p className="mb-2">
                You will receive an email notification once your court has been verified and approved.
              </p>
              <p>
                If additional information is needed, a council member will contact you directly.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Register Another Court
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-justice-secondary">
      <CardHeader>
        <CardTitle>Register Your Court</CardTitle>
        <CardDescription>
          Connect your earthly court to the ScrollJustice.AI sacred judicial network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="courtName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Court Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full court name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="courtType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Court Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select court type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courtTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="jurisdiction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jurisdiction</FormLabel>
                  <FormControl>
                    <div>
                      <JurisdictionFilter 
                        initialJurisdiction={field.value || null}
                        onJurisdictionChange={handleJurisdictionChange}
                        className="w-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Court Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide a brief description of your court, its functions, and sacred principles" 
                      className="h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name of court representative" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Official email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number for verification" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="registrationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Code (If Any)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter registration code if provided" {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave this blank if you have not been provided with a code.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="verificationNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional information to help verify your court" 
                      className="h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Register Court"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <Alert className="w-full">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription>
            All court registrations undergo a sacred verification process before being added to the
            ScrollJustice.AI network. Official documentation may be requested.
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  );
};
