
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Scroll, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const AppHeader = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-black/30 border-b border-justice-primary/20 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Scroll className="h-8 w-8 text-justice-primary" />
          <h1 className="text-2xl font-cinzel text-white">ScrollJustice Prophecy AI</h1>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 text-justice-light hover:text-white">
              <User className="h-4 w-4" />
              <span>{user?.email?.split('@')[0] || 'User'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-justice-dark border-justice-primary/20">
            <DropdownMenuLabel className="text-justice-light">
              {user?.email || 'Sacred User'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-justice-primary/20" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="text-justice-light hover:text-white hover:bg-justice-primary/20 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
