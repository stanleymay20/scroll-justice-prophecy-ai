
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, Gavel, BookOpen } from "lucide-react";
import { ScrollCalendar } from "./ScrollCalendar";
import { FlameIntegrityMonitor } from "../courtroom/FlameIntegrityMonitor";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardSidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col space-y-6">
      {/* Quick Actions */}
      <Card className="p-4 bg-black/30 border border-justice-primary/30">
        <h3 className="text-lg font-medium text-white mb-3">Sacred Actions</h3>
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={() => navigate('/courtroom')}
            className="bg-justice-tertiary hover:bg-justice-tertiary/80 flex justify-start"
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            Submit New Petition
          </Button>
          
          <Button 
            onClick={() => navigate('/courtroom')}
            variant="outline" 
            className="flex justify-start"
          >
            <Gavel className="h-4 w-4 mr-2" />
            Review Petitions
          </Button>
          
          <Button 
            onClick={() => navigate('/principles')}
            variant="ghost" 
            className="flex justify-start"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Study Sacred Principles
          </Button>
        </div>
      </Card>
      
      {/* Scroll Calendar */}
      <ScrollCalendar />
      
      {/* Flame Integrity Monitor */}
      {user && (
        <FlameIntegrityMonitor
          userId={user.id}
        />
      )}
    </div>
  );
}
