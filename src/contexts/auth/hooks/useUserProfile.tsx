
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useUserProfile(user: User | null) {
  const [profile, setProfile] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isJudge, setIsJudge] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id);
      fetchUserRole(user.id);
    } else {
      setProfile(null);
      setUserRole(null);
      setIsAdmin(false);
      setIsJudge(false);
    }
  }, [user]);

  // Fetch user profile from profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setProfile(null);
    }
  };
  
  // Fetch user role
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) throw error;
      
      const role = data?.role || 'petitioner'; // Default role
      setUserRole(role);
      
      // Check if user is an admin
      setIsAdmin(role === 'admin' || role === 'judge');
      setIsJudge(role === 'judge');
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole('petitioner'); // Default to basic role
      setIsAdmin(false);
      setIsJudge(false);
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
      await fetchUserRole(user.id);
    }
  };

  return {
    profile,
    userRole,
    isAdmin,
    isJudge,
    refreshUserProfile
  };
}
