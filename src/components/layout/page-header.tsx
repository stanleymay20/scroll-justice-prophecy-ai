
import { SystemHealth } from "@/types";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  // Mock system health data for the header
  const mockSystemHealth: SystemHealth = {
    status: 'healthy',
    uptime: 99.8,
    activeUsers: 1250,
    systemLoad: 45,
    lastUpdate: new Date().toISOString(),
    overall: 96.5,
    delta: 2.3,
    cases_analyzed: 1250,
    precedent_accuracy: 94.2,
    jurisdictional_coverage: 89.7
  };

  return (
    <div className="flex flex-col space-y-4 pb-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className={`h-2 w-2 rounded-full ${
              mockSystemHealth.overall >= 90 ? 'bg-green-500' : 
              mockSystemHealth.overall >= 80 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`} />
            <span>System Health: {mockSystemHealth.overall.toFixed(1)}%</span>
            <span className={`${
              mockSystemHealth.delta >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              ({mockSystemHealth.delta > 0 ? '+' : ''}{mockSystemHealth.delta.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <span>Cases Analyzed: {mockSystemHealth.cases_analyzed.toLocaleString()}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
