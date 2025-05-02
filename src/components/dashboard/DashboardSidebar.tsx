
import { ScrollPhasePanel } from "./ScrollPhasePanel";
import { QuickActionsPanel } from "./QuickActionsPanel";
import { NewPetitionPanel } from "./NewPetitionPanel";

export const DashboardSidebar = () => {
  return (
    <div className="space-y-6">
      <ScrollPhasePanel />
      <QuickActionsPanel />
      <NewPetitionPanel />
    </div>
  );
};
