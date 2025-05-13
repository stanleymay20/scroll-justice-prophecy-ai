
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/language';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Page imports
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import Courtroom from '@/pages/Courtroom';
import Witness from '@/pages/Witness';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome to the Sacred Scrolls",
          description: "You have successfully signed in.",
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed Out",
          description: "You have been signed out of the Sacred Scrolls.",
        });
        
        // Clear any cached data on sign out
        queryClient.clear();
      }
    });

    setIsInitialized(true);

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (!isInitialized) {
    return <div className="flex items-center justify-center h-screen bg-justice-dark">
      <div className="animate-pulse text-justice-light">Loading the Sacred Scrolls...</div>
    </div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <SettingsProvider>
            <Router>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/settings" element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  } />
                  <Route path="/profile" element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } />
                  <Route path="/courtroom" element={<Courtroom />} />
                  <Route path="/courtroom/:id" element={<Courtroom />} />
                  <Route path="/witness/:id" element={<Witness />} />
                  
                  {/* Fallback routes */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
                <Toaster />
              </AuthProvider>
            </Router>
          </SettingsProvider>
        </LanguageProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
