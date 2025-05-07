
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { scheduleOnboardingSequence } from '@/services/onboardingService';

export const useOnboarding = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    const checkAndInitOnboarding = async () => {
      if (!user?.email) return;
      
      try {
        // Check if the user already has an onboarding record
        const { data, error } = await supabase
          .from('user_onboarding')
          .select('id')
          .eq('user_email', user.email)
          .maybeSingle();
        
        // If no onboarding record exists, create one and start the sequence
        if (!data && !error) {
          console.log("Initializing onboarding sequence for new user");
          
          // Get the username if available
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
            
          const username = profile?.username || 'Seeker of Justice';
          
          // Start the onboarding sequence
          await scheduleOnboardingSequence(user.email, username);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    };
    
    checkAndInitOnboarding();
  }, [user]);
};
