
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Key, 
  User, 
  Clock, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  XCircle 
} from "lucide-react";
import { ButtonXs } from "@/components/ui/button-xs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

// Add missing or updated types
interface SuccessionCandidate {
  id: string;
  username: string;
  email?: string;
  reputation: number;
  flames_issued: number;
  last_activity: string;
  eligible: boolean;
}

interface EmergencySuccessionKey {
  id: string;
  created_at: string;
  expires_at: string;
  activated: boolean;
  created_by: string;
  key_hash: string;
  emergency_access_level: 'limited' | 'full';
}

interface NodeHealth {
  id: string;
  status: 'active' | 'degraded' | 'offline';
  last_heartbeat: string;
  flame_integrity: number;
  node_type: 'primary' | 'backup' | 'recovery';
}

const SuccessionSystem = () => {
  const { isAdmin } = useAuth();
  const [candidates, setCandidates] = useState<SuccessionCandidate[]>([]);
  const [emergencyKeys, setEmergencyKeys] = useState<EmergencySuccessionKey[]>([]);
  const [nodes, setNodes] = useState<NodeHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [newKey, setNewKey] = useState({
    passphrase: '',
    confirmPassphrase: '',
    expiresIn: '30',
    accessLevel: 'limited' as const
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // In a real implementation, this would fetch from the database
        // For now we're using mock data
        
        // Mock candidates data
        setCandidates([
          {
            id: '1',
            username: 'HighFlame',
            reputation: 98,
            flames_issued: 247,
            last_activity: '2025-05-02T14:22:00Z',
            eligible: true
          },
          {
            id: '2',
            username: 'ScrollKeeper',
            reputation: 87,
            flames_issued: 132,
            last_activity: '2025-05-06T09:15:00Z',
            eligible: true
          },
          {
            id: '3',
            username: 'TruthSeeker',
            reputation: 65,
            flames_issued: 78,
            last_activity: '2025-04-29T11:45:00Z',
            eligible: false
          }
        ]);
        
        // Mock emergency keys data
        setEmergencyKeys([
          {
            id: '1',
            created_at: '2025-01-15T10:00:00Z',
            expires_at: '2025-07-15T10:00:00Z',
            activated: false,
            created_by: 'SystemAdmin',
            key_hash: '6d8a7b5c4e3f2g1h',
            emergency_access_level: 'limited'
          },
          {
            id: '2',
            created_at: '2025-03-22T14:30:00Z',
            expires_at: '2025-06-22T14:30:00Z',
            activated: false,
            created_by: 'FlameMaster',
            key_hash: '9a8b7c6d5e4f3g2h',
            emergency_access_level: 'full'
          }
        ]);
        
        // Mock nodes data
        setNodes([
          {
            id: '1',
            status: 'active',
            last_heartbeat: '2025-05-07T12:58:00Z',
            flame_integrity: 98,
            node_type: 'primary'
          },
          {
            id: '2',
            status: 'active',
            last_heartbeat: '2025-05-07T12:57:00Z',
            flame_integrity: 95,
            node_type: 'backup'
          },
          {
            id: '3',
            status: 'degraded',
            last_heartbeat: '2025-05-07T12:45:00Z',
            flame_integrity: 78,
            node_type: 'recovery'
          }
        ]);
      } catch (error) {
        console.error("Error fetching succession system data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleCreateEmergencyKey = () => {
    // Validate form
    if (newKey.passphrase !== newKey.confirmPassphrase) {
      setValidationError("Passphrases do not match");
      return;
    }
    
    if (newKey.passphrase.length < 12) {
      setValidationError("Passphrase must be at least 12 characters long");
      return;
    }
    
    // In a real implementation, this would create a key in the database
    setSuccessMessage("Emergency succession key created successfully");
    setValidationError("");
    
    // Reset form
    setNewKey({
      passphrase: '',
      confirmPassphrase: '',
      expiresIn: '30',
      accessLevel: 'limited'
    });
    
    // Add the new key to the list
    const newEmergencyKey: EmergencySuccessionKey = {
      id: (emergencyKeys.length + 1).toString(),
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + parseInt(newKey.expiresIn) * 24 * 60 * 60 * 1000).toISOString(),
      activated: false,
      created_by: 'CurrentUser',
      key_hash: Math.random().toString(36).substring(2, 15),
      emergency_access_level: newKey.accessLevel
    };
    
    setEmergencyKeys([...emergencyKeys, newEmergencyKey]);
  };

  if (!isAdmin) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You do not have permission to access the Flame Succession System.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-justice-primary mb-2 flex items-center">
        <Shield className="mr-2" /> Flame Succession System
      </h1>
      <p className="text-justice-light/70 mb-6">
        Manage emergency succession keys and candidate users for system recovery.
      </p>
      
      <Tabs defaultValue="candidates">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="candidates">Succession Candidates</TabsTrigger>
          <TabsTrigger value="emergency-keys">Emergency Keys</TabsTrigger>
          <TabsTrigger value="nodes">Node Health</TabsTrigger>
        </TabsList>
        
        <TabsContent value="candidates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <User className="mr-2 h-5 w-5" /> Eligible Succession Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 text-xs uppercase text-justice-light/60 pb-2 border-b border-justice-light/20">
                  <div className="col-span-4">Username</div>
                  <div className="col-span-2 text-center">Reputation</div>
                  <div className="col-span-2 text-center">Flames</div>
                  <div className="col-span-3 text-center">Last Active</div>
                  <div className="col-span-1 text-center"></div>
                </div>
                
                {candidates.map(candidate => (
                  <div key={candidate.id} className="grid grid-cols-12 items-center py-2">
                    <div className="col-span-4 font-medium">{candidate.username}</div>
                    <div className="col-span-2 text-center">{candidate.reputation}/100</div>
                    <div className="col-span-2 text-center">{candidate.flames_issued}</div>
                    <div className="col-span-3 text-center">
                      {new Date(candidate.last_activity).toLocaleDateString()}
                    </div>
                    <div className="col-span-1 text-center">
                      <ButtonXs size="xs" variant={candidate.eligible ? "default" : "outline"}>
                        {candidate.eligible ? "Approve" : "Review"}
                      </ButtonXs>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Succession Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Reputation score of 80 or higher</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>At least 100 flames issued</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Active within the last 30 days</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <span>Must complete sacred oath ceremony before access granted</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="emergency-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Key className="mr-2 h-5 w-5" /> Emergency Succession Keys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 text-xs uppercase text-justice-light/60 pb-2 border-b border-justice-light/20">
                  <div className="col-span-3">Created</div>
                  <div className="col-span-3">Expires</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Access Level</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                
                {emergencyKeys.map(key => (
                  <div key={key.id} className="grid grid-cols-12 items-center py-2">
                    <div className="col-span-3">
                      {new Date(key.created_at).toLocaleDateString()}
                    </div>
                    <div className="col-span-3">
                      {new Date(key.expires_at).toLocaleDateString()}
                    </div>
                    <div className="col-span-2">
                      {key.activated ? (
                        <span className="inline-flex items-center text-red-500">
                          <XCircle className="h-3 w-3 mr-1" /> Used
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" /> Active
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 capitalize">
                      {key.emergency_access_level}
                    </div>
                    <div className="col-span-2 text-right">
                      <ButtonXs size="xs" variant="outline" className="mr-2">
                        View
                      </ButtonXs>
                      <ButtonXs size="xs" variant="destructive">
                        Revoke
                      </ButtonXs>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Create New Emergency Key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {validationError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}
              
              {successMessage && (
                <Alert variant="success" className="mb-4">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Passphrase</label>
                  <Input 
                    type="password" 
                    placeholder="Enter a secure passphrase" 
                    value={newKey.passphrase}
                    onChange={(e) => setNewKey({...newKey, passphrase: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">Confirm Passphrase</label>
                  <Input 
                    type="password" 
                    placeholder="Confirm passphrase" 
                    value={newKey.confirmPassphrase}
                    onChange={(e) => setNewKey({...newKey, confirmPassphrase: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Expires In (days)</label>
                    <Input 
                      type="number" 
                      min="1" 
                      value={newKey.expiresIn}
                      onChange={(e) => setNewKey({...newKey, expiresIn: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Access Level</label>
                    <select 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={newKey.accessLevel}
                      onChange={(e) => setNewKey({...newKey, accessLevel: e.target.value as 'limited' | 'full'})}
                    >
                      <option value="limited">Limited (Petitions Only)</option>
                      <option value="full">Full (All Systems)</option>
                    </select>
                  </div>
                </div>
                
                <Button className="w-full" onClick={handleCreateEmergencyKey}>
                  Create Emergency Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nodes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Clock className="mr-2 h-5 w-5" /> Node Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 text-xs uppercase text-justice-light/60 pb-2 border-b border-justice-light/20">
                  <div className="col-span-2">Node ID</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3">Last Heartbeat</div>
                  <div className="col-span-2">Flame Integrity</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                
                {nodes.map(node => (
                  <div key={node.id} className="grid grid-cols-12 items-center py-2">
                    <div className="col-span-2 font-mono text-sm">
                      #{node.id}
                    </div>
                    <div className="col-span-2 capitalize">
                      {node.node_type}
                    </div>
                    <div className="col-span-2">
                      {node.status === 'active' && (
                        <span className="inline-flex items-center text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" /> Active
                        </span>
                      )}
                      {node.status === 'degraded' && (
                        <span className="inline-flex items-center text-amber-500">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Degraded
                        </span>
                      )}
                      {node.status === 'offline' && (
                        <span className="inline-flex items-center text-red-500">
                          <XCircle className="h-3 w-3 mr-1" /> Offline
                        </span>
                      )}
                    </div>
                    <div className="col-span-3">
                      {new Date(node.last_heartbeat).toLocaleTimeString()}
                    </div>
                    <div className="col-span-2">
                      {node.flame_integrity}%
                    </div>
                    <div className="col-span-1 text-right">
                      <ButtonXs size="xs" variant="outline">
                        Details
                      </ButtonXs>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <FileText className="mr-2 h-5 w-5" /> Succession Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-justice-light/80">
                In the event of system failure or compromise, the succession protocol will be initiated automatically according to the Sacred Scroll Governance Clause §7.3. The protocol will:
              </p>
              
              <ol className="list-decimal pl-6 space-y-2 text-justice-light/80">
                <li>Immediately lock all active petitions and seal current verdicts</li>
                <li>Notify all succession candidates via secure channels</li>
                <li>Require multi-signature approval from at least 3 eligible candidates</li>
                <li>Restore system access using emergency succession keys</li>
                <li>Record all restoration actions in an immutable audit log</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuccessionSystem;
