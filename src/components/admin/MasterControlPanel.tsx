
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { ScrollIntegrityLog } from '@/types/petition';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCw, AlertTriangle, Shield, Flame, Users, BarChart } from 'lucide-react';
import { format } from 'date-fns';

export function MasterControlPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [integrityLogs, setIntegrityLogs] = useState<ScrollIntegrityLog[]>([]);
  const [systemHealth, setSystemHealth] = useState({
    overall: 96,
    petitionIntegrity: 98,
    userReputation: 94,
    scrollSecurity: 97
  });
  
  // Load data
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch integrity logs
      const { data: logs, error: logsError } = await supabase
        .from('scroll_integrity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (logsError) throw logsError;
      setIntegrityLogs(logs as unknown as ScrollIntegrityLog[]);
      
      // In a real application, we would fetch actual system health metrics
      
    } catch (err: any) {
      console.error('Error loading MCP data:', err);
      setError(err.message || 'Failed to load system data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmergencyReset = () => {
    toast({
      title: "Emergency System Reset Initiated",
      description: "All judges have been notified of the system reset.",
      variant: "destructive"
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPp');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Master Control Panel (MCP)</h2>
          <p className="text-justice-light/80">System monitoring and scroll integrity management</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleEmergencyReset}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Reset
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-destructive/20 border border-destructive/50 rounded p-4 text-white">
          <p className="font-medium">System Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-white">System Health</h3>
            <Shield className="h-5 w-5 text-justice-primary" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{systemHealth.overall}%</div>
          <Progress value={systemHealth.overall} className="h-2 bg-justice-primary" />
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-white">Petition Integrity</h3>
            <Flame className="h-5 w-5 text-justice-tertiary" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{systemHealth.petitionIntegrity}%</div>
          <Progress value={systemHealth.petitionIntegrity} className="h-2 bg-justice-tertiary" />
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-white">User Reputation</h3>
            <Users className="h-5 w-5 text-justice-light" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{systemHealth.userReputation}%</div>
          <Progress value={systemHealth.userReputation} className="h-2 bg-justice-light" />
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-white">Scroll Security</h3>
            <Shield className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{systemHealth.scrollSecurity}%</div>
          <Progress value={systemHealth.scrollSecurity} className="h-2 bg-green-500" />
        </GlassCard>
      </div>
      
      <GlassCard className="p-6">
        <Tabs defaultValue="integrity">
          <TabsList className="mb-4 bg-justice-dark/50">
            <TabsTrigger value="integrity">
              <Flame className="h-4 w-4 mr-2" />
              Integrity Logs
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart className="h-4 w-4 mr-2" />
              System Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="integrity" className="space-y-4">
            <div className="bg-justice-dark/30 rounded-md p-4">
              <h3 className="font-medium text-white mb-2">Recent Integrity Events</h3>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-justice-primary" />
                </div>
              ) : integrityLogs.length > 0 ? (
                <div className="space-y-3">
                  {integrityLogs.map(log => (
                    <div key={log.id} className="flex items-start border-b border-justice-light/10 pb-3">
                      <div className={`p-2 rounded-full mr-3 flex-shrink-0 ${
                        log.integrity_impact > 0 ? 'bg-green-500/20' : 
                        log.integrity_impact < 0 ? 'bg-destructive/20' : 
                        'bg-justice-light/20'
                      }`}>
                        <Flame className={`h-4 w-4 ${
                          log.integrity_impact > 0 ? 'text-green-500' : 
                          log.integrity_impact < 0 ? 'text-destructive' : 
                          'text-justice-light'
                        }`} />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-white">{log.action_type}</div>
                          <Badge className={
                            log.integrity_impact > 0 ? 'bg-green-500 text-justice-dark' :
                            log.integrity_impact < 0 ? 'bg-destructive' :
                            'bg-justice-light/50'
                          }>
                            {log.integrity_impact > 0 ? '+' : ''}{log.integrity_impact}
                          </Badge>
                        </div>
                        <p className="text-sm text-justice-light/70">{log.description}</p>
                        <div className="text-xs text-justice-light/50 mt-1">
                          {formatDate(log.created_at)}
                          {log.user_id && ` · User #${log.user_id.substring(0, 8)}`}
                          {log.petition_id && ` · Petition #${log.petition_id.substring(0, 8)}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-justice-light/70 text-center py-8">No integrity logs found</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="text-center py-12 text-justice-light/70">
              <p>User management tools available to administrators</p>
              <Button variant="outline" className="mt-4">Manage User Access</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="text-center py-12 text-justice-light/70">
              <p>System analytics and reports</p>
              <Button variant="outline" className="mt-4">Generate System Report</Button>
            </div>
          </TabsContent>
        </Tabs>
      </GlassCard>
    </div>
  );
}
