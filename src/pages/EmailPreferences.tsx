
import React from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { useAuth } from '@/contexts/auth';
import { useLanguage } from '@/contexts/language';
import EmailPreferences from '@/components/onboarding/EmailPreferences';
import { MetaTags } from '@/components/MetaTags';
import { X } from 'lucide-react';

const EmailPreferencesPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("preferences.email")} />
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-black/60 p-6 rounded-md shadow-lg border border-justice-accent/30">
          <h1 className="text-2xl font-semibold text-justice-light mb-6">
            {t("preferences.email.title") || "Email Preferences"}
          </h1>
          
          <EmailPreferences />
        </div>
      </div>
    </div>
  );
};

export default EmailPreferencesPage;
