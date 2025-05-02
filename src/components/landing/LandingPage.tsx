
import { useEffect } from "react";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { CTASection } from "./CTASection";
import { useLanguage } from "@/contexts/language";

export const LandingPage = () => {
  const { language, t } = useLanguage();

  useEffect(() => {
    // Log the current language when it changes
    console.log(`Landing page rendered with language: ${language}`);
  }, [language]);
  
  return (
    <>
      <Hero />
      <Features />
      <CTASection />
    </>
  );
};
