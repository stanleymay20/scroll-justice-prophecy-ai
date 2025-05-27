
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Principle } from '@/types';
import { TrendingUp } from 'lucide-react';

interface PrincipleEvolutionChartProps {
  principle?: Principle;
  principles?: Principle[];
}

const defaultPrinciple: Principle = {
  id: '1',
  name: 'Due Process',
  description: 'Right to fair legal proceedings',
  strength: 95,
  evolution_date: '2024-01-15',
  jurisdiction: 'Global',
  evolution: [
    { date: '2024-01-01', strength: 90, event: 'Initial assessment' },
    { date: '2024-01-15', strength: 95, event: 'Reinforcement through cases' }
  ]
};

export const PrincipleEvolutionChart: React.FC<PrincipleEvolutionChartProps> = ({ 
  principle,
  principles
}) => {
  // Handle both single principle and principles array
  const principlesToRender = principle ? [principle] : (principles || [defaultPrinciple]);

  return (
    <div className="space-y-4">
      {principlesToRender.map(p => (
        <Card key={p.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {p.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{p.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Current Strength:</span>
                <span className="font-bold text-lg">{p.strength}%</span>
              </div>
              
              {p.evolution && p.evolution.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Evolution Timeline:</h4>
                  {p.evolution.map((point, index) => (
                    <div key={index} className="flex justify-between text-xs p-2 bg-muted rounded">
                      <span>{new Date(point.date).toLocaleDateString()}</span>
                      <span>{point.strength}% - {point.event}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
