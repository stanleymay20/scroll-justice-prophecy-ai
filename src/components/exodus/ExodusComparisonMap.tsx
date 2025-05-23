
import React from 'react';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { GlobalExodusData } from '@/types/prophet';
import { Flame, Scroll } from 'lucide-react';
import { useLanguage } from '@/contexts/language';

// Data will come from an API in production
const exodusData: GlobalExodusData[] = [
  {
    id: "exodus-001",
    groupName: "Historical Group A",
    historicalTribe: "Historical Reference A",
    modernPharaoh: "System A",
    exodusStatus: 'Call',
    estimatedDebt: 0,
    prophetName: "Historical Source A",
    scrollLink: "#"
  },
  {
    id: "exodus-002",
    groupName: "Historical Group B",
    historicalTribe: "Historical Reference B",
    modernPharaoh: "System B",
    exodusStatus: 'Resistance',
    estimatedDebt: 0,
    prophetName: "Historical Source B",
    scrollLink: "#"
  },
  {
    id: "exodus-003",
    groupName: "Historical Group C",
    historicalTribe: "Historical Reference C",
    modernPharaoh: "System C",
    exodusStatus: 'ScrollPlague',
    estimatedDebt: 0,
    prophetName: "Historical Source C",
    scrollLink: "#"
  },
  {
    id: "exodus-004",
    groupName: "Historical Group D",
    historicalTribe: "Historical Reference D",
    modernPharaoh: "System D",
    exodusStatus: 'Bondage',
    estimatedDebt: 0,
    scrollLink: "#"
  },
  {
    id: "exodus-005",
    groupName: "Historical Group E",
    historicalTribe: "Historical Reference E",
    modernPharaoh: "System E",
    exodusStatus: 'Exodus',
    estimatedDebt: 0,
    prophetName: "Historical Source E",
    scrollLink: "#"
  }
];

// Enterprise-ready formatting function
const formatCurrency = (amount: number): string => {
  if (amount <= 0) return "TBD";
  if (amount >= 1000000000000) {
    return `$${(amount / 1000000000000).toFixed(1)} trillion`;
  }
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)} billion`;
  }
  return `$${(amount / 1000000).toFixed(1)} million`;
};

// Helper to get status display
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
  const { t } = useLanguage();
  
  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-cinzel text-white mb-4">{t("exodus.comparisonMap", "Historical Comparison Map")}</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-justice-light uppercase bg-black/30">
            <tr>
              <th scope="col" className="px-4 py-3">{t("exodus.group", "Group")}</th>
              <th scope="col" className="px-4 py-3">{t("exodus.reference", "Historical Reference")}</th>
              <th scope="col" className="px-4 py-3">{t("exodus.system", "System")}</th>
              <th scope="col" className="px-4 py-3">{t("exodus.status", "Status")}</th>
              <th scope="col" className="px-4 py-3">{t("exodus.estimate", "Economic Impact")}</th>
              <th scope="col" className="px-4 py-3">{t("exodus.source", "Source")}</th>
              <th scope="col" className="px-4 py-3">{t("exodus.action", "Action")}</th>
            </tr>
          </thead>
          <tbody>
            {exodusData.map((group) => {
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
                    {group.prophetName || "Pending Analysis"}
                  </td>
                  <td className="px-4 py-3">
                    <a 
                      href={group.scrollLink}
                      className="text-xs px-3 py-1 bg-justice-primary/20 hover:bg-justice-primary/40 text-justice-light rounded transition-colors"
                    >
                      {t("exodus.viewDetails", "View Details")}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-700/30">
        <h3 className="text-md font-semibold text-white mb-2">{t("exodus.timeline", "Historical Timeline")}</h3>
        
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
          <p>{t("exodus.timelineDescription", "The timeline illustrates progression phases through historical reconciliation processes.")}</p>
        </div>
      </div>
    </GlassCard>
  );
};
