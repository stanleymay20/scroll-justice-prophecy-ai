
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

export function ScrollPlanetCard() {
  return (
    <Card className="bg-black/30 border border-justice-primary/30 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-justice-light flex items-center">
          <Globe className="h-5 w-5 mr-2 text-justice-secondary" /> 
          ScrollPlanet Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Active Gates:</span>
            <span className="text-sm font-medium text-justice-light">7/7</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Active Judges:</span>
            <span className="text-sm font-medium text-justice-light">38</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Current Phase:</span>
            <span className="text-sm font-medium text-scroll-ascend">Ascend</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Flame Strength:</span>
            <span className="text-sm font-medium text-justice-tertiary">Strong</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
