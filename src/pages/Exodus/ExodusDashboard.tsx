
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
                The ScrollJustice system maps historical narratives to modern contexts, 
                tracking progress through defined phases of justice and reparation processes.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="flex items-center px-3 py-1 bg-black/30 rounded-full">
                <div className="h-3 w-3 rounded-full bg-gray-600 mr-2"></div>
                <span className="text-xs text-justice-light">Initial Phase</span>
              </div>
              <div className="flex items-center px-3 py-1 bg-black/30 rounded-full">
                <div className="h-3 w-3 rounded-full bg-blue-600/60 mr-2"></div>
                <span className="text-xs text-justice-light">Documentation</span>
              </div>
              <div className="flex items-center px-3 py-1 bg-black/30 rounded-full">
                <div className="h-3 w-3 rounded-full bg-yellow-600/60 mr-2"></div>
                <span className="text-xs text-justice-light">Awareness</span>
              </div>
              <div className="flex items-center px-3 py-1 bg-black/30 rounded-full">
                <div className="h-3 w-3 rounded-full bg-red-600/60 mr-2"></div>
                <Flame className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-xs text-justice-light">Recognition</span>
              </div>
              <div className="flex items-center px-3 py-1 bg-black/30 rounded-full">
                <div className="h-3 w-3 rounded-full bg-green-600/60 mr-2"></div>
                <Flame className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-justice-light">Resolution</span>
              </div>
            </div>
          </GlassCard>
          
          <ExodusComparisonMap />
          
          <GlassCard className="p-6">
            <h2 className="text-xl font-cinzel text-white mb-4">Historical Declarations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/20 p-4 rounded border border-justice-primary/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">Historical Document A</h3>
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs">Archived</span>
                </div>
                <p className="text-justice-light text-sm">
                  "This document represents a formal acknowledgment of historical events 
                  and serves as an important milestone in the resolution process."
                </p>
                <div className="mt-3 text-xs text-justice-light/70">Referenced by: Multiple Sources</div>
              </div>
              
              <div className="bg-black/20 p-4 rounded border border-red-600/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">Historical Document B</h3>
                  <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded-full text-xs flex items-center">
                    <Flame className="h-3 w-3 mr-1" />
                    Current
                  </span>
                </div>
                <p className="text-justice-light text-sm">
                  "This document outlines key principles and agreements established 
                  during reconciliation processes and provides a foundation for future progress."
                </p>
                <div className="mt-3 text-xs text-justice-light/70">
                  Official Reference: Historical Archives
                  <div className="mt-1 text-red-400">Under review by committee</div>
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
