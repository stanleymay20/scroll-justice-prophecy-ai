
import React from 'react';
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { useLanguage } from "@/contexts/language";
import EmailPreferences from "@/components/onboarding/EmailPreferences";
import { AIDisclosureBanner } from "@/components/compliance/AIDisclosureBanner";
import { XMarkIcon } from "lucide-react";

const EmailPreferencesPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="Email Preferences" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-justice-light mb-6">Sacred Scroll Communication Preferences</h1>
          
          <div className="mb-6">
            <AIDisclosureBanner />
          </div>
          
          <p className="text-justice-light/80 mb-6">
            The sacred scrolls communicate wisdom through a series of divinely inspired messages.
            Control which sacred communications you wish to receive on your journey.
          </p>
          
          <EmailPreferences />
          
          <div className="mt-8 bg-black/40 border border-justice-primary/20 rounded-lg p-4">
            <h3 className="text-justice-light font-medium mb-2">About Sacred Communications</h3>
            <p className="text-justice-light/70 text-sm">
              Our scroll communications are designed to guide you through your journey with ScrollJustice.AI.
              Each message contains valuable insights, sacred knowledge, and essential guidance for your
              quest for justice. We respect your preferences and will honor your choices regarding these communications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreferencesPage;
