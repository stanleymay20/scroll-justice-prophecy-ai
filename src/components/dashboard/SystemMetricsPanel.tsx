
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SystemHealth } from "@/types";

interface SystemMetricsPanelProps {
  data: SystemHealth;
}

export function SystemMetricsPanel({ data }: SystemMetricsPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-justice-dark text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Overall Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold">{data.overall.toFixed(1)}%</div>
            <div className={`text-sm ${data.delta >= 0 ? "text-green-500" : "text-red-500"}`}>
              {data.delta > 0 ? "+" : ""}{data.delta}%
            </div>
          </div>
          <div className="mt-4 h-2 w-full bg-justice-neutral/30 rounded-full">
            <div 
              className="h-full bg-justice-primary rounded-full" 
              style={{ width: `${data.overall}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-justice-dark text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Precedent Accuracy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.precedent_accuracy.toFixed(1)}%</div>
          <div className="mt-4 h-2 w-full bg-justice-neutral/30 rounded-full">
            <div 
              className="h-full bg-scroll-dawn rounded-full" 
              style={{ width: `${data.precedent_accuracy}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-justice-dark text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Jurisdictional Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.jurisdictional_coverage.toFixed(1)}%</div>
          <div className="mt-4 h-2 w-full bg-justice-neutral/30 rounded-full">
            <div 
              className="h-full bg-scroll-rise rounded-full" 
              style={{ width: `${data.jurisdictional_coverage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
