
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the system health timeline
const healthData = [
  { date: 'Jan', health: 85 },
  { date: 'Feb', health: 88 },
  { date: 'Mar', health: 92 },
  { date: 'Apr', health: 90 },
  { date: 'May', health: 93 },
  { date: 'Jun', health: 91 },
  { date: 'Jul', health: 94 },
];

export function SystemHealthTimeline() {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={healthData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
        <XAxis 
          dataKey="date" 
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
        />
        <YAxis 
          domain={[80, 100]} 
          hide={true}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'rgba(18, 18, 30, 0.9)', 
            border: '1px solid rgba(155, 135, 245, 0.3)', 
            borderRadius: '4px',
            color: 'white'
          }}
          labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
        />
        <Line 
          type="monotone" 
          dataKey="health" 
          stroke="#9b87f5" 
          strokeWidth={2}
          dot={{ r: 3, fill: '#9b87f5', stroke: 'rgba(18, 18, 30, 0.9)', strokeWidth: 1 }}
          activeDot={{ r: 6, fill: '#9b87f5', stroke: 'white', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
