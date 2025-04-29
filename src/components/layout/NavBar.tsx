
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, ScrollText, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

// Admin user IDs with access to developer dashboard
const ADMIN_USER_IDS = ['f7d71f55-ae04-491e-87d0-df4a10e1f669'];

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, subscriptionTier } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user && ADMIN_USER_IDS.includes(user.id)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.precedent"), href: "/precedent" },
    { name: t("nav.community"), href: "/community" },
    { name: t("court.simulation"), href: "/simulation-trial" },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-justice-dark/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="mr-2 relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-justice-primary to-justice-tertiary flex items-center justify-center">
                <ScrollText className="h-4 w-4 text-white" />
                <div className="absolute inset-0 rounded-full border border-justice-primary/50 animate-pulse"></div>
              </div>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              {t("app.title")}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="px-3 py-2 rounded-md text-sm font-medium text-justice-light hover:text-white hover:bg-justice-primary/20 transition"
            >
              {link.name}
            </Link>
          ))}
          
          <LanguageSelector />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline-block">
                    {user.email?.split("@")[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-justice-dark border-justice-light/20">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("nav.profile")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/subscription/manage")}>
                    <ScrollText className="mr-2 h-4 w-4" />
                    <span>{t("subscription.manage")}</span>
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Developer Dashboard</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("nav.signout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate("/signin")}>
              {t("nav.signin")}
            </Button>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <LanguageSelector />
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-justice-dark/90 backdrop-blur-md p-4 pt-2 animate-in slide-in-from-top-5">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-justice-light hover:text-white hover:bg-justice-primary/20 transition"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-2 border-t border-justice-light/10 mt-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-justice-light/70">
                    {user.email}
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-justice-light hover:text-white hover:bg-justice-primary/20 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t("nav.profile")}
                  </Link>
                  <Link
                    to="/subscription/manage"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-justice-light hover:text-white hover:bg-justice-primary/20 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <ScrollText className="h-4 w-4 mr-2" />
                    {t("subscription.manage")}
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-justice-light hover:text-white hover:bg-justice-primary/20 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Developer Dashboard
                    </Link>
                  )}
                  
                  <Button
                    variant="ghost"
                    className="flex items-center w-full justify-start px-3 py-2 rounded-md text-base font-medium text-justice-light hover:text-white hover:bg-justice-primary/20 transition"
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
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
                    navigate("/signin");
                  }}
                >
                  {t("nav.signin")}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
