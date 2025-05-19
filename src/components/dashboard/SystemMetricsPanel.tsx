
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SystemHealth } from "@/types";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";

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
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold">Active</div>
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
          <div className="text-2xl font-bold">Limited Preview</div>
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
          <div className="text-2xl font-bold">Enabled</div>
          <LegalDisclaimer className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
