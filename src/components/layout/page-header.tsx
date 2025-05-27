
import { SystemHealth } from "@/types";

interface PageHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  systemHealth?: SystemHealth;
  showExportButton?: boolean;
  onExport?: () => void;
}

export function PageHeader({ 
  heading, 
  text, 
  children, 
  systemHealth,
  showExportButton,
  onExport
}: PageHeaderProps) {
  // Mock system health data for the header if not provided
  const defaultSystemHealth: SystemHealth = {
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

  const health = systemHealth || defaultSystemHealth;

  return (
    <div className="flex flex-col space-y-4 pb-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-white">{heading}</h1>
          {text && (
            <p className="text-sm text-muted-foreground">{text}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className={`h-2 w-2 rounded-full ${
              health.overall >= 90 ? 'bg-green-500' : 
              health.overall >= 80 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`} />
            <span>System Health: {health.overall.toFixed(1)}%</span>
            <span className={`${
              health.delta >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              ({health.delta > 0 ? '+' : ''}{health.delta.toFixed(1)}%)
            </span>
          </div>
          {showExportButton && onExport && (
            <button 
              onClick={onExport}
              className="px-3 py-1 bg-justice-primary hover:bg-justice-secondary text-white rounded text-sm"
            >
              Export
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <span>Cases Analyzed: {health.cases_analyzed.toLocaleString()}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
