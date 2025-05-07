import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, FileText, User, Shield, Calendar } from "lucide-react";
import { ScrollPetition, PetitionStatus } from "@/types/scroll-petition";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/contexts/language";

// Create an enhanced version of ScrollPetition for this page
interface EnhancedSealedPetition extends ScrollPetition {
  petitionerName: string;
  judgeName: string;
  timeAgo: string;
}

const HallOfSealedScrolls = () => {
  const [petitions, setPetitions] = useState<EnhancedSealedPetition[]>([]);
  const [filteredPetitions, setFilteredPetitions] = useState<EnhancedSealedPetition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Fetch petitions from Supabase
  useEffect(() => {
    const fetchPetitions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('scroll_petitions')
          .select(`
            *,
            petitioner:profiles(id, username),
            judge:profiles(id, username)
          `)
          .eq('is_sealed', true)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Process and enhance petition data
        const enhancedData = data.map(petition => ({
          ...petition,
          petitionerName: petition.petitioner?.username || 'Anonymous Petitioner',
          judgeName: petition.judge?.username || 'Unassigned',
          timeAgo: formatDistanceToNow(new Date(petition.created_at), { addSuffix: true }),
          status: petition.status as PetitionStatus,
        }));
        
        setPetitions(enhancedData);
        setFilteredPetitions(enhancedData);
      } catch (err) {
        console.error("Error fetching sealed petitions:", err);
        toast({
          title: "Failed to Load Sealed Scrolls",
          description: "There was an error accessing the Hall of Sealed Scrolls.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetitions();
  }, [toast]);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPetitions(petitions);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = petitions.filter(
        (petition) =>
          petition.title.toLowerCase().includes(term) ||
          petition.description.toLowerCase().includes(term) ||
          petition.petitionerName.toLowerCase().includes(term) ||
          petition.judgeName.toLowerCase().includes(term)
      );
      setFilteredPetitions(filtered);
    }
  }, [searchTerm, petitions]);

  const handlePetitionClick = (id: string) => {
    navigate(`/petition/${id}`);
  };
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-400 border-amber-400">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-justice-primary mb-2">Hall of Sealed Scrolls</h1>
      <p className="text-justice-light/70 mb-6">
        Ancient verdicts preserved in digital form, accessible to all seekers of justice.
      </p>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-justice-light/50" />
        <Input
          className="pl-10"
          placeholder="Search sealed petitions by title, description, or participants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-justice-primary" />
        </div>
      ) : filteredPetitions.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-justice-light/30 mb-4" />
          <h3 className="text-xl font-medium text-justice-light mb-1">No Sealed Scrolls Found</h3>
          <p className="text-justice-light/70">
            {searchTerm ? "No petitions match your search criteria." : "The Hall of Sealed Scrolls is empty."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPetitions.map((petition) => (
            <Card
              key={petition.id}
              className="bg-black/40 border-justice-secondary/50 hover:border-justice-primary transition-colors cursor-pointer"
              onClick={() => handlePetitionClick(petition.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-justice-light truncate" title={petition.title}>
                    {petition.title}
                  </CardTitle>
                  {renderStatusBadge(petition.status || 'pending')}
                </div>
                <CardDescription className="line-clamp-2" title={petition.description}>
                  {petition.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex items-center text-justice-light/70 mb-2">
                  <User className="h-4 w-4 mr-1.5" />
                  <span className="text-sm truncate" title={`Petitioner: ${petition.petitionerName}`}>
                    {petition.petitionerName}
                  </span>
                </div>
                
                <div className="flex items-center text-justice-light/70">
                  <Shield className="h-4 w-4 mr-1.5" />
                  <span className="text-sm truncate" title={`Judge: ${petition.judgeName}`}>
                    {petition.judgeName}
                  </span>
                </div>
              </CardContent>
              
              <CardFooter>
                <div className="flex items-center text-justice-light/50 text-sm w-full">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span>{petition.timeAgo}</span>
                  
                  {petition.scroll_integrity_score !== null && (
                    <Badge 
                      variant="outline" 
                      className="ml-auto"
                      style={{
                        color: getIntegrityColor(petition.scroll_integrity_score),
                        borderColor: getIntegrityColor(petition.scroll_integrity_score, 0.3)
                      }}
                    >
                      Integrity: {petition.scroll_integrity_score}
                    </Badge>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function for integrity score color
const getIntegrityColor = (score: number, opacity: number = 1) => {
  if (score >= 80) return `rgba(34, 197, 94, ${opacity})`;
  if (score >= 50) return `rgba(234, 179, 8, ${opacity})`;
  return `rgba(239, 68, 68, ${opacity})`;
};

export default HallOfSealedScrolls;
