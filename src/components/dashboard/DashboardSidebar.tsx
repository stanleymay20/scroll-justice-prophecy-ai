
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, Gavel, BookOpen, Globe, Archive, Shield, KeyRound } from "lucide-react";
import { ScrollCalendar } from "./ScrollCalendar";
import { FlameIntegrityMonitor } from "../courtroom/FlameIntegrityMonitor";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollClock } from "../scroll-time/ScrollClock";

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
            onClick={() => navigate('/hall-of-sealed')}
            variant="outline" 
            className="flex justify-start"
          >
            <Archive className="h-4 w-4 mr-2" />
            Hall of Sealed Scrolls
          </Button>
          
          <Button 
            onClick={() => navigate('/planet')}
            variant="outline" 
            className="flex justify-start"
          >
            <Globe className="h-4 w-4 mr-2" />
            ScrollPlanet Map
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
      
      {/* Scroll Time */}
      <ScrollClock showDetails={false} />
      
      {/* Admin Actions - Only show if user is logged in */}
      {user && (
        <Card className="p-4 bg-black/30 border border-justice-primary/30">
          <h3 className="text-lg font-medium text-white mb-3">Scroll Security</h3>
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={() => navigate('/admin/succession')}
              variant="outline" 
              className="flex justify-start"
            >
              <Shield className="h-4 w-4 mr-2" />
              Flame Succession System
            </Button>
            
            <Button 
              onClick={() => navigate('/recovery')}
              variant="outline" 
              className="flex justify-start"
            >
              <KeyRound className="h-4 w-4 mr-2" />
              ScrollKey Recovery
            </Button>
          </div>
        </Card>
      )}
      
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
