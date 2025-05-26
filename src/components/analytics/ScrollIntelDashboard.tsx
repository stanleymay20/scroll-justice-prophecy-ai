
import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  MapPin, 
  BarChart3, 
  Download, 
  Filter,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  month: string;
  petitions: number;
  verdicts: number;
  compensation: number;
}

interface RegionData {
  region: string;
  count: number;
  successRate: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const mockAnalyticsData: AnalyticsData[] = [
  { month: 'Jan', petitions: 45, verdicts: 42, compensation: 125000 },
  { month: 'Feb', petitions: 52, verdicts: 48, compensation: 134000 },
  { month: 'Mar', petitions: 61, verdicts: 55, compensation: 156000 },
  { month: 'Apr', petitions: 58, verdicts: 53, compensation: 142000 },
  { month: 'May', petitions: 67, verdicts: 61, compensation: 178000 },
  { month: 'Jun', petitions: 73, verdicts: 68, compensation: 195000 }
];

const mockRegionData: RegionData[] = [
  { region: 'Germany', count: 156, successRate: 89 },
  { region: 'France', count: 134, successRate: 92 },
  { region: 'United States', count: 98, successRate: 85 },
  { region: 'United Kingdom', count: 87, successRate: 91 },
  { region: 'International', count: 45, successRate: 78 }
];

const mockCategoryData: CategoryData[] = [
  { name: 'Wage Theft', value: 35, color: '#D4AF37' },
  { name: 'Discrimination', value: 25, color: '#8B5CF6' },
  { name: 'Consumer Fraud', value: 20, color: '#06B6D4' },
  { name: 'Housing Rights', value: 12, color: '#10B981' },
  { name: 'Labor Violations', value: 8, color: '#F59E0B' }
];

export function ScrollIntelDashboard() {
  const [timeRange, setTimeRange] = useState('6m');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [loading, setLoading] = useState(false);

  const exportData = async (format: 'csv' | 'pdf') => {
    setLoading(true);
    try {
      // Mock export
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (format === 'csv') {
        const csvContent = "data:text/csv;charset=utf-8," + 
          "Month,Petitions,Verdicts,Compensation\n" +
          mockAnalyticsData.map(row => `${row.month},${row.petitions},${row.verdicts},${row.compensation}`).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "scrollintel-analytics.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-justice-primary" />
          <h1 className="text-3xl font-cinzel text-white">ScrollIntel Analytics</h1>
        </div>
        
        <div className="flex space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-black/20 border-justice-primary/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={() => exportData('csv')}
            disabled={loading}
            variant="outline"
            className="border-justice-primary/30"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">520</p>
              <p className="text-sm text-justice-light">Total Petitions</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
          <div className="mt-2">
            <span className="text-green-400 text-sm">+12.5% vs last period</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">89.2%</p>
              <p className="text-sm text-justice-light">Success Rate</p>
            </div>
            <BarChart3 className="h-8 w-8 text-justice-primary" />
          </div>
          <div className="mt-2">
            <span className="text-green-400 text-sm">+2.1% vs last period</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">€1.23M</p>
              <p className="text-sm text-justice-light">Total Compensation</p>
            </div>
            <TrendingUp className="h-8 w-8 text-justice-tertiary" />
          </div>
          <div className="mt-2">
            <span className="text-green-400 text-sm">+18.3% vs last period</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">42</p>
              <p className="text-sm text-justice-light">Injustice Zones</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <div className="mt-2">
            <span className="text-red-400 text-sm">+3 new zones identified</span>
          </div>
        </GlassCard>
      </div>

      {/* Trends Chart */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-cinzel text-white mb-4">Petition Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockAnalyticsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #D4AF37',
                borderRadius: '8px'
              }}
            />
            <Line type="monotone" dataKey="petitions" stroke="#D4AF37" strokeWidth={2} />
            <Line type="monotone" dataKey="verdicts" stroke="#8B5CF6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Analysis */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-cinzel text-white mb-4">Regional Analysis</h2>
          <div className="space-y-4">
            {mockRegionData.map((region, index) => (
              <div key={region.region} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-justice-primary" />
                  <span className="text-white">{region.region}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-justice-light text-sm">{region.count} cases</span>
                  <div className={`px-2 py-1 rounded text-xs ${
                    region.successRate >= 90 ? 'bg-green-500/20 text-green-300' :
                    region.successRate >= 85 ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {region.successRate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Category Breakdown */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-cinzel text-white mb-4">Case Categories</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={mockCategoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {mockCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}
