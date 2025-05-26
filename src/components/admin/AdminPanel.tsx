
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  Scale, 
  AlertTriangle, 
  Crown, 
  Eye, 
  Shield,
  TrendingUp,
  FileText
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalPetitions: number;
  pendingPetitions: number;
  totalDonations: number;
  activeJudges: number;
}

interface UserManagementRow {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in: string;
}

export function AdminPanel() {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPetitions: 0,
    pendingPetitions: 0,
    totalDonations: 0,
    activeJudges: 0
  });
  const [users, setUsers] = useState<UserManagementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('');

  useEffect(() => {
    if (hasRole('admin')) {
      loadAdminData();
    }
  }, [hasRole]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load statistics (mock data for now)
      setStats({
        totalUsers: 1247,
        totalPetitions: 892,
        pendingPetitions: 34,
        totalDonations: 15420,
        activeJudges: 12
      });

      // Load users (mock data)
      const mockUsers: UserManagementRow[] = [
        {
          id: '1',
          email: 'john.doe@example.com',
          role: 'petitioner',
          created_at: '2024-01-15T10:30:00Z',
          last_sign_in: '2024-01-20T14:22:00Z'
        },
        {
          id: '2',
          email: 'judge.smith@scrolljustice.com',
          role: 'scroll_judge',
          created_at: '2024-01-10T09:15:00Z',
          last_sign_in: '2024-01-20T11:45:00Z'
        },
        {
          id: '3',
          email: 'advocate.wilson@legal.com',
          role: 'advocate',
          created_at: '2024-01-12T16:20:00Z',
          last_sign_in: '2024-01-19T13:30:00Z'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Sacred Error",
        description: "Failed to load admin data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async () => {
    if (!selectedUser || !newRole) {
      toast({
        title: "Invalid Selection",
        description: "Please select a user and role",
        variant: "destructive"
      });
      return;
    }

    try {
      // Mock role update
      setUsers(prev => prev.map(u => 
        u.id === selectedUser ? { ...u, role: newRole } : u
      ));

      toast({
        title: "Role Updated",
        description: "User role has been successfully updated",
      });

      setSelectedUser('');
      setNewRole('');
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const sendScrollCry = async (message: string) => {
    try {
      // Mock sending alert
      toast({
        title: "ScrollCry Sent",
        description: "Alert has been sent to all users",
      });
    } catch (error) {
      console.error('Error sending ScrollCry:', error);
      toast({
        title: "Alert Failed",
        description: "Failed to send ScrollCry",
        variant: "destructive"
      });
    }
  };

  if (!hasRole('admin')) {
    return (
      <GlassCard className="p-8 text-center">
        <Shield className="h-16 w-16 text-justice-primary mx-auto mb-4" />
        <h2 className="text-2xl font-cinzel text-white mb-2">Access Restricted</h2>
        <p className="text-justice-light">Only administrators may access this sacred panel.</p>
      </GlassCard>
    );
  }

  if (loading) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-justice-primary mx-auto mb-4"></div>
        <p className="text-justice-light">Loading sacred admin data...</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Crown className="h-8 w-8 text-justice-primary" />
        <h1 className="text-3xl font-cinzel text-white">Sacred Admin Panel</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-justice-primary" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              <p className="text-sm text-justice-light">Total Users</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalPetitions}</p>
              <p className="text-sm text-justice-light">Total Petitions</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.pendingPetitions}</p>
              <p className="text-sm text-justice-light">Pending</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">€{stats.totalDonations}</p>
              <p className="text-sm text-justice-light">Donations</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            <Scale className="h-8 w-8 text-justice-tertiary" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.activeJudges}</p>
              <p className="text-sm text-justice-light">Active Judges</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* User Management */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-cinzel text-white mb-4">User Role Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="bg-black/20 border-justice-primary/30">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.email} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={newRole} onValueChange={setNewRole}>
            <SelectTrigger className="bg-black/20 border-justice-primary/30">
              <SelectValue placeholder="Select new role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="petitioner">Petitioner</SelectItem>
              <SelectItem value="advocate">Advocate</SelectItem>
              <SelectItem value="scroll_judge">Scroll Judge</SelectItem>
              <SelectItem value="prophet">Prophet</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={updateUserRole}
            className="bg-justice-primary hover:bg-justice-tertiary"
          >
            Update Role
          </Button>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
              <div>
                <p className="text-white font-medium">{user.email}</p>
                <p className="text-sm text-justice-light">
                  Created: {new Date(user.created_at).toLocaleDateString()} | 
                  Last active: {new Date(user.last_sign_in).toLocaleDateString()}
                </p>
              </div>
              <Badge className={`${getRoleBadgeColor(user.role)}`}>
                {user.role.replace('_', ' ')}
              </Badge>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ScrollCry Alert System */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-cinzel text-white mb-4">Send ScrollCry Alert</h2>
        <div className="flex space-x-3">
          <Input
            placeholder="Enter emergency message..."
            className="bg-black/20 border-justice-primary/30 text-white"
          />
          <Button 
            onClick={() => sendScrollCry("System maintenance scheduled")}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500/20"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Send Alert
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}

function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'admin': return 'bg-red-500/20 text-red-300 border-red-500';
    case 'prophet': return 'bg-purple-500/20 text-purple-300 border-purple-500';
    case 'scroll_judge': return 'bg-justice-primary/20 text-justice-primary border-justice-primary';
    case 'advocate': return 'bg-blue-500/20 text-blue-300 border-blue-500';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500';
  }
}
