
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

export function MobileMenu() {
  const { t } = useLanguage();
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
