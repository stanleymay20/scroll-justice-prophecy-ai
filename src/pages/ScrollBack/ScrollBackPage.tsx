
import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/language";
import { MetaTags } from "@/components/MetaTags";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollBackUserProfile } from "@/types/scrollback";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dna, Flame } from "lucide-react";

// Mock ancestral nations for demo
const ANCESTRAL_NATIONS = [
  "Ghana", "Nigeria", "Benin", "Togo", "Senegal", "Mali", "Congo",
  "Angola", "Mozambique", "Ethiopia", "Sudan", "Tanzania", "Kenya"
];

const ScrollBackPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<ScrollBackUserProfile>>({
    name: "",
    email: user?.email || "",
    ancestry_confirmed: false,
    origin_nation: "",
    restitution_amount: 0,
    scroll_mantles_unlocked: []
  });
  const [dnaFile, setDnaFile] = useState<File | null>(null);
  const [suggestedNations, setSuggestedNations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDnaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDnaFile(file);
      // Mock DNA analysis with random suggestions
      setTimeout(() => {
        const randomNations = ANCESTRAL_NATIONS
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        setSuggestedNations(randomNations);
        
        toast({
          title: "DNA Analysis Complete",
          description: "We've identified potential ancestral links."
        });
      }, 2000);
    }
  };

  const selectNation = (nation: string) => {
    setProfile({
      ...profile,
      origin_nation: nation,
      // Simulate restitution calculation
      restitution_amount: Math.floor(Math.random() * 10000) + 5000
    });
  };

  const submitApplication = () => {
    setIsSubmitting(true);
    // Simulate processing time
    setTimeout(() => {
      setIsSubmitting(false);
      setProfile({
        ...profile,
        ancestry_confirmed: true,
        scroll_mantles_unlocked: ["Ancestral Knowledge", "Community Connector"]
      });
      
      toast({
        title: "Application Approved",
        description: "Your ScrollBack ancestry has been confirmed!"
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("scrollback.title", "ScrollBack Restoration")} />
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="mr-3 p-2 rounded-full bg-justice-primary/20">
            <Dna className="h-6 w-6 text-justice-light" />
            <Flame className="h-6 w-6 text-justice-light mt-1" />
          </div>
          <h1 className="text-3xl font-cinzel text-white text-center">
            {t("scrollback.title", "ScrollBack: Restoration for Descendants")}
          </h1>
        </div>
        
        <Tabs defaultValue="apply" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="bg-black/30">
              <TabsTrigger value="apply">Ancestral Application</TabsTrigger>
              <TabsTrigger value="mantles">Scroll Mantles</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="apply" className="space-y-6">
            <GlassCard className="p-6 max-w-3xl mx-auto">
              {profile.ancestry_confirmed ? (
                <div className="text-center">
                  <div className="p-4 mb-6 inline-block rounded-full bg-green-900/20">
                    <Flame className="h-12 w-12 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-cinzel text-white mb-2">Ancestry Confirmed</h2>
                  <p className="text-justice-light mb-6">
                    Your connection to {profile.origin_nation} has been verified through our sacred scrolls.
                  </p>
                  
                  <div className="bg-black/30 p-4 rounded mb-6">
                    <h3 className="font-semibold text-white mb-2">Restoration Estimate</h3>
                    <p className="text-3xl font-bold text-green-400">${profile.restitution_amount}</p>
                    <p className="text-sm text-justice-light/70">Based on historical calculations</p>
                  </div>
                  
                  <div className="bg-justice-primary/10 p-4 rounded">
                    <h3 className="font-semibold text-white mb-2">Scroll Mantles Unlocked</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {profile.scroll_mantles_unlocked?.map(mantle => (
                        <span key={mantle} className="px-3 py-1 bg-justice-primary/30 text-white rounded-full">
                          {mantle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-cinzel text-white mb-4">Ancestral Lineage Application</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-justice-light mb-1">
                        Full Name
                      </label>
                      <Input 
                        placeholder="Your full legal name"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="bg-black/30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-justice-light mb-1">
                        Email
                      </label>
                      <Input 
                        type="email"
                        placeholder="Your contact email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="bg-black/30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-justice-light mb-1">
                        Known Ancestry Information (Optional)
                      </label>
                      <Textarea 
                        placeholder="Share any known information about your ancestry"
                        className="min-h-32 bg-black/30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-justice-light mb-1">
                        Upload DNA Test Results (Optional)
                      </label>
                      <Input 
                        type="file" 
                        onChange={handleDnaUpload}
                        className="bg-black/30"
                      />
                      <p className="text-xs text-justice-light/70 mt-1">
                        We accept 23andMe, Ancestry.com, MyHeritage, or AfricanAncestry results
                      </p>
                    </div>
                  </div>
                  
                  {suggestedNations.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-white mb-2">
                        Suggested Ancestral Nations
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {suggestedNations.map((nation) => (
                          <Button
                            key={nation}
                            onClick={() => selectNation(nation)}
                            variant={profile.origin_nation === nation ? "default" : "outline"}
                            className={profile.origin_nation === nation ? 
                              "bg-justice-primary" : "border-justice-primary/40"}
                          >
                            {nation}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={submitApplication} 
                    disabled={!profile.name || !profile.email || !profile.origin_nation || isSubmitting}
                    className="w-full bg-justice-primary hover:bg-justice-primary/90"
                  >
                    {isSubmitting ? "Processing..." : "Submit Application"}
                  </Button>
                </div>
              )}
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="mantles" className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-xl font-cinzel text-white mb-4">Sacred Scroll Mantles</h2>
              <p className="text-justice-light mb-6">
                Scroll Mantles are spiritual and practical gifts unlocked for verified descendants.
                Each carries specific powers and responsibilities within the ScrollJustice community.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/30 p-4 rounded border border-justice-primary/20">
                  <h3 className="font-semibold text-white mb-2">Ancestral Knowledge</h3>
                  <p className="text-justice-light mb-3">
                    Access to sacred archives and historical documents relating to your ancestry.
                  </p>
                  <div className="text-sm text-justice-light/70">
                    Requirements: Verified ancestry
                  </div>
                </div>
                
                <div className="bg-black/30 p-4 rounded border border-justice-primary/20">
                  <h3 className="font-semibold text-white mb-2">Community Connector</h3>
                  <p className="text-justice-light mb-3">
                    Ability to connect with others from your ancestral nation and build community.
                  </p>
                  <div className="text-sm text-justice-light/70">
                    Requirements: Verified ancestry + 30 days membership
                  </div>
                </div>
                
                <div className="bg-black/20 p-4 rounded border border-justice-primary/10">
                  <h3 className="font-semibold text-white/60 mb-2">Resource Reclaimer</h3>
                  <p className="text-justice-light/60 mb-3">
                    Power to initiate restoration claims for personal and community resources.
                  </p>
                  <div className="text-sm text-justice-light/50">
                    Requirements: Verified ancestry + 90 days membership
                  </div>
                </div>
                
                <div className="bg-black/20 p-4 rounded border border-justice-primary/10">
                  <h3 className="font-semibold text-white/60 mb-2">Sacred Advocate</h3>
                  <p className="text-justice-light/60 mb-3">
                    Authority to represent others in ScrollTribunal cases.
                  </p>
                  <div className="text-sm text-justice-light/50">
                    Requirements: 2 other mantles + Elder approval
                  </div>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="community" className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-xl font-cinzel text-white mb-4">Ancestral Community</h2>
              <p className="text-justice-light mb-6">
                Connect with others from your ancestral nation and build community through ScrollBack.
              </p>
              
              <Button className="w-full bg-justice-primary/90 hover:bg-justice-primary">
                Explore Communities
              </Button>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScrollBackPage;
