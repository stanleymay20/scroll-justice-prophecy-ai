
import React from 'react';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', cases: 12 },
  { month: 'Feb', cases: 18 },
  { month: 'Mar', cases: 24 },
  { month: 'Apr', cases: 30 },
  { month: 'May', cases: 35 },
  { month: 'Jun', cases: 42 }
];

export const CaseVolumeChart = () => {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Case Volume Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6'
            }} 
          />
          <Bar dataKey="cases" fill="#8B5CF6" />
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
};
