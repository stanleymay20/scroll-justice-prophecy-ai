
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SystemHealth } from "@/types";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SystemMetricsPanelProps {
  data: SystemHealth;
}

export function SystemMetricsPanel({ data }: SystemMetricsPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-justice-dark text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="bg-yellow-900/20 border-yellow-600/50 mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Demo version - No real data available
            </AlertDescription>
          </Alert>
          <div className="flex items-baseline space-x-2">
            <div className="text-lg font-medium">Limited Preview</div>
          </div>
          <LegalDisclaimer className="mt-2" />
        </CardContent>
      </Card>

      <Card className="bg-justice-dark text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Data Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="bg-yellow-900/20 border-yellow-600/50 mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Demo version - No real data available
            </AlertDescription>
          </Alert>
          <div className="text-lg font-medium">Educational Mode</div>
          <LegalDisclaimer className="mt-2" />
        </CardContent>
      </Card>

      <Card className="bg-justice-dark text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Research Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="bg-yellow-900/20 border-yellow-600/50 mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Demo version - No real data available
            </AlertDescription>
          </Alert>
          <div className="text-lg font-medium">Enabled</div>
          <LegalDisclaimer className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
