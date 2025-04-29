
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { 
  Users, ScrollText, CreditCard, AlertTriangle, 
  Shield, BarChart4, Loader2 
} from "lucide-react";
import { SubscriptionTier } from "@/types/subscription";

// Admin user IDs with access to developer dashboard
const ADMIN_USER_IDS = ['f7d71f55-ae04-491e-87d0-df4a10e1f669'];

interface UserData {
  id: string;
  email: string;
  created_at: string;
  subscription_status?: string;
  subscription_tier?: SubscriptionTier;
  subscription_end?: string;
}

interface SubscriptionData {
  id: string;
  user_id: string;
  status: string;
  tier: SubscriptionTier;
  created_at: string;
  customer_id?: string;
  current_period_end?: string;
}

interface AlertData {
  id: string;
  session_id: string;
  user_id: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  resolution_notes?: string;
}

interface LogData {
  id: string;
  session_id: string;
  user_id: string;
  action: string;
  details?: string;
  timestamp: string;
}

const DeveloperDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState({
    users: true,
    subscriptions: true,
    alerts: true,
    logs: true
  });
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  useEffect(() => {
    // Check if current user is an admin
    if (!user || !ADMIN_USER_IDS.includes(user.id)) {
      toast({
        title: "Sacred Access Denied",
        description: "You do not have ScrollSteward privileges to access this sacred area.",
        variant: "destructive"
      });
      navigate("/");
      return;
    }

    fetchUsers();
    fetchSubscriptions();
    fetchAlerts();
    fetchLogs();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      if (data && data.users) {
        setUsers(data.users.map(u => ({
          id: u.id,
          email: u.email || 'No email',
          created_at: new Date(u.created_at || '').toLocaleString()
        })));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Sacred Scroll Warning",
        description: "Could not retrieve user records. The sacred scrolls are temporarily sealed.",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchSubscriptions = async () => {
    try {
      setLoading(prev => ({ ...prev, subscriptions: true }));
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*');
      
      if (error) throw error;
      
      setSubscriptions(data || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(prev => ({ ...prev, subscriptions: false }));
    }
  };

  const fetchAlerts = async () => {
    try {
      setLoading(prev => ({ ...prev, alerts: true }));
      const { data, error } = await supabase
        .from('emergency_alerts')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(prev => ({ ...prev, alerts: false }));
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(prev => ({ ...prev, logs: true }));
      const { data, error } = await supabase
        .from('scroll_witness_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(prev => ({ ...prev, logs: false }));
    }
  };

  const activateTrialSubscription = async (userId: string) => {
    if (processingAction) return;
    
    setProcessingAction(userId);
    try {
      // Create a trial subscription for the user
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          status: 'active',
          tier: 'professional',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          created_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
      
      toast({
        title: "Sacred Trial Activated",
        description: "The user has been granted a sacred trial subscription for 30 days.",
      });
      
      // Refresh subscriptions list
      fetchSubscriptions();
      
    } catch (error) {
      console.error("Error activating trial:", error);
      toast({
        title: "Sacred Action Failed",
        description: "Could not activate the trial subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const cancelSubscription = async (userId: string) => {
    if (processingAction) return;
    
    setProcessingAction(userId);
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          current_period_end: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Subscription Canceled",
        description: "The sacred subscription has been canceled.",
      });
      
      // Refresh subscriptions list
      fetchSubscriptions();
      
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast({
        title: "Sacred Action Failed",
        description: "Could not cancel the subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const resolveAlert = async (alertId: string) => {
    if (processingAction) return;
    
    setProcessingAction(alertId);
    try {
      const { error } = await supabase
        .from('emergency_alerts')
        .update({
          resolved: true,
          resolution_notes: "Resolved by ScrollSteward"
        })
        .eq('id', alertId);
      
      if (error) throw error;
      
      toast({
        title: "Alert Resolved",
        description: "The sacred emergency alert has been marked as resolved.",
      });
      
      // Refresh alerts list
      fetchAlerts();
      
    } catch (error) {
      console.error("Error resolving alert:", error);
      toast({
        title: "Sacred Action Failed",
        description: "Could not resolve the alert. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black p-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            ScrollJustice.AI Developer Dashboard
          </h1>
          <p className="text-justice-light/80">
            Sacred administration interface for ScrollStewards
          </p>
        </div>

        <GlassCard className="p-4 mb-8">
          <div className="flex items-center justify-center space-x-4 text-center">
            <div>
              <Shield className="h-6 w-6 text-justice-primary mx-auto mb-2" />
              <p className="text-sm text-justice-light/70">ScrollSteward</p>
              <p className="text-white">{user?.email}</p>
            </div>
            <div className="h-16 border-r border-justice-light/30" />
            <div>
              <Users className="h-6 w-6 text-justice-primary mx-auto mb-2" />
              <p className="text-sm text-justice-light/70">Total Users</p>
              <p className="text-white">{users.length}</p>
            </div>
            <div className="h-16 border-r border-justice-light/30" />
            <div>
              <CreditCard className="h-6 w-6 text-justice-primary mx-auto mb-2" />
              <p className="text-sm text-justice-light/70">Active Subscriptions</p>
              <p className="text-white">
                {subscriptions.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="h-16 border-r border-justice-light/30" />
            <div>
              <AlertTriangle className="h-6 w-6 text-justice-primary mx-auto mb-2" />
              <p className="text-sm text-justice-light/70">Open Alerts</p>
              <p className="text-white">
                {alerts.filter(a => !a.resolved).length}
              </p>
            </div>
          </div>
        </GlassCard>

        <Tabs defaultValue="users">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions">
              <CreditCard className="h-4 w-4 mr-2" />
              <span>Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span>Emergency Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="logs">
              <ScrollText className="h-4 w-4 mr-2" />
              <span>ScrollWitness Logs</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Sacred User Registry</CardTitle>
                <CardDescription>
                  View and manage registered users in the ScrollJustice.AI system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.users ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Consulting the sacred scrolls...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Created</th>
                          <th className="text-left py-3 px-4">Subscription</th>
                          <th className="text-center py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => {
                          const subscription = subscriptions.find(s => s.user_id === user.id);
                          
                          return (
                            <tr key={user.id} className="border-b border-white/10">
                              <td className="py-3 px-4">{user.email}</td>
                              <td className="py-3 px-4">{user.created_at}</td>
                              <td className="py-3 px-4">
                                {subscription ? (
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    subscription.status === 'active' ? 'bg-green-500/20 text-green-300' :
                                    subscription.status === 'canceled' ? 'bg-red-500/20 text-red-300' :
                                    'bg-yellow-500/20 text-yellow-300'
                                  }`}>
                                    {subscription.status} {subscription.tier ? `(${subscription.tier})` : ''}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">No subscription</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex justify-center space-x-2">
                                  {!subscription || subscription.status !== 'active' ? (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => activateTrialSubscription(user.id)}
                                      disabled={processingAction === user.id}
                                    >
                                      {processingAction === user.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                      ) : null}
                                      Trial Access
                                    </Button>
                                  ) : (
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => cancelSubscription(user.id)}
                                      disabled={processingAction === user.id}
                                    >
                                      {processingAction === user.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                      ) : null}
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Sacred Subscription Registry</CardTitle>
                <CardDescription>
                  Manage user subscriptions and billing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.subscriptions ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Consulting the sacred scrolls...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4">User ID</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Tier</th>
                          <th className="text-left py-3 px-4">Created</th>
                          <th className="text-left py-3 px-4">Period End</th>
                          <th className="text-center py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions.map(subscription => (
                          <tr key={subscription.id} className="border-b border-white/10">
                            <td className="py-3 px-4">
                              {subscription.user_id}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                subscription.status === 'active' ? 'bg-green-500/20 text-green-300' :
                                subscription.status === 'canceled' ? 'bg-red-500/20 text-red-300' :
                                'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                {subscription.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">{subscription.tier || '—'}</td>
                            <td className="py-3 px-4">
                              {new Date(subscription.created_at).toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              {subscription.current_period_end ? 
                                new Date(subscription.current_period_end).toLocaleString() : '—'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center space-x-2">
                                {subscription.status === 'active' ? (
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => cancelSubscription(subscription.user_id)}
                                    disabled={processingAction === subscription.user_id}
                                  >
                                    {processingAction === subscription.user_id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    ) : null}
                                    Cancel
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => activateTrialSubscription(subscription.user_id)}
                                    disabled={processingAction === subscription.user_id}
                                  >
                                    {processingAction === subscription.user_id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    ) : null}
                                    Reactivate
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Sacred Emergency Alerts</CardTitle>
                <CardDescription>
                  Monitor and resolve justice violations reported by users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.alerts ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Consulting the sacred scrolls...</p>
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-green-400" />
                    <p className="text-xl font-semibold mb-2">No Emergency Alerts</p>
                    <p className="text-gray-400">
                      All is well in the sacred courts. No alerts have been raised.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map(alert => (
                      <div
                        key={alert.id}
                        className={`p-4 border ${
                          alert.resolved 
                            ? 'border-green-700/30 bg-green-900/10' 
                            : 'border-red-700/30 bg-red-900/10'
                        } rounded-lg`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <AlertTriangle className={`h-5 w-5 ${
                                alert.resolved ? 'text-green-400' : 'text-red-400'
                              } mr-2`} />
                              <span className="font-medium">
                                Alert from Session {alert.session_id}
                              </span>
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                                alert.resolved 
                                  ? 'bg-green-500/20 text-green-300' 
                                  : 'bg-red-500/20 text-red-300'
                              }`}>
                                {alert.resolved ? 'Resolved' : 'Active'}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-400">
                              {new Date(alert.timestamp).toLocaleString()}
                            </div>
                          </div>
                          
                          {!alert.resolved && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => resolveAlert(alert.id)}
                              disabled={processingAction === alert.id}
                            >
                              {processingAction === alert.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : null}
                              Resolve
                            </Button>
                          )}
                        </div>
                        
                        <div className="mt-3 p-3 bg-black/30 rounded">
                          {alert.message}
                        </div>
                        
                        {alert.resolved && alert.resolution_notes && (
                          <div className="mt-2 text-sm">
                            <span className="text-green-400 font-medium">Resolution:</span>{' '}
                            {alert.resolution_notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Sacred ScrollWitness Logs</CardTitle>
                <CardDescription>
                  View audit logs of all actions in the ScrollJustice.AI system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.logs ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Consulting the sacred scrolls...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4">Timestamp</th>
                          <th className="text-left py-3 px-4">User ID</th>
                          <th className="text-left py-3 px-4">Session ID</th>
                          <th className="text-left py-3 px-4">Action</th>
                          <th className="text-left py-3 px-4">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map(log => (
                          <tr key={log.id} className="border-b border-white/10">
                            <td className="py-3 px-4">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {log.user_id}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {log.session_id || '—'}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 rounded text-xs bg-justice-tertiary/20 text-justice-tertiary">
                                {log.action}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {log.details || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 bg-black/30 border border-justice-tertiary/20 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="p-2 bg-justice-primary/20 rounded-full mr-3">
              <BarChart4 className="h-5 w-5 text-justice-primary" />
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">ScrollAuditChain Ready for Activation</h3>
              <p className="text-sm text-justice-light/80">
                The sacred tamper-proof audit logging system is prepared for future integration. 
                This will provide immutable records of all actions taken within the ScrollJustice.AI system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
