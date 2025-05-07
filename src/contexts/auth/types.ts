
import { User, Session } from "@supabase/supabase-js";
import { SubscriptionStatus, SubscriptionTier } from "@/types/subscription";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isJudge: boolean;
  userRole: string | null;
  subscription: any | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  profile: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}
