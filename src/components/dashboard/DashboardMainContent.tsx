
import { DashboardMetrics } from "./DashboardMetrics";
import { SystemMetricsPanel } from "@/components/dashboard/SystemMetricsPanel";
import { CaseList } from "@/components/dashboard/CaseList";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { useLanguage } from "@/contexts/language";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";

// Example data clearly marked as examples
const mockSystemHealth = {
  overall: 0, 
  delta: 0,
  cases_analyzed: 0,
  precedent_accuracy: 0,
  jurisdictional_coverage: 0
};

// Sample data clearly marked as examples
const sampleCases = [
  {
    case_id: "EXAMPLE-001",
    title: "Example Case Study",
    principle: "Research Example",
    scroll_alignment: "Educational Demo",
    confidence: 0
  },
  {
    case_id: "EXAMPLE-002",
    title: "Demonstration Case",
    principle: "Educational Example",
    scroll_alignment: "Research Prototype",
    confidence: 0
  }
];

export const DashboardMainContent = () => {
  const { t } = useLanguage();
  
  return (
    <div className="md:col-span-2 space-y-6">
      <Alert variant="destructive" className="bg-yellow-900/20 border-yellow-600/50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {t("dashboard.demoDisclaimer", "This is a demo version with placeholder content for illustration purposes only.")}
        </AlertDescription>
      </Alert>
      
      <DashboardMetrics />
      <SystemMetricsPanel data={mockSystemHealth} />
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">{t("dashboard.exampleCases")}</h2>
        <Alert variant="default" className="bg-yellow-900/20 border-yellow-600/50 mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Example cases for demonstration only
          </AlertDescription>
        </Alert>
        <CaseList cases={sampleCases} />
        <div className="mt-4">
          <LegalDisclaimer variant="full" />
        </div>
      </GlassCard>
    </div>
  );
};
