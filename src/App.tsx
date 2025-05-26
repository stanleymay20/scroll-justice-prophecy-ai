
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/components/language/LanguageProvider';

// Pages
import LoginPage from '@/pages/Auth/LoginPage';
import RegisterPage from '@/pages/Auth/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import PetitionsPage from '@/pages/PetitionsPage';
import SettingsPage from '@/pages/SettingsPage';

// New Components for ScrollJustice
import { AdminPanel } from '@/components/admin/AdminPanel';
import { ScrollIntelDashboard } from '@/components/analytics/ScrollIntelDashboard';
import { DonationTiers } from '@/components/billing/DonationTiers';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
              <Routes>
                {/* Default route redirects to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* Auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Main app routes */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/petitions" element={<PetitionsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                
                {/* ScrollJustice specific routes */}
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/analytics" element={<ScrollIntelDashboard />} />
                <Route path="/donate" element={<DonationTiers />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
