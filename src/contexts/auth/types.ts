
import { Session, User } from "@supabase/supabase-js";
import { SubscriptionStatus, SubscriptionTier } from "@/types/subscription";

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  checkSubscriptionStatus: () => Promise<void>;
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionTier: SubscriptionTier | null;
  subscriptionEnd: string | null;
  userRole: string | null;
};
