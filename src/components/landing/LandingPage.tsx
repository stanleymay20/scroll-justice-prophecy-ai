
import React, { useEffect } from "react";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { CTASection } from "./CTASection";
import { useLanguage } from "@/contexts/language";
import { AIDisclosureBanner } from "../compliance/AIDisclosureBanner";

export const LandingPage = () => {
  const { language, t } = useLanguage();

  useEffect(() => {
    // Log the current language when it changes
    console.log(`Landing page rendered with language: ${language}`);
  }, [language]);
  
  return (
    <>
      <div className="container mx-auto px-4 pt-4">
        <AIDisclosureBanner />
      </div>
      <Hero />
      <Features />
      <CTASection />
    </>
  );
};
