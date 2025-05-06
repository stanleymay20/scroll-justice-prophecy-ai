import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, AlertTriangle, UserPlus, UserMinus, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/language";

const SuccessionSystem = () => {
  const [judges, setJudges] = useState<any[]>([]);
  const [witnesses, setWitnesses] = useState<any[]>([]);
  const [integrityLogs, setIntegrityLogs] = useState<any[]>([]);
  const [newJudgeEmail, setNewJudgeEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Function to safely handle username display from potentially incorrect data
  const getUsernameDisplay = (userData: any) => {
    if (!userData) return 'Unknown User';
    if (typeof userData === 'string') return userData;
    return userData.username || 'Unnamed User';
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch judges
        const { data: judgesData, error: judgesError } = await supabase
          .from('user_roles')
          .select('user_id, profiles(username)')
          .eq('role', 'judge');
        
        if (judgesError) throw judgesError;
        setJudges(judgesData || []);
        
        // Fetch witnesses
        const { data: witnessesData, error: witnessesError } = await supabase
          .from('user_roles')
          .select('user_id, profiles(username)')
          .eq('role', 'witness');
        
        if (witnessesError) throw witnessesError;
        setWitnesses(witnessesData || []);
        
        // Fetch integrity logs
        const { data: logsData, error: logsError } = await supabase
          .from('scroll_integrity_logs')
          .select('user_id, action_type, integrity_impact, profiles(username)')
          .limit(50);
        
        if (logsError) throw logsError;
        setIntegrityLogs(logsData || []);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load system data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const handleAddJudge = async () => {
    try {
      // Check if the email is valid
      if (!newJudgeEmail || !newJudgeEmail.includes('@')) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive"
        });
        return;
      }
      
      // Check if the user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newJudgeEmail)
        .single();
      
      if (userError) throw userError;
      if (!userData) {
        toast({
          title: "User Not Found",
          description: "No user found with that email address.",
          variant: "destructive"
        });
        return;
      }
      
      // Add the user as a judge
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: userData.id, role: 'judge' });
      
      if (error) throw error;
      
      // Refresh the data
      setJudges(prev => [...prev, { user_id: userData.id, username: newJudgeEmail }]);
      setNewJudgeEmail("");
      
      toast({
        title: "Judge Added",
        description: `${newJudgeEmail} has been added as a judge.`,
      });
    } catch (err: any) {
      console.error("Error adding judge:", err);
      toast({
        title: "Error Adding Judge",
        description: err.message || "Failed to add judge.",
        variant: "destructive"
      });
    }
  };
  
  const handleRemoveJudge = async (userId: string) => {
    try {
      // Remove the user as a judge
      const { data, error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'judge');
      
      if (error) throw error;
      
      // Refresh the data
      setJudges(prev => prev.filter(judge => judge.user_id !== userId));
      
      toast({
        title: "Judge Removed",
        description: "Judge has been removed successfully.",
      });
    } catch (err: any) {
      console.error("Error removing judge:", err);
      toast({
        title: "Error Removing Judge",
        description: err.message || "Failed to remove judge.",
        variant: "destructive"
      });
    }
  };

  const handleElevateUser = (userId: string) => {
    // Placeholder for elevate user functionality
    toast({
      title: "Elevate User",
      description: `Elevating user ${userId} to a higher role.`,
    });
  };

  const exportSystemData = () => {
    // Create a formatted string with all system data
    let exportData = "--- SCROLL JUSTICE SYSTEM DATA ---\n\n";
    
    exportData += "JUDGES:\n";
    judges.forEach((judge, i) => {
      exportData += `${i + 1}. ${getUsernameDisplay(judge)} - Role: Judge\n`;
    });
    
    exportData += "\nWITNESSES:\n";
    witnesses.forEach((witness, i) => {
      exportData += `${i + 1}. ${getUsernameDisplay(witness)} - Role: Witness\n`;
    });
    
    exportData += "\nINTEGRITY LOGS:\n";
    integrityLogs.forEach((log, i) => {
      exportData += `${i + 1}. Action: ${log.action_type} - Impact: ${log.integrity_impact} - User: ${getUsernameDisplay(log)}\n`;
    });
    
    // Create blob and download
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scroll-justice-system-data.txt';
    document.body.appendChild(link);
    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );
    document.body.removeChild(link);
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-justice-primary mb-4">Succession System</h1>
      <p className="text-justice-light/70 mb-8">Manage judges, witnesses, and system integrity.</p>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-justice-primary" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Judges Management */}
          <Card className="bg-black/40 border-justice-secondary">
            <CardHeader>
              <CardTitle className="text-justice-light">Judges</CardTitle>
              <CardDescription>Manage sacred scroll judges.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="email"
                  placeholder="Enter judge email"
                  value={newJudgeEmail}
                  onChange={(e) => setNewJudgeEmail(e.target.value)}
                />
                <Button size="sm" onClick={handleAddJudge}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              <ul className="space-y-2">
                {judges.map(judge => (
                  <li key={judge.user_id} className="flex items-center justify-between">
                    <span className="text-justice-light">{getUsernameDisplay(judge)}</span>
                    <Button 
                      variant="destructive" 
                      size="xs" 
                      onClick={() => handleRemoveJudge(judge.user_id)}
                    >
                      <UserMinus className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Witnesses Management */}
          <Card className="bg-black/40 border-justice-secondary">
            <CardHeader>
              <CardTitle className="text-justice-light">Witnesses</CardTitle>
              <CardDescription>Manage sacred scroll witnesses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {witnesses.map(witness => (
                  <li key={witness.user_id} className="flex items-center justify-between">
                    <span className="text-justice-light">{getUsernameDisplay(witness)}</span>
                    <Button 
                      variant="ghost" 
                      size="xs"
                      onClick={() => handleElevateUser(witness.user_id)}
                    >
                      Elevate
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Integrity Logs */}
          <Card className="bg-black/40 border-justice-secondary">
            <CardHeader>
              <CardTitle className="text-justice-light">Integrity Logs</CardTitle>
              <CardDescription>Recent system integrity logs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {integrityLogs.map(log => (
                  <li key={log.id} className="text-sm text-justice-light/70">
                    {log.action_type} - {log.integrity_impact} - {getUsernameDisplay(log)}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="mt-8">
        <Button 
          variant="secondary" 
          onClick={exportSystemData}
          className="flex items-center"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export System Data
        </Button>
      </div>
    </div>
  );
}

export default SuccessionSystem;
