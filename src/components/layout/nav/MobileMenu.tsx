
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/language";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { Globe } from "lucide-react";
import { LanguageCode } from "@/contexts/language/types";

export function MobileMenu() {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  
  const navItems = [
    {
      title: t("nav.home"),
      href: "/",
    },
    {
      title: t("nav.dashboard"),
      href: "/dashboard",
      requireAuth: true,
    },
    {
      title: t("nav.precedent"),
      href: "/precedent",
    },
    {
      title: t("nav.community"),
      href: "/community",
    },
    {
      title: "Jurisdictions",
      href: "/jurisdictions",
    },
    {
      title: "Planet",
      href: "/planet",
    },
    {
      title: "Admin",
      href: "/admin",
      requireAuth: true,
      isAdmin: true
    },
  ];
  
  // Filter nav items based on authentication state
  const filteredNavItems = navItems.filter(item => {
    if (item.requireAuth && !user) return false;
    if (item.isAdmin && !isAdmin) return false;
    return true;
  });
  
  // Language options with flags
  const languages = [
    { code: "en" as LanguageCode, name: "English", flag: "🇺🇸" },
    { code: "fr" as LanguageCode, name: "Français", flag: "🇫🇷" },
    { code: "es" as LanguageCode, name: "Español", flag: "🇪🇸" },
    { code: "de" as LanguageCode, name: "Deutsch", flag: "🇩🇪" },
  ];

  return (
    <div className="block md:hidden">
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            {isMenuOpen ? "✕" : "≡"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {filteredNavItems.map(({ title, href }) => (
            <DropdownMenuItem
              key={href}
              onClick={() => setIsMenuOpen(false)}
              asChild
            >
              <Link to={href}>{title}</Link>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          {/* Language selection */}
          <DropdownMenuItem>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{t("nav.language")}</span>
            </div>
          </DropdownMenuItem>
          
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              className="pl-8"
              onClick={() => {
                setLanguage(lang.code);
                setIsMenuOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {language === lang.code && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          {user ? (
            <>
              <DropdownMenuItem asChild>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  {t("nav.profile")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
              }}>
                {t("nav.signout")}
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem asChild>
              <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                {t("nav.signin")}
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
