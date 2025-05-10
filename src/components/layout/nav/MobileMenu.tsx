
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, ScrollText, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/language";
import { NavLinks } from "./NavLinks";
import { LanguageSelector } from "@/components/LanguageSelector";

// Admin user IDs with access to developer dashboard
const ADMIN_USER_IDS = ['f7d71f55-ae04-491e-87d0-df4a10e1f669'];

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const isAdmin = user && ADMIN_USER_IDS.includes(user.id);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleNavigation = () => setIsOpen(false);

  return (
    <div className="flex md:hidden items-center space-x-2">
      <LanguageSelector />
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-justice-dark/90 backdrop-blur-md p-4 pt-2 animate-in slide-in-from-top-5 z-40">
          <div className="space-y-2">
            <NavLinks 
              className="block px-3 py-2" 
              onClick={handleNavigation}
            />
            
            <div className="pt-2 border-t border-justice-light/10 mt-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-justice-light/70">
                    {user.email}
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-justice-light hover:text-white hover:bg-justice-primary/20 transition"
                    onClick={handleNavigation}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t("nav.profile")}
                  </Link>
                  <Link
                    to="/subscription/manage"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-justice-light hover:text-white hover:bg-justice-primary/20 transition"
                    onClick={handleNavigation}
                  >
                    <ScrollText className="h-4 w-4 mr-2" />
                    <span>{t("subscription.manage")}</span>
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-justice-light hover:text-white hover:bg-justice-primary/20 transition"
                      onClick={handleNavigation}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {t("dashboard.masterControlPanel")}
                    </Link>
                  )}
                  
                  <Button
                    variant="ghost"
                    className="flex items-center w-full justify-start px-3 py-2 rounded-md text-base font-medium text-justice-light hover:text-white hover:bg-justice-primary/20 transition"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("nav.signout")}
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = "/signin";
                  }}
                >
                  {t("nav.signin")}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
