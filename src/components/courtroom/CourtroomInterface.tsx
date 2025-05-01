
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollPetition } from '@/types/petition';
import { fetchPetitions } from '@/services/petitionService';
import { PetitionCard } from './PetitionCard';
import { PetitionForm } from './PetitionForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hasAccess } from '@/services/userService';
import { PulseEffect } from '@/components/advanced-ui/PulseEffect';
import { Loader2, AlertTriangle } from 'lucide-react';

export function CourtroomInterface() {
  const [petitions, setPetitions] = useState<ScrollPetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingPetition, setIsCreatingPetition] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('open');
  const { user } = useAuth();
  
  // Load petitions
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Check if user is admin or judge
        const adminAccess = await hasAccess('judge');
        setIsAdmin(adminAccess);
        
        const fetchedPetitions = await fetchPetitions(adminAccess);
        setPetitions(fetchedPetitions);
      } catch (err: any) {
        console.error('Failed to load petitions:', err);
        setError(err.message || 'Failed to load petitions');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadData();
    }
  }, [user]);
  
  // Filter petitions by tab
  const filteredPetitions = petitions.filter(petition => {
    switch (activeTab) {
      case 'open':
        return petition.status === 'pending' || petition.status === 'in_review';
      case 'verdicts':
        return petition.status === 'verdict_delivered';
      case 'sealed':
        return petition.status === 'sealed';
      case 'mine':
        return petition.petitioner_id === user?.id;
      default:
        return true;
    }
  });
  
  // Handler for petition creation completion
  const handlePetitionCreated = (newPetition: ScrollPetition) => {
    setPetitions(prev => [newPetition, ...prev]);
    setIsCreatingPetition(false);
  };
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="h-12 w-12 text-justice-primary mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Sacred Access Required</h2>
        <p className="text-justice-light/80 text-center max-w-md mb-4">
          You must sign in to access the Sacred Courtroom and submit petitions.
        </p>
        <Button variant="default" onClick={() => window.location.href = '/signin'}>
          Sign In to Access Courtroom
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Sacred Courtroom</h2>
          <p className="text-justice-light/80">View petitions and seek the wisdom of the scrolls</p>
        </div>
        
        {!isCreatingPetition && (
          <Button 
            className="mt-4 sm:mt-0 relative bg-justice-tertiary hover:bg-justice-tertiary/80"
            onClick={() => setIsCreatingPetition(true)}
          >
            Submit New Petition
            <div className="absolute -top-1 -right-1">
              <PulseEffect color="bg-justice-primary" />
            </div>
          </Button>
        )}
      </div>
      
      {isCreatingPetition ? (
        <div className="mb-8">
          <PetitionForm 
            onPetitionCreated={handlePetitionCreated} 
            onCancel={() => setIsCreatingPetition(false)}
          />
        </div>
      ) : (
        <Tabs defaultValue="open" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="bg-justice-dark/50">
            <TabsTrigger value="open">Open Petitions</TabsTrigger>
            <TabsTrigger value="verdicts">Delivered Verdicts</TabsTrigger>
            <TabsTrigger value="sealed">Sealed Scrolls</TabsTrigger>
            <TabsTrigger value="mine">My Petitions</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-justice-primary" />
                <span className="ml-2 text-justice-light">Consulting the sacred scrolls...</span>
              </div>
            ) : error ? (
              <div className="bg-destructive/20 border border-destructive/50 rounded-md p-4 text-white">
                <p className="font-semibold">Failed to load petitions</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : filteredPetitions.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredPetitions.map(petition => (
                  <PetitionCard 
                    key={petition.id} 
                    petition={petition} 
                    isAdmin={isAdmin}
                    onUpdate={(updatedPetition) => {
                      setPetitions(prev => prev.map(p => 
                        p.id === updatedPetition.id ? updatedPetition : p
                      ));
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-justice-light/70">
                <p>No petitions found in this category.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
