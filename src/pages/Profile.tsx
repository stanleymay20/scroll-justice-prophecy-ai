
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, User, Mail, Key } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { MetaTags } from "@/components/MetaTags";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { t, formatDate } = useLanguage();
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail) {
      toast({
        title: "Email Required",
        description: "Please enter a new email address.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUpdatingEmail(true);
      
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });
      
      if (error) throw error;
      
      toast({
        title: "Email Update Initiated",
        description: "Please check your new email for a confirmation link.",
      });
      
      setNewEmail("");
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update email address.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUpdatingPassword(true);
      
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });
      
      if (signInError) {
        toast({
          title: "Incorrect Password",
          description: "Current password is incorrect.",
          variant: "destructive",
        });
        return;
      }
      
      // Then update to the new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black p-4 md:p-8">
      <MetaTags title={t("nav.profile")} />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">{t("profile.title")}</h1>
          <p className="text-justice-light/80">
            {t("profile.subtitle")}
          </p>
        </div>

        <div className="space-y-8">
          <GlassCard className="p-6">
            <div className="flex items-center mb-6">
              <div className="bg-justice-primary/20 p-3 rounded-full">
                <User className="h-6 w-6 text-justice-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white ml-3">{t("profile.accountInfo")}</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-justice-light/70">{t("profile.email")}</label>
                <p className="text-white">{user?.email}</p>
              </div>
              
              <div>
                <label className="text-sm text-justice-light/70">{t("profile.userId")}</label>
                <p className="text-white font-mono text-sm truncate">{user?.id}</p>
              </div>
              
              <div>
                <label className="text-sm text-justice-light/70">{t("profile.lastSignIn")}</label>
                <p className="text-white">
                  {user?.last_sign_in_at ? formatDate(new Date(user.last_sign_in_at), 
                    { dateStyle: 'medium', timeStyle: 'short' }) : "N/A"}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center mb-6">
              <div className="bg-justice-primary/20 p-3 rounded-full">
                <Mail className="h-6 w-6 text-justice-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white ml-3">{t("profile.updateEmail")}</h2>
            </div>
            
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <label htmlFor="newEmail" className="text-sm text-justice-light/70">
                  {t("profile.newEmailLabel")}
                </label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder={t("profile.newEmailPlaceholder")}
                  disabled={isUpdatingEmail}
                  className="mt-1"
                />
              </div>
              
              <Button type="submit" disabled={isUpdatingEmail}>
                {isUpdatingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("profile.updating")}
                  </>
                ) : (
                  t("profile.updateEmail")
                )}
              </Button>
            </form>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center mb-6">
              <div className="bg-justice-primary/20 p-3 rounded-full">
                <Key className="h-6 w-6 text-justice-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white ml-3">{t("profile.changePassword")}</h2>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="text-sm text-justice-light/70">
                  {t("profile.currentPasswordLabel")}
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={t("profile.currentPasswordPlaceholder")}
                  disabled={isUpdatingPassword}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="text-sm text-justice-light/70">
                  {t("profile.newPasswordLabel")}
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("profile.newPasswordPlaceholder")}
                  disabled={isUpdatingPassword}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="text-sm text-justice-light/70">
                  {t("profile.confirmPasswordLabel")}
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("profile.confirmPasswordPlaceholder")}
                  disabled={isUpdatingPassword}
                  className="mt-1"
                />
              </div>
              
              <Button type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("profile.updating")}
                  </>
                ) : (
                  t("profile.changePassword")
                )}
              </Button>
            </form>
          </GlassCard>

          <div className="text-center pt-4">
            <Button variant="outline" onClick={signOut}>
              {t("nav.signout")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
