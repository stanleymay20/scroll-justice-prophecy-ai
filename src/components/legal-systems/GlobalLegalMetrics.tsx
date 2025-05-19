
import { GlobalLegalMetrics as GlobalMetrics } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Globe, Scale, Users, Languages, BookOpen, Award, AlertTriangle } from "lucide-react";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";

interface GlobalLegalMetricsProps {
  metrics: GlobalMetrics;
}

export function GlobalLegalMetrics({ metrics }: GlobalLegalMetricsProps) {
  return (
    <Card className="border-justice-tertiary bg-transparent">
      <CardHeader className="border-b border-justice-dark">
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          Legal System Research Platform
          <AlertTriangle className="ml-2 h-4 w-4 text-yellow-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black/20 p-4 rounded-md border border-justice-tertiary/20">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <BookOpen className="mr-2 h-4 w-4 text-justice-light" />
            Research Resources
          </h3>
          <p className="text-xs text-justice-light/70 mb-4">
            Access to legal research materials in our database.
          </p>
          <LegalDisclaimer />
        </div>
        
        <div className="bg-black/20 p-4 rounded-md border border-justice-tertiary/20">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Languages className="mr-2 h-4 w-4 text-justice-light" />
            Available Languages
          </h3>
          <p className="text-xs text-justice-light/70 mb-4">
            Documents available in {metrics.language_diversity} languages.
          </p>
          <LegalDisclaimer />
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <LegalDisclaimer variant="full" className="mt-4 p-2 border border-justice-tertiary/20 rounded bg-justice-dark/30" />
        </div>
      </CardContent>
    </Card>
  );
}
