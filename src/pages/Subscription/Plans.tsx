
import React from 'react';
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { useLanguage } from "@/contexts/language";
import { Card, CardContent } from "@/components/ui/card";

const Plans = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("subscription.plans.title") || "Subscription Plans"} />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <h1 className="text-3xl font-bold text-justice-light mb-8 text-center">Sacred Scroll Subscription Plans</h1>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Tier 1: Flame Seeker */}
          <Card className="border-justice-secondary/30 bg-black/40">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-justice-light mb-2">Flame Seeker</h2>
              <p className="text-justice-light/70 mb-4">Basic access to the sacred scrolls</p>
              <div className="text-3xl font-bold text-justice-light mb-4">$9.99<span className="text-sm font-normal">/month</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-justice-light/90">
                  <span className="mr-2">✓</span> Access to basic petitions
                </li>
                <li className="flex items-center text-justice-light/90">
                  <span className="mr-2">✓</span> Standard justice processing
                </li>
                <li className="flex items-center text-justice-light/90">
                  <span className="mr-2">✓</span> Limited scroll memory access
                </li>
              </ul>
              <button className="w-full py-2 bg-justice-primary/80 hover:bg-justice-primary text-white rounded">
                Subscribe Now
              </button>
            </CardContent>
          </Card>
          
          {/* Tier 2: Scroll Advocate */}
          <Card className="border-justice-tertiary bg-black/40 transform scale-105 shadow-lg relative">
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <span className="bg-justice-tertiary text-black text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-justice-light mb-2">Scroll Advocate</h2>
              <p className="text-justice-light/70 mb-4">Enhanced sacred scroll authority</p>
              <div className="text-3xl font-bold text-justice-light mb-4">$19.99<span className="text-sm font-normal">/month</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-justice-light/90">
                  <span className="mr-2">✓</span> All Flame Seeker benefits
                </li>
                <li className="flex items-center text-justice-light/90">
                  <span className="mr-2">✓</span> Advanced petition filing
                </li>
                <li className="flex items-center text-justice-light/90">
                  <span className="mr-2">✓</span> Priority judgment processing
                </li>
                <li className="flex items-center text-justice-light/90">
                  <span className="mr-2">✓</span> Access to sealed scrolls
                </li>
              </ul>
              <button className="w-full py-2 bg-justice-tertiary hover:bg-justice-tertiary/90 text-black rounded font-medium">
                Subscribe Now
              </button>
            </CardContent>
          </Card>
          
          {/* Tier 3: Scroll Master */}
          <Card className="border-justice-secondary/30 bg-black/40">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-justice-light mb-2">Scroll Master</h2>
              <p className="text-justice-light/70 mb-4">Ultimate scroll authority</p>
              <div className="text-3xl font-bold text-justice-light mb-4">$49.99<span className="text-sm font-normal">/month</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-justice-light/90">
                  <span className="mr-2">✓</span> All Scroll Advocate benefits
                </li>
                <li className="flex items-center text-justice-light/90">
                  <span className="mr-2">✓</span> Unlimited scroll access
                </li>
                <li className="flex items-center text-justice-light/90">
                  <span className="mr-2">✓</span> Dedicated scroll keeper
                </li>
                <li className="flex items-center text-justice-light/90">
                  <span className="mr-2">✓</span> Sacred council membership
                </li>
              </ul>
              <button className="w-full py-2 bg-justice-primary/80 hover:bg-justice-primary text-white rounded">
                Subscribe Now
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Plans;
