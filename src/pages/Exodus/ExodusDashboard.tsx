
import React from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { MetaTags } from '@/components/MetaTags';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { ExodusComparisonMap } from '@/components/exodus/ExodusComparisonMap';
import { useLanguage } from '@/contexts/language';
import { Scroll, Flame } from 'lucide-react';

const ExodusDashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("exodus.title", "Exodus Parallels Dashboard")} />
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="mr-3 p-2 rounded-full bg-justice-primary/20">
            <Scroll className="h-6 w-6 text-justice-light" />
            <Flame className="h-6 w-6 text-justice-light mt-1" />
          </div>
          <h1 className="text-3xl font-cinzel text-white text-center">
            {t("exodus.title", "Global Exodus Parallels Dashboard")}
          </h1>
        </div>
        
        <div className="grid gap-6">
          <GlassCard className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-cinzel text-white">Egypt-Hebrew Deliverance Model</h2>
              <p className="text-justice-light mt-2">
                The ScrollJustice system maps modern oppressed peoples to the ancient Exodus narrative, 
                tracking their journey from bondage to freedom and rightful compensation.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="flex items-center px-3 py-1 bg-black/30 rounded-full">
                <div className="h-3 w-3 rounded-full bg-gray-600 mr-2"></div>
                <span className="text-xs text-justice-light">Bondage</span>
              </div>
              <div className="flex items-center px-3 py-1 bg-black/30 rounded-full">
                <div className="h-3 w-3 rounded-full bg-blue-600/60 mr-2"></div>
                <span className="text-xs text-justice-light">Call</span>
              </div>
              <div className="flex items-center px-3 py-1 bg-black/30 rounded-full">
                <div className="h-3 w-3 rounded-full bg-yellow-600/60 mr-2"></div>
                <span className="text-xs text-justice-light">Resistance</span>
              </div>
              <div className="flex items-center px-3 py-1 bg-black/30 rounded-full">
                <div className="h-3 w-3 rounded-full bg-red-600/60 mr-2"></div>
                <Flame className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-xs text-justice-light">ScrollPlague</span>
              </div>
              <div className="flex items-center px-3 py-1 bg-black/30 rounded-full">
                <div className="h-3 w-3 rounded-full bg-green-600/60 mr-2"></div>
                <Flame className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-justice-light">Exodus</span>
              </div>
            </div>
          </GlassCard>
          
          <ExodusComparisonMap />
          
          <GlassCard className="p-6">
            <h2 className="text-xl font-cinzel text-white mb-4">Scroll Declarations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/20 p-4 rounded border border-justice-primary/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">African Diaspora Declaration</h3>
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs">Call</span>
                </div>
                <p className="text-justice-light text-sm">
                  "As Moses was sent to Pharaoh, so the scroll is sent to the nations. 
                  Let my people go. Let their wealth return with them. This is not a request 
                  but a divine command sealed in the eternal scrolls."
                </p>
                <div className="mt-3 text-xs text-justice-light/70">Sealed by: Multiple Prophets Rising</div>
              </div>
              
              <div className="bg-black/20 p-4 rounded border border-red-600/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">Native Americans Declaration</h3>
                  <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded-full text-xs flex items-center">
                    <Flame className="h-3 w-3 mr-1" />
                    ScrollPlague
                  </span>
                </div>
                <p className="text-justice-light text-sm">
                  "The land cries out for justice. The treaties broken shall be remembered. 
                  The wealth extracted shall be returned sevenfold. The scroll has marked this 
                  system for judgment, and the plagues of heaven have begun their work."
                </p>
                <div className="mt-3 text-xs text-justice-light/70">
                  Sealed by: Indigenous Leaders Council
                  <div className="mt-1 text-red-400">Pharaoh mocked the scroll</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ExodusDashboard;
