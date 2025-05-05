
import { DashboardHeader } from "./DashboardHeader";
import { DashboardMainContent } from "./DashboardMainContent";
import { DashboardSidebar } from "./DashboardSidebar";
import { ScrollPlanetCard } from "../scroll-time/ScrollPlanetCard";

export const Dashboard = () => {
  return (
    <div className="pt-20 pb-16 px-4 container mx-auto">
      <DashboardHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardMainContent />
        <DashboardSidebar />
      </div>
    </div>
  );
};
