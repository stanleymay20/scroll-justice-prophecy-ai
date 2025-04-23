
import React from "react";
import { cn } from "@/lib/utils";
import { SystemHealth } from "@/types";
import { Button } from "@/components/ui/button";
import { Download, ArrowUpRight } from "lucide-react";

interface PageHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
  systemHealth?: SystemHealth;
  showExportButton?: boolean;
  onExport?: () => void;
}

export function PageHeader({
  heading,
  text,
  children,
  className,
  systemHealth,
  showExportButton = false,
  onExport,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
          {text && (
            <p className="text-muted-foreground mt-1 max-w-3xl">{text}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {systemHealth && (
            <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-lg border border-white/5 backdrop-blur-sm">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">System Health</span>
                <div className="flex items-center">
                  <span className="font-semibold">{systemHealth.overall.toFixed(1)}%</span>
                  <span className={`text-xs ml-1 ${systemHealth.delta > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {systemHealth.delta > 0 ? '+' : ''}{systemHealth.delta.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-1 h-8 border-l border-muted-foreground/20"></div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Cases Analyzed</span>
                <span className="font-semibold">{systemHealth.cases_analyzed.toLocaleString()}</span>
              </div>
            </div>
          )}
          {showExportButton && (
            <Button 
              onClick={onExport} 
              variant="outline" 
              size="sm" 
              className="bg-muted/20 border border-white/10 hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
