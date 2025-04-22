
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ScrollPhase } from '@/types';

// Mock data for case volumes over time
const caseVolumeData = [
  { 
    month: 'Jan', 
    DAWN: 24, 
    RISE: 18, 
    ASCEND: 5,
    total: 47 
  },
  { 
    month: 'Feb', 
    DAWN: 28, 
    RISE: 22, 
    ASCEND: 8,
    total: 58 
  },
  { 
    month: 'Mar', 
    DAWN: 32, 
    RISE: 25, 
    ASCEND: 12,
    total: 69 
  },
  { 
    month: 'Apr', 
    DAWN: 35, 
    RISE: 30, 
    ASCEND: 15,
    total: 80 
  },
  { 
    month: 'May', 
    DAWN: 42, 
    RISE: 34, 
    ASCEND: 20,
    total: 96 
  },
  { 
    month: 'Jun', 
    DAWN: 38, 
    RISE: 36, 
    ASCEND: 23,
    total: 97 
  },
];

// Helper function to get color based on scroll phase
const getScrollPhaseColor = (phase: ScrollPhase): string => {
  switch (phase) {
    case 'DAWN': return '#1EAEDB'; // Blue
    case 'RISE': return '#FEC6A1'; // Gold
    case 'ASCEND': return '#FFFFFF'; // White
    default: return '#1EAEDB';
  }
};

export function CaseVolumeChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={caseVolumeData}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        stackOffset="expand"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="month" 
          tick={{ fill: 'rgba(255,255,255,0.7)' }}
          axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
        />
        <YAxis 
          tick={{ fill: 'rgba(255,255,255,0.7)' }}
          axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'rgba(18, 18, 30, 0.9)', 
            border: '1px solid rgba(155, 135, 245, 0.3)', 
            borderRadius: '4px',
            color: 'white'
          }}
          formatter={(value, name) => [`${value} cases`, `${name} Phase`]}
          labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
        />
        <Bar 
          dataKey="DAWN" 
          fill={getScrollPhaseColor('DAWN')} 
          name="DAWN" 
          radius={[0, 0, 0, 0]} 
        />
        <Bar 
          dataKey="RISE" 
          fill={getScrollPhaseColor('RISE')} 
          name="RISE"
          radius={[0, 0, 0, 0]}
        />
        <Bar 
          dataKey="ASCEND" 
          fill={getScrollPhaseColor('ASCEND')} 
          name="ASCEND"
          radius={[0, 0, 0, 0]} 
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
