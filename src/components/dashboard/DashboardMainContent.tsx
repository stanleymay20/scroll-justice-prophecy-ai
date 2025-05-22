
import { DashboardMetrics } from "./DashboardMetrics";
import { SystemMetricsPanel } from "@/components/dashboard/SystemMetricsPanel";
import { CaseList } from "@/components/dashboard/CaseList";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { useLanguage } from "@/contexts/language";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";

// Demo data clearly labeled
const demoSystemHealth = {
  overall: 0, 
  delta: 0,
  cases_analyzed: 0,
  precedent_accuracy: 0,
  jurisdictional_coverage: 0
};

// Demo cases clearly labeled
const demoCases = [
  {
    case_id: "DEMO-001",
    title: "Demo Petition Case",
    principle: "Demonstration Only",
    scroll_alignment: "Educational Example",
    confidence: 0
  },
  {
    case_id: "DEMO-002",
    title: "Sample Scroll Petition",
    principle: "Example Data",
    scroll_alignment: "Demonstration",
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
          {t("dashboard.demoDisclaimer", "This is currently showing demo content. Submit a petition for real data to appear.")}
        </AlertDescription>
      </Alert>
      
      <DashboardMetrics />
      <SystemMetricsPanel data={demoSystemHealth} />
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">{t("dashboard.demoCases")}</h2>
        <Alert variant="default" className="bg-yellow-900/20 border-yellow-600/50 mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Demo petitions shown. Submit a real petition to see actual cases.
          </AlertDescription>
        </Alert>
        <CaseList cases={demoCases} />
        <div className="mt-4">
          <LegalDisclaimer variant="full" />
        </div>
      </GlassCard>
    </div>
  );
};
