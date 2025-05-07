
import React from 'react';

interface TribeData {
  id: string;
  name: string;
  color: string;
  members: number;
  regions: string[];
}

interface MapBoxProps {
  selectedTribeId: string | null;
  tribes?: TribeData[];
}

export function MapBox({ selectedTribeId, tribes = [] }: MapBoxProps) {
  // This component would typically integrate with MapBox GL JS or another mapping library
  // For now, we'll use a placeholder visualization
  
  const getBackgroundStyle = () => {
    if (!selectedTribeId) return { background: "linear-gradient(45deg, #243b55, #141e30)" };
    
    const selectedTribe = tribes.find(t => t.id === selectedTribeId);
    if (!selectedTribe) return { background: "linear-gradient(45deg, #243b55, #141e30)" };
    
    // Create a subtle gradient using the tribe's color
    return { 
      background: `linear-gradient(45deg, ${selectedTribe.color}33, #141e30)`,
      boxShadow: `inset 0 0 100px ${selectedTribe.color}22`
    };
  };
  
  return (
    <div 
      className="w-full h-[500px] flex items-center justify-center text-justice-light text-center"
      style={getBackgroundStyle()}
    >
      {selectedTribeId ? (
        <div className="p-6 bg-black/30 rounded-lg border border-justice-primary/30 max-w-md">
          <p className="mb-4">
            Viewing territory for selected tribe.
          </p>
          <p className="text-sm text-gray-400">
            This component would display an interactive map with the selected tribe's territory highlighted.
          </p>
        </div>
      ) : (
        <div className="p-6 bg-black/30 rounded-lg border border-justice-primary/30 max-w-md">
          <p className="mb-4">
            Select a tribe from the panel on the right to view their territory.
          </p>
          <p className="text-sm text-gray-400">
            This component would display an interactive map of the ScrollPlanet with territories, gates, and other points of interest.
          </p>
        </div>
      )}
    </div>
  );
}
