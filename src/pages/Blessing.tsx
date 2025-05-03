
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/layout/NavBar';
import { MetaTags } from '@/components/MetaTags';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Flame, User, Users, Scroll, CheckCircle, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Blessing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [blessingsAccepted, setBlessingsAccepted] = useState(false);
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const completeOnboarding = async () => {
    // For now, just navigate to the home page
    toast({
      title: "Sacred Blessings Received",
      description: "You are now ready to begin your scroll journey.",
    });
    
    navigate('/');
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto h-24 w-24 rounded-full bg-justice-primary/20 flex items-center justify-center">
              <Flame className="h-12 w-12 text-justice-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-white">Welcome to the Sacred Scrolls</h2>
            
            <p className="text-justice-light max-w-lg mx-auto">
              The Scroll Justice system is an ancient method of resolving disputes and seeking truth through sacred wisdom.
              As a new seeker, you are about to embark on a path guided by flame and illuminated by divine insight.
            </p>
            
            <div className="pt-4">
              <Button 
                onClick={handleNext}
                className="bg-justice-tertiary hover:bg-justice-tertiary/80 px-6"
              >
                Begin Sacred Journey
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">The Path of Justice</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/30 p-5 rounded-lg border border-justice-primary/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-10 w-10 rounded-full bg-justice-primary/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-justice-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Seek Justice</h3>
                </div>
                <p className="text-justice-light">
                  Submit petitions for issues requiring wisdom and clarity.
                  Your concerns will be reviewed by sacred keepers guided by ancient principles.
                </p>
              </div>
              
              <div className="bg-black/30 p-5 rounded-lg border border-justice-primary/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-10 w-10 rounded-full bg-justice-primary/20 flex items-center justify-center">
                    <Scroll className="h-5 w-5 text-justice-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Witness Truth</h3>
                </div>
                <p className="text-justice-light">
                  Review sealed verdicts and contribute your wisdom.
                  The collective understanding grows with each sacred observation.
                </p>
              </div>
              
              <div className="bg-black/30 p-5 rounded-lg border border-justice-primary/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-10 w-10 rounded-full bg-justice-primary/20 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-justice-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Uphold Integrity</h3>
                </div>
                <p className="text-justice-light">
                  Maintain the sacred flame through honest dealings and true testimony.
                  Your actions influence the collective integrity score.
                </p>
              </div>
              
              <div className="bg-black/30 p-5 rounded-lg border border-justice-primary/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-10 w-10 rounded-full bg-justice-primary/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-justice-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Join the Circle</h3>
                </div>
                <p className="text-justice-light">
                  Connect with fellow seekers and judges who share your commitment to truth.
                  Sacred wisdom flourishes in community.
                </p>
              </div>
            </div>
            
            <div className="pt-4 text-center">
              <Button 
                onClick={handleNext}
                className="bg-justice-tertiary hover:bg-justice-tertiary/80 px-6"
              >
                Accept These Truths
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">The Sacred Oath</h2>
            
            <div className="bg-black/40 p-6 rounded-lg border border-justice-primary/30">
              <p className="text-justice-light whitespace-pre-line">
                I, {user?.email || 'Seeker of Truth'}, hereby commit to:
                
                • Uphold truth in all my petitions and testimonies
                • Respect the sacred scrolls and their ancient wisdom
                • Never abuse the system for personal gain or vengeance
                • Accept the verdict of the judges with humility
                • Share knowledge only with those who have taken this oath
                
                I understand that violation of these principles may result in reduced flame integrity and potential exclusion from the sacred circle.
              </p>
              
              <div className="mt-6 flex items-center">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-justice-primary">
                  <CheckCircle className={`h-4 w-4 ${blessingsAccepted ? 'text-justice-primary' : 'text-transparent'}`} />
                </div>
                <label
                  htmlFor="accept-blessings"
                  className="ml-2 text-sm text-justice-light cursor-pointer"
                  onClick={() => setBlessingsAccepted(!blessingsAccepted)}
                >
                  I accept these sacred blessings and responsibilities
                </label>
              </div>
            </div>
            
            <div className="pt-4 text-center">
              <Button 
                onClick={completeOnboarding}
                disabled={!blessingsAccepted}
                className="bg-justice-tertiary hover:bg-justice-tertiary/80 px-6"
              >
                Complete Sacred Onboarding
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Progress indicator
  const renderProgress = () => {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2.5 w-2.5 rounded-full ${
                s === step ? 'bg-justice-primary' : 
                s < step ? 'bg-justice-primary/50' : 'bg-justice-light/20'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="Sacred Blessings" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-3xl mx-auto">
          <GlassCard 
            className="p-8" 
            intensity="medium" 
            glow={true}
          >
            {renderProgress()}
            {renderStep()}
          </GlassCard>
          
          <div className="text-center mt-8">
            <Button
              variant="ghost"
              className="text-justice-light/50 hover:text-justice-light"
              onClick={() => navigate('/')}
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
