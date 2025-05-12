
import React from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { MetaTags } from '@/components/MetaTags';
import { useLanguage } from '@/contexts/language';

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("nav.home")} />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-justice-light mb-6">
            {t("landing.title")}
          </h1>
          <p className="text-xl text-justice-light/80 mb-10 max-w-2xl mx-auto">
            {t("landing.subtitle")}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Feature cards will go here */}
          </div>
        </div>
      </div>
    </div>
  );
}
