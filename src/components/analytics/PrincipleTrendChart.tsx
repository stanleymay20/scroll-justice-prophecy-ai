
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for principle trends over time
const principleTrendData = [
  {
    year: '2018',
    'Equal Protection': 45,
    'Due Process': 38,
    'Human Dignity': 32,
    'Privacy': 25,
  },
  {
    year: '2019',
    'Equal Protection': 52,
    'Due Process': 43,
    'Human Dignity': 38,
    'Privacy': 30,
  },
  {
    year: '2020',
    'Equal Protection': 58,
    'Due Process': 52,
    'Human Dignity': 44,
    'Privacy': 35,
  },
  {
    year: '2021',
    'Equal Protection': 69,
    'Due Process': 60,
    'Human Dignity': 50,
    'Privacy': 42,
  },
  {
    year: '2022',
    'Equal Protection': 78,
    'Due Process': 68,
    'Human Dignity': 58,
    'Privacy': 48,
  },
  {
    year: '2023',
    'Equal Protection': 85,
    'Due Process': 75,
    'Human Dignity': 65,
    'Privacy': 55,
  },
  {
    year: '2024',
    'Equal Protection': 92,
    'Due Process': 87,
    'Human Dignity': 76,
    'Privacy': 68,
  },
];

export function PrincipleTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={principleTrendData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="year" 
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
          formatter={(value) => [`${value}%`]}
          labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
        />
        <Legend 
          wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }}
        />
        <Line 
          type="monotone" 
          dataKey="Equal Protection" 
          stroke="#F2FCE2" 
          strokeWidth={2}
          dot={{ r: 3, stroke: '#F2FCE2', fill: '#1A1F2C' }}
          activeDot={{ r: 6 }} 
        />
        <Line 
          type="monotone" 
          dataKey="Due Process" 
          stroke="#9b87f5" 
          strokeWidth={2}
          dot={{ r: 3, stroke: '#9b87f5', fill: '#1A1F2C' }}
          activeDot={{ r: 6 }} 
        />
        <Line 
          type="monotone" 
          dataKey="Human Dignity" 
          stroke="#FEF7CD" 
          strokeWidth={2}
          dot={{ r: 3, stroke: '#FEF7CD', fill: '#1A1F2C' }}
          activeDot={{ r: 6 }} 
        />
        <Line 
          type="monotone" 
          dataKey="Privacy" 
          stroke="#FEC6A1" 
          strokeWidth={2}
          dot={{ r: 3, stroke: '#FEC6A1', fill: '#1A1F2C' }}
          activeDot={{ r: 6 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
