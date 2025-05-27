
import { DashboardMetrics } from "./DashboardMetrics";
import { SystemMetricsPanel } from "@/components/dashboard/SystemMetricsPanel";
import { CaseList } from "@/components/dashboard/CaseList";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { useLanguage } from "@/contexts/language";
import { SystemHealth, Case } from "@/types";

// Mock data for demo purposes with proper types
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

const mockCases: Case[] = [
  {
    id: "1",
    case_id: "SCJ-2025-042",
    title: "Sacred Principles of Digital Evidence",
    principle: "Truth Preservation",
    scroll_alignment: "DAWN Phase, Gate 3",
    confidence: 0.95,
    status: "judged",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    jurisdiction: "International",
    category: "criminal"
  },
  {
    id: "2",
    case_id: "SCJ-2025-039",
    title: "Global Jurisdictional Boundaries",
    principle: "Equitable Access",
    scroll_alignment: "RISE Phase, Gate 5",
    confidence: 0.88,
    status: "under_review",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    jurisdiction: "European Union",
    category: "government"
  },
  {
    id: "3",
    case_id: "SCJ-2025-036",
    title: "AI Witness Credibility Assessment",
    principle: "Technological Integrity",
    scroll_alignment: "ASCEND Phase, Gate 2",
    confidence: 0.72,
    status: "filed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    jurisdiction: "United States",
    category: "employment"
  }
];

export const DashboardMainContent = () => {
  const { t } = useLanguage();
  
  return (
    <div className="md:col-span-2 space-y-6">
      <DashboardMetrics />
      <SystemMetricsPanel data={mockSystemHealth} />
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">{t("dashboard.recentCases")}</h2>
        <CaseList cases={mockCases} />
      </GlassCard>
    </div>
  );
};
