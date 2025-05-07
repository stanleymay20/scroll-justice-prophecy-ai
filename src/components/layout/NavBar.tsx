
import { useEffect, useState } from "react";
import { useScrollEffect } from "@/hooks/useScrollEffect";
import { useAuth } from "@/contexts/auth"; // Updated import path
import { BrandLogo } from "./nav/BrandLogo";
import { NavLinks } from "./nav/NavLinks";
import { UserMenu } from "./nav/UserMenu";
import { MobileMenu } from "./nav/MobileMenu";
import { LanguageSelector } from "@/components/LanguageSelector";
import { LanguageTranslator } from "@/components/LanguageTranslator";

// Admin user IDs with access to developer dashboard
const ADMIN_USER_IDS = ['f7d71f55-ae04-491e-87d0-df4a10e1f669'];

export function NavBar() {
  const isScrolled = useScrollEffect();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && ADMIN_USER_IDS.includes(user.id)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-justice-dark/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <BrandLogo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <NavLinks />
          <LanguageSelector />
          {isAdmin && <LanguageTranslator />}
          <UserMenu isAdmin={isAdmin} />
        </div>

        {/* Mobile Navigation Toggle */}
        <MobileMenu />
      </nav>
    </header>
  );
}
