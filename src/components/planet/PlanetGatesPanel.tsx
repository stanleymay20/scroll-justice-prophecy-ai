
import React from "react";

export function PlanetGatesPanel() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-300 mb-2">
        Active gates around the ScrollPlanet:
      </p>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-black/20 rounded-lg border border-scroll-dawn/30">
          <div className="flex items-center mb-1">
            <span className="w-3 h-3 rounded-full bg-scroll-dawn mr-2"></span>
            <span className="text-scroll-dawn text-sm font-medium">Dawn Gate</span>
          </div>
          <div className="text-xs text-gray-400">12 active judges</div>
        </div>
        
        <div className="p-2 bg-black/20 rounded-lg border border-scroll-rise/30">
          <div className="flex items-center mb-1">
            <span className="w-3 h-3 rounded-full bg-scroll-rise mr-2"></span>
            <span className="text-scroll-rise text-sm font-medium">Light Gate</span>
          </div>
          <div className="text-xs text-gray-400">9 active judges</div>
        </div>
        
        <div className="p-2 bg-black/20 rounded-lg border border-scroll-ascend/30">
          <div className="flex items-center mb-1">
            <span className="w-3 h-3 rounded-full bg-scroll-ascend mr-2"></span>
            <span className="text-scroll-ascend text-sm font-medium">Sun Gate</span>
          </div>
          <div className="text-xs text-gray-400">7 active judges</div>
        </div>
        
        <div className="p-2 bg-black/20 rounded-lg border border-justice-tertiary/30">
          <div className="flex items-center mb-1">
            <span className="w-3 h-3 rounded-full bg-justice-tertiary mr-2"></span>
            <span className="text-justice-tertiary text-sm font-medium">Fire Gate</span>
          </div>
          <div className="text-xs text-gray-400">5 active judges</div>
        </div>
      </div>
      
      <div className="pt-2">
        <p className="text-xs text-gray-400 mb-1">Legend:</p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-white mr-1"></span>
            <span className="text-xs text-gray-300">Active</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-white opacity-30 mr-1"></span>
            <span className="text-xs text-gray-300">Inactive</span>
          </div>
        </div>
      </div>
    </div>
  );
}
