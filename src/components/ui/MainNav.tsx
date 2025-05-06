
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
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { useLanguage } from "@/contexts/language";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  requireAuth?: boolean;
  isAdmin?: boolean;
}

export function MainNav() {
  const { t } = useLanguage();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems: NavItem[] = [
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
      href: "/precedents",
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };
  
  return (
    <div className="flex items-center">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {filteredNavItems.map(({ title, href }) => (
          <Link
            key={href}
            to={href}
            className={cn(
              "text-sm transition-colors hover:text-justice-primary",
              isActive(href)
                ? "text-justice-primary font-medium"
                : "text-justice-light/70"
            )}
          >
            {title}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="flex md:hidden">
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {isMenuOpen ? "✕" : "≡"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {filteredNavItems.map(({ title, href }) => (
              <DropdownMenuItem
                key={href}
                className={cn(
                  "cursor-pointer",
                  isActive(href) && "bg-justice-primary/10 text-justice-primary"
                )}
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                asChild
              >
                <Link to={href}>{title}</Link>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            
            {user ? (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/profile">{t("nav.profile")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  {t("nav.signout")}
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem asChild>
                <Link to="/auth/login">{t("nav.signin")}</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Language Switcher (both desktop and mobile) */}
      <div className="ml-4">
        <LanguageSwitcher 
          variant="outline" 
          size="sm"
          showFlags={true}
          showLabel={false}
        />
      </div>
    </div>
  );
}
