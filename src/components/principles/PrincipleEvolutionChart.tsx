
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Principle } from '@/types';
import { TrendingUp } from 'lucide-react';

interface PrincipleEvolutionChartProps {
  principles?: Principle[];
}

const defaultPrinciples: Principle[] = [
  {
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
  },
  {
    id: '2',
    name: 'Equal Protection',
    description: 'Equal treatment under law',
    strength: 88,
    evolution_date: '2024-01-10',
    jurisdiction: 'Constitutional',
    evolution: [
      { date: '2024-01-01', strength: 85, event: 'Baseline establishment' },
      { date: '2024-01-10', strength: 88, event: 'Case law evolution' }
    ]
  }
];

export const PrincipleEvolutionChart: React.FC<PrincipleEvolutionChartProps> = ({ 
  principles = defaultPrinciples 
}) => {
  return (
    <div className="space-y-4">
      {principles.map(principle => (
        <Card key={principle.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {principle.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{principle.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Current Strength:</span>
                <span className="font-bold text-lg">{principle.strength}%</span>
              </div>
              
              {principle.evolution && principle.evolution.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Evolution Timeline:</h4>
                  {principle.evolution.map((point, index) => (
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
