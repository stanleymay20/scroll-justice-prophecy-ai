
import React from 'react';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { GlobalExodusData } from '@/types/prophet';
import { Flame, Scroll } from 'lucide-react';

// Mock data for demo purposes
const mockExodusData: GlobalExodusData[] = [
  {
    id: "exodus-001",
    groupName: "African Diaspora",
    historicalTribe: "Israelites in Egypt",
    modernPharaoh: "Colonial Powers",
    exodusStatus: 'Call',
    estimatedDebt: 14000000000000,
    prophetName: "Multiple Voices Rising",
    scrollLink: "/scroll/exodus/african-diaspora"
  },
  {
    id: "exodus-002",
    groupName: "Palestinians",
    historicalTribe: "Canaanites",
    modernPharaoh: "Occupying Regime",
    exodusStatus: 'Resistance',
    estimatedDebt: 850000000000,
    prophetName: "Regional Witnesses",
    scrollLink: "/scroll/exodus/palestinians"
  },
  {
    id: "exodus-003",
    groupName: "Native Americans",
    historicalTribe: "Original Stewards",
    modernPharaoh: "Colonial States",
    exodusStatus: 'ScrollPlague',
    estimatedDebt: 7500000000000,
    prophetName: "Indigenous Leaders Council",
    scrollLink: "/scroll/exodus/native-americans"
  },
  {
    id: "exodus-004",
    groupName: "Uyghurs",
    historicalTribe: "Persecuted People",
    modernPharaoh: "Authoritarian State",
    exodusStatus: 'Bondage',
    estimatedDebt: 450000000000,
    scrollLink: "/scroll/exodus/uyghurs"
  },
  {
    id: "exodus-005",
    groupName: "Haitian People",
    historicalTribe: "First Black Republic",
    modernPharaoh: "IMF & Global Finance",
    exodusStatus: 'Exodus',
    estimatedDebt: 21000000000,
    prophetName: "Ancestral Justice Keepers",
    scrollLink: "/scroll/exodus/haiti"
  }
];

// Helper to format large currency amounts
const formatCurrency = (amount: number): string => {
  if (amount >= 1000000000000) {
    return `$${(amount / 1000000000000).toFixed(1)} trillion`;
  }
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)} billion`;
  }
  return `$${(amount / 1000000).toFixed(1)} million`;
};

// Helper to get status color and icon
const getStatusDisplay = (status: GlobalExodusData['exodusStatus']) => {
  switch (status) {
    case 'Bondage':
      return { color: 'bg-gray-600', textColor: 'text-gray-200', icon: null };
    case 'Call':
      return { color: 'bg-blue-900/40', textColor: 'text-blue-300', icon: <Scroll className="h-4 w-4 mr-1" /> };
    case 'Resistance':
      return { color: 'bg-yellow-900/40', textColor: 'text-yellow-300', icon: <Scroll className="h-4 w-4 mr-1" /> };
    case 'ScrollPlague':
      return { color: 'bg-red-900/40', textColor: 'text-red-300', icon: <Flame className="h-4 w-4 mr-1" /> };
    case 'Exodus':
      return { color: 'bg-green-900/40', textColor: 'text-green-300', icon: <Flame className="h-4 w-4 mr-1" /> };
    default:
      return { color: 'bg-gray-900/40', textColor: 'text-gray-300', icon: null };
  }
};

export const ExodusComparisonMap: React.FC = () => {
  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-cinzel text-white mb-4">Modern Egypts vs. Exodus Scrolls</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-justice-light uppercase bg-black/30">
            <tr>
              <th scope="col" className="px-4 py-3">Oppressed Group</th>
              <th scope="col" className="px-4 py-3">Historical Parallel</th>
              <th scope="col" className="px-4 py-3">Modern "Pharaoh"</th>
              <th scope="col" className="px-4 py-3">Exodus Status</th>
              <th scope="col" className="px-4 py-3">Reparations Owed</th>
              <th scope="col" className="px-4 py-3">Prophet</th>
              <th scope="col" className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockExodusData.map((group) => {
              const statusDisplay = getStatusDisplay(group.exodusStatus);
              return (
                <tr key={group.id} className="border-b border-gray-700 hover:bg-black/20">
                  <td className="px-4 py-3 font-medium text-white">
                    {group.groupName}
                  </td>
                  <td className="px-4 py-3 text-justice-light">
                    {group.historicalTribe}
                  </td>
                  <td className="px-4 py-3 text-justice-light">
                    {group.modernPharaoh}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center w-fit ${statusDisplay.color} ${statusDisplay.textColor}`}>
                      {statusDisplay.icon}
                      {group.exodusStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-justice-primary font-semibold">
                    {formatCurrency(group.estimatedDebt)}
                  </td>
                  <td className="px-4 py-3 text-justice-light">
                    {group.prophetName || "Awaiting Call"}
                  </td>
                  <td className="px-4 py-3">
                    <a 
                      href={group.scrollLink}
                      className="text-xs px-3 py-1 bg-justice-primary/20 hover:bg-justice-primary/40 text-justice-light rounded transition-colors"
                    >
                      View Scroll
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-700/30">
        <h3 className="text-md font-semibold text-white mb-2">Exodus Journey Visual</h3>
        
        <div className="grid grid-cols-5 gap-2 md:gap-4">
          {['Bondage', 'Call', 'Resistance', 'ScrollPlague', 'Exodus'].map((stage, index) => (
            <div key={stage} className="relative">
              <div className={`h-2 ${index === 4 ? 'bg-green-600/60' : 'bg-gray-700/60'} rounded-full`}></div>
              <p className="text-[10px] md:text-xs text-justice-light mt-1">{stage}</p>
              {stage === 'ScrollPlague' && (
                <Flame className="absolute -top-3 right-0 h-4 w-4 text-red-500" />
              )}
              {stage === 'Exodus' && (
                <Flame className="absolute -top-3 right-0 h-4 w-4 text-green-500" />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-justice-light/70">
          <p>The Red Sea meter fills as each group progresses through their Exodus journey. Scroll flames appear during divine intervention phases.</p>
        </div>
      </div>
    </GlassCard>
  );
};
