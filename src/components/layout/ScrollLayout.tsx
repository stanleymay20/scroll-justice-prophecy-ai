
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Gavel, 
  Home, 
  Users, 
  FileText, 
  MessageSquare, 
  Database, 
  LogOut, 
  Menu, 
  X,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ScrollLayoutProps = {
  children: React.ReactNode;
};

const ScrollLayout: React.FC<ScrollLayoutProps> = ({ children }) => {
  const { user, signOut, userRole, subscriptionTier } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home, showAlways: true },
    { name: "Courtrooms", path: "/courtrooms", icon: Gavel, showAlways: true },
    { name: "Community", path: "/community", icon: Users, showAlways: true },
    { name: "Documents", path: "/documents", icon: FileText, showAlways: true },
    { name: "Messages", path: "/messages", icon: MessageSquare, showAlways: user !== null },
    { name: "API & Database", path: "/api", icon: Database, showAlways: userRole === "admin" },
  ];

  const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black text-white">
      {/* Header with logo */}
      <header className="fixed top-0 left-0 right-0 h-16 backdrop-blur-lg bg-black/50 border-b border-white/10 flex items-center justify-between px-4 z-50">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold mr-1 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-transparent bg-clip-text">
              ScrollJustice
            </span>
            <span className="text-lg font-light">.AI</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">Profile</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="mr-1 h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleMobileNav}>
          {isMobileNavOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {/* Mobile navigation overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 bg-black/95 z-40 md:hidden">
          <div className="flex flex-col items-center pt-20 pb-6 px-4 space-y-6">
            {navItems.map((item) => 
              (item.showAlways || (user && item.path !== '/')) && (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center w-full py-3 px-4 rounded-md",
                    isActive(item.path) 
                      ? "bg-justice-primary/20 text-justice-primary" 
                      : "hover:bg-white/5"
                  )}
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            )}
            
            {user ? (
              <>
                <Link 
                  to="/profile"
                  className="flex items-center w-full py-3 px-4 rounded-md hover:bg-white/5"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Profile
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    signOut();
                    setIsMobileNavOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setIsMobileNavOpen(false)}
                  asChild
                >
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => setIsMobileNavOpen(false)}
                  asChild
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Sidebar (desktop) */}
      <aside className="hidden md:block fixed top-16 left-0 bottom-0 w-64 backdrop-blur-lg bg-black/30 border-r border-white/10 p-4">
        <nav className="flex flex-col h-full">
          <div className="space-y-1 flex-1">
            {navItems.map((item) => 
              (item.showAlways || (user && item.path !== '/')) && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    isActive(item.path) 
                      ? "bg-justice-primary/20 text-justice-primary" 
                      : "hover:bg-white/5"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            )}
          </div>

          {user && (
            <div className="pt-4 border-t border-white/10 mt-4">
              <div className="flex items-center mb-2">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-white/70">
                  {subscriptionTier ? `${subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Plan` : 'Free Witness'}
                </span>
              </div>
              <div className="flex items-center">
                <Info className="h-4 w-4 text-white/50 mr-2" />
                <span className="text-xs text-white/50">
                  {userRole ? `Scroll ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}` : 'Scroll Witness'}
                </span>
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="pt-16 md:pl-64 min-h-screen">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ScrollLayout;
