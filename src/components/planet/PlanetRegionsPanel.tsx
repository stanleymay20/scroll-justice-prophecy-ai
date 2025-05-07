
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function PlanetRegionsPanel() {
  return (
    <Card className="bg-black/30 border border-justice-primary/30">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-justice-light mb-2">ScrollGate Pulse</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Dawn Gate:</span>
            <div className="w-1/2 bg-black/40 rounded-full h-1.5">
              <div className="bg-scroll-dawn h-1.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Light Gate:</span>
            <div className="w-1/2 bg-black/40 rounded-full h-1.5">
              <div className="bg-scroll-rise h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Sun Gate:</span>
            <div className="w-1/2 bg-black/40 rounded-full h-1.5">
              <div className="bg-scroll-ascend h-1.5 rounded-full animate-pulse" style={{ width: '90%' }}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Fire Gate:</span>
            <div className="w-1/2 bg-black/40 rounded-full h-1.5">
              <div className="bg-justice-tertiary h-1.5 rounded-full animate-pulse" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-justice-primary/20">
          <p className="text-xs text-gray-400 mb-2">Active Scroll Judges: 38</p>
          <p className="text-xs text-gray-400">Gates Open: 7/7</p>
        </div>
      </CardContent>
    </Card>
  );
}
