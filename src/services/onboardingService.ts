
import { supabase } from '@/integrations/supabase/client';

interface OnboardingEmailParams {
  to: string;
  username: string;
  emailType: "welcome" | "petition" | "subscription" | "privacy" | "community";
  days?: number;
}

/**
 * Schedule the onboarding email sequence for a new user
 */
export async function scheduleOnboardingSequence(email: string, username: string): Promise<boolean> {
  try {
    // Immediately send welcome email
    const welcomeSent = await sendOnboardingEmail({
      to: email,
      username,
      emailType: "welcome"
    });
    
    // Record the onboarding sequence initiation in the database
    const { error } = await supabase
      .from('user_onboarding')
      .insert({
        user_email: email,
        welcome_sent: welcomeSent,
        welcome_sent_at: welcomeSent ? new Date().toISOString() : null,
        sequence_position: welcomeSent ? 1 : 0,
        next_email_type: welcomeSent ? "petition" : "welcome",
        next_email_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days later
      });
      
    if (error) {
      console.error("Failed to record onboarding sequence:", error);
      return false;
    }
    
    return welcomeSent;
  } catch (error) {
    console.error("Error scheduling onboarding sequence:", error);
    return false;
  }
}

/**
 * Send a specific onboarding email
 */
export async function sendOnboardingEmail(params: OnboardingEmailParams): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("send-onboarding-email", {
      body: params
    });

    if (error || !data?.success) {
      console.error("Failed to send onboarding email:", error || data);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending onboarding email:", error);
    return false;
  }
}

/**
 * Send the next email in the onboarding sequence
 */
export async function sendNextOnboardingEmail(email: string): Promise<boolean> {
  try {
    // Get the current onboarding state
    const { data: onboardingData, error: fetchError } = await supabase
      .from('user_onboarding')
      .select('*')
      .eq('user_email', email)
      .maybeSingle();

    if (fetchError || !onboardingData) {
      console.error("Failed to fetch onboarding status:", fetchError);
      return false;
    }

    // Get user profile for name
    const { data: profileData } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', onboardingData.user_id)
      .maybeSingle();

    const username = profileData?.username || 'Seeker of Justice';
    
    // Send the next email in sequence
    const emailSent = await sendOnboardingEmail({
      to: email,
      username,
      emailType: onboardingData.next_email_type as any,
      days: Math.floor((Date.now() - new Date(onboardingData.welcome_sent_at || '').getTime()) / (24 * 60 * 60 * 1000))
    });

    if (emailSent) {
      // Update the sequence position and next email
      const nextEmailMap: Record<string, string> = {
        "welcome": "petition",
        "petition": "subscription",
        "subscription": "privacy",
        "privacy": "community",
        "community": "completed"
      };

      const nextEmailType = nextEmailMap[onboardingData.next_email_type] || "completed";
      const nextPosition = onboardingData.sequence_position + 1;
      
      // Update the onboarding record
      const updateData: Record<string, any> = {
        sequence_position: nextPosition,
        next_email_type: nextEmailType,
      };
      
      // Set the appropriate sent flag and timestamp
      if (onboardingData.next_email_type) {
        updateData[`${onboardingData.next_email_type}_sent`] = true;
        updateData[`${onboardingData.next_email_type}_sent_at`] = new Date().toISOString();
      }
      
      // Set the next email date if not completed
      if (nextEmailType !== "completed") {
        updateData.next_email_date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
      } else {
        updateData.next_email_date = null;
      }
      
      const { error: updateError } = await supabase
        .from('user_onboarding')
        .update(updateData)
        .eq('user_email', email);

      if (updateError) {
        console.error("Failed to update onboarding status:", updateError);
      }
    }

    return emailSent;
  } catch (error) {
    console.error("Error sending next onboarding email:", error);
    return false;
  }
}

/**
 * Opt-out user from onboarding emails
 */
export async function optOutOfOnboarding(email: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_onboarding')
      .update({
        opted_out: true,
        opted_out_at: new Date().toISOString()
      })
      .eq('user_email', email);
      
    return !error;
  } catch (error) {
    console.error("Error opting out of onboarding:", error);
    return false;
  }
}

/**
 * Update user preferences for onboarding emails
 */
export async function updateOnboardingPreferences(
  email: string,
  preferences: {
    receiveWelcome?: boolean;
    receivePetition?: boolean;
    receiveSubscription?: boolean;
    receivePrivacy?: boolean;
    receiveCommunity?: boolean;
  }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_onboarding')
      .update({
        preferences
      })
      .eq('user_email', email);
      
    return !error;
  } catch (error) {
    console.error("Error updating onboarding preferences:", error);
    return false;
  }
}
