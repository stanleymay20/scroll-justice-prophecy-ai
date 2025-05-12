
import React from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { MetaTags } from '@/components/MetaTags';
import { useLanguage } from '@/contexts/language';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardMainContent } from '@/components/dashboard/DashboardMainContent';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("nav.dashboard")} />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20">
        <DashboardHeader />
        
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <aside className="w-full lg:w-1/4">
            <DashboardSidebar />
          </aside>
          
          <main className="w-full lg:w-3/4">
            <DashboardMainContent />
          </main>
        </div>
      </div>
    </div>
  );
}
