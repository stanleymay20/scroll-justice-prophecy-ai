
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface TribeData {
  id: string;
  name: string;
  color: string;
  members: number;
  regions: string[];
}

interface PlanetTribesPanelProps {
  selectedTribe: string | null;
  onTribeSelect: (tribeId: string) => void;
}

// Simulation data
const mockTribes: TribeData[] = [
  { id: "tribe1", name: "Dawn Seekers", color: "#f59e0b", members: 37, regions: ["North America", "Europe"] },
  { id: "tribe2", name: "Light Bearers", color: "#10b981", members: 28, regions: ["South America", "Africa"] },
  { id: "tribe3", name: "Sun Walkers", color: "#3b82f6", members: 45, regions: ["Asia", "Australia"] },
  { id: "tribe4", name: "Fire Keepers", color: "#ef4444", members: 19, regions: ["Europe", "Middle East"] },
  { id: "tribe5", name: "Star Gazers", color: "#8b5cf6", members: 33, regions: ["North America", "Asia"] },
];

export function PlanetTribesPanel({ selectedTribe, onTribeSelect }: PlanetTribesPanelProps) {
  const handleTribeSelect = (tribeId: string) => {
    onTribeSelect(tribeId === selectedTribe ? null : tribeId);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-300 mb-2">
        Select a tribe to highlight their territory on the map:
      </p>
      
      {mockTribes.map(tribe => (
        <div 
          key={tribe.id}
          className={`p-3 rounded-lg cursor-pointer border transition-all ${
            selectedTribe === tribe.id 
              ? 'bg-black/50 border-justice-primary' 
              : 'bg-black/20 border-transparent hover:border-justice-primary/30'
          }`}
          onClick={() => handleTribeSelect(tribe.id)}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-white flex items-center">
              <span 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: tribe.color }}
              ></span>
              {tribe.name}
            </h3>
            <Badge variant="outline" className="bg-black/40">
              {tribe.members} members
            </Badge>
          </div>
          <div className="text-xs text-gray-400">
            Regions: {tribe.regions.join(', ')}
          </div>
        </div>
      ))}
    </div>
  );
}
