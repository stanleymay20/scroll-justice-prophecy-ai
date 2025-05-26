
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/components/language/LanguageProvider';
import { 
  Home, 
  FileText, 
  Scale, 
  BarChart3, 
  Settings, 
  Crown,
  Heart,
  Users
} from 'lucide-react';

const sidebarItems = [
  { id: 'dashboard', icon: Home, path: '/dashboard', roles: ['petitioner', 'advocate', 'scroll_judge', 'prophet', 'admin'] },
  { id: 'petitions', icon: FileText, path: '/petitions', roles: ['petitioner', 'advocate', 'scroll_judge', 'prophet', 'admin'] },
  { id: 'court', icon: Scale, path: '/court', roles: ['scroll_judge', 'prophet', 'admin'] },
  { id: 'analytics', icon: BarChart3, path: '/analytics', roles: ['advocate', 'scroll_judge', 'prophet', 'admin'] },
  { id: 'admin', icon: Crown, path: '/admin', roles: ['admin'] },
  { id: 'donate', icon: Heart, path: '/donate', roles: ['petitioner', 'advocate', 'scroll_judge', 'prophet', 'admin'] },
  { id: 'settings', icon: Settings, path: '/settings', roles: ['petitioner', 'advocate', 'scroll_judge', 'prophet', 'admin'] }
];

export function AppSidebar() {
  const location = useLocation();
  const { userRole } = useAuth();
  const { t } = useLanguage();

  const canAccess = (requiredRoles: string[]) => {
    return userRole && requiredRoles.includes(userRole);
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-black/20 backdrop-blur-sm border-r border-justice-primary/20 z-30">
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          if (!canAccess(item.roles)) return null;
          
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-justice-primary/20 text-justice-primary border border-justice-primary/30' 
                  : 'text-justice-light hover:bg-justice-primary/10 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{t(`nav.${item.id}`)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
