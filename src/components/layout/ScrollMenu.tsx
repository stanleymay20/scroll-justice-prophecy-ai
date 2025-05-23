
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '@/contexts/language';
import { 
  Scroll, 
  Scale, 
  GraduationCap, 
  Flame, 
  Coins,
  LibraryBig 
} from 'lucide-react';

export const ScrollMenu = () => {
  const { t } = useLanguage();
  
  const menuItems = [
    {
      label: t('menu.court', 'Scroll Court'),
      icon: <Scroll className="w-4 h-4" />,
      path: '/scroll-court'
    },
    {
      label: t('menu.judgment', 'Judgment Room'),
      icon: <Scale className="w-4 h-4" />,
      path: '/judgment-room'
    },
    {
      label: t('menu.wealth', 'ScrollWealth'),
      icon: <Coins className="w-4 h-4" />,
      path: '/wealth'
    },
    {
      label: t('menu.exodus', 'Exodus Map'),
      icon: <Flame className="w-4 h-4" />,
      path: '/exodus'
    },
    {
      label: t('menu.principles', 'Principles'),
      icon: <GraduationCap className="w-4 h-4" />,
      path: '/principles'
    },
    {
      label: t('menu.memory', 'Scroll Memory'),
      icon: <LibraryBig className="w-4 h-4" />,
      path: '/memory'
    }
  ];
  
  return (
    <div className="bg-black/30 p-3 rounded-lg border border-justice-primary/20">
      <h2 className="text-sm font-semibold text-justice-light mb-2 px-2">
        {t('menu.title', 'Sacred Scroll Navigation')}
      </h2>
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-2 py-2 text-sm rounded-md transition-colors ${
                    isActive 
                      ? 'bg-justice-primary/20 text-white' 
                      : 'text-justice-light hover:bg-black/20 hover:text-white'
                  }`
                }
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
