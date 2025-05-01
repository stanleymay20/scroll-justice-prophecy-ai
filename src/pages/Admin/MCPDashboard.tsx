
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/layout/NavBar';
import { MetaTags } from '@/components/MetaTags';
import { MasterControlPanel } from '@/components/admin/MasterControlPanel';
import { useAuth } from '@/contexts/AuthContext';
import { getUserRole } from '@/services/userService';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MCPDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  
  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        navigate('/signin');
        return;
      }
      
      setLoading(true);
      
      try {
        const role = await getUserRole();
        const accessGranted = ['admin', 'judge'].includes(role);
        
        setHasAccess(accessGranted);
        
        if (!accessGranted) {
          // Delay navigation to show the access denied message
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAccess();
  }, [user, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
        <NavBar />
        <div className="container mx-auto px-4 pt-20 pb-16 flex justify-center items-center min-h-[600px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-justice-primary animate-spin mb-4 mx-auto" />
            <p className="text-justice-light">Verifying sacred access privileges...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
        <NavBar />
        <div className="container mx-auto px-4 pt-20 pb-16 flex justify-center items-center min-h-[600px]">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-justice-light/80 mb-6">
              You do not have permission to access the Master Control Panel.
              Only administrators and judges may enter this sacred area.
            </p>
            <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="Master Control Panel" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <MasterControlPanel />
      </div>
    </div>
  );
}
