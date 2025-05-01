
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'guest' | 'advocate' | 'seeker' | 'judge' | 'admin';

// Get the current user's role
export async function getUserRole(): Promise<UserRole> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return 'guest';
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
      
    if (error || !data) return 'guest';
    return data.role as UserRole;
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'guest';
  }
}

// Check if the user has a specific role or higher
export async function hasAccess(requiredRole: UserRole): Promise<boolean> {
  const currentRole = await getUserRole();
  const roleHierarchy: UserRole[] = ['guest', 'advocate', 'seeker', 'judge', 'admin'];
  
  const currentRoleIndex = roleHierarchy.indexOf(currentRole);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
  
  return currentRoleIndex >= requiredRoleIndex;
}

// Update a user's role (admin only)
export async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
  try {
    // First check if current user is admin
    const isAdmin = await hasAccess('admin');
    if (!isAdmin) return false;
    
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole, last_role_change: new Date().toISOString() })
      .eq('user_id', userId);
      
    return !error;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
}

// Get user reputation score
export async function getUserReputation(userId?: string): Promise<number> {
  try {
    // If no userId provided, use current user
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;
      userId = user.id;
    }
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('reputation_score')
      .eq('user_id', userId)
      .single();
      
    if (error || !data) return 0;
    return data.reputation_score;
  } catch (error) {
    console.error('Error getting user reputation:', error);
    return 0;
  }
}

// Log a scroll integrity action
export async function logScrollIntegrityAction(
  action: string,
  impact: number,
  description: string,
  petitionId?: string
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const log = {
      user_id: user.id,
      petition_id: petitionId,
      action_type: action,
      integrity_impact: impact,
      description
    };
    
    const { error } = await supabase
      .from('scroll_integrity_logs')
      .insert([log]);
      
    return !error;
  } catch (error) {
    console.error('Error logging integrity action:', error);
    return false;
  }
}

// Get all users (admin only)
export async function getAllUsers(): Promise<any[]> {
  try {
    const isAdmin = await hasAccess('admin');
    if (!isAdmin) return [];
    
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');
      
    if (rolesError) throw rolesError;
    
    // Combine user data with roles
    const users = authUsers.users.map(user => {
      const userRole = roles.find(r => r.user_id === user.id);
      return {
        ...user,
        role: userRole?.role || 'guest',
        reputation_score: userRole?.reputation_score || 0
      };
    });
    
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}
