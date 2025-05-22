
import { useState, useEffect } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { MetaTags } from '@/components/MetaTags';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollWarningForm } from '@/components/witness/ScrollWarningForm';
import { JudgmentSeal } from '@/components/witness/JudgmentSeal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Link2, 
  Eye, 
  Send, 
  Flame
} from 'lucide-react';
import { ScrollWitnessRecord } from '@/types/witness';
import { fetchWitnessRecords, issueWarning, sealForJudgment } from '@/services/witnessService';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export default function WitnessDashboard() {
  const { userRole } = useAuth();
  const [selectedRecord, setSelectedRecord] = useState<ScrollWitnessRecord | null>(null);
  const [showJudgmentSeal, setShowJudgmentSeal] = useState(false);
  
  const isProphet = userRole === 'admin' || userRole === 'prophet';
  
  // Fetch witness records
  const { data: witnessRecords, isLoading, refetch } = useQuery({
    queryKey: ['witnessRecords'],
    queryFn: fetchWitnessRecords,
  });
  
  // Handle issue warning
  const handleIssueWarning = async (record: ScrollWitnessRecord) => {
    const success = await issueWarning(record.id);
    if (success) {
      refetch();
    }
  };
  
  // Handle seal for judgment
  const handleSealForJudgment = async (record: ScrollWitnessRecord) => {
    const success = await sealForJudgment(record.id);
    if (success) {
      setSelectedRecord(record);
      setShowJudgmentSeal(true);
      setTimeout(() => {
        setShowJudgmentSeal(false);
        refetch();
      }, 5000);
    }
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not issued';
    return format(new Date(dateString), 'PPP');
  };
  
  // Get status badge
  const getStatusBadge = (status: ScrollWitnessRecord['status']) => {
    switch (status) {
      case 'Observed':
        return <Badge className="bg-blue-500 text-white">Observed</Badge>;
      case 'Ignored':
        return <Badge className="bg-amber-500 text-white">Ignored</Badge>;
      case 'Repented':
        return <Badge className="bg-green-500 text-white">Repented</Badge>;
      case 'Sealed for Judgment':
        return <Badge className="bg-red-500 text-white">Sealed for Judgment</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="ScrollWitness - Divine Institution Oversight" />
      <NavBar />
      
      {showJudgmentSeal && (
        <JudgmentSeal 
          visible={true} 
          institutionName={selectedRecord?.institution} 
        />
      )}
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <h1 className="text-3xl font-cinzel text-center text-white mb-6">
          ScrollWitness: Divine Institution Oversight
        </h1>
        
        <p className="text-justice-light text-center max-w-2xl mx-auto mb-8">
          The ScrollWitness system issues divine warnings to institutions with historical 
          injustices and monitors their responses. Those who ignore the warnings will be 
          sealed for judgment in the sacred record.
        </p>
        
        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="bg-black/30 mx-auto">
            <TabsTrigger value="records">Witness Records</TabsTrigger>
            <TabsTrigger value="create">Issue Warning</TabsTrigger>
          </TabsList>
          
          <TabsContent value="records" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-justice-primary rounded-full"></div>
                  <div className="h-2 w-2 bg-justice-primary rounded-full"></div>
                  <div className="h-2 w-2 bg-justice-primary rounded-full"></div>
                </div>
              </div>
            ) : !witnessRecords || witnessRecords.length === 0 ? (
              <GlassCard className="p-6 text-center">
                <p className="text-justice-light">No witness records found. Issue a divine warning to begin.</p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black/40 text-justice-light">
                      <tr>
                        <th className="p-4">Institution</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Warning Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {witnessRecords.map((record) => (
                        <tr 
                          key={record.id} 
                          className="border-b border-white/10 hover:bg-justice-primary/5"
                        >
                          <td className="p-4 font-medium text-white">{record.institution}</td>
                          <td className="p-4 text-justice-light">{record.type}</td>
                          <td className="p-4 text-justice-light">{formatDate(record.warning_date)}</td>
                          <td className="p-4">{getStatusBadge(record.status)}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              {!record.warning_issued && isProphet && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-blue-500/50 hover:bg-blue-500/10"
                                  onClick={() => handleIssueWarning(record)}
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  Issue
                                </Button>
                              )}
                              
                              {record.warning_issued && 
                               record.status !== 'Sealed for Judgment' && 
                               record.status !== 'Repented' && 
                               isProphet && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-red-500/50 hover:bg-red-500/10"
                                  onClick={() => handleSealForJudgment(record)}
                                >
                                  <Flame className="h-4 w-4 mr-1" />
                                  Seal
                                </Button>
                              )}
                              
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="hover:bg-white/5"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {isProphet && (
                  <div className="bg-black/30 p-4 rounded text-sm text-justice-light/80 mt-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p>
                        As a Prophet/Administrator, you have the authority to issue warnings and 
                        seal institutions for judgment. Exercise this power with wisdom and care.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create">
            <GlassCard className="p-6">
              <h2 className="text-xl font-cinzel text-white mb-6">Issue Divine Warning</h2>
              <ScrollWarningForm />
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
