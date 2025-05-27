
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollMemory } from '@/types';
import { Scroll, Clock } from 'lucide-react';

interface ScrollMemoryTrailProps {
  memory?: ScrollMemory;
  memories?: ScrollMemory[];
  cases?: Record<string, string>;
}

const defaultMemory: ScrollMemory = {
  id: '1',
  trail_id: 'trail-001',
  phase: 'DAWN',
  scroll_phase: 'DAWN',
  gate: 3,
  timestamp: '2024-01-15T10:00:00Z',
  event_type: 'CASE_JUDGEMENT',
  description: 'Sacred principle established in employment law case',
  metadata: { caseId: 'case-001' },
  case_ids: ['case-001', 'case-002'],
  principles: ['Due Process', 'Equal Treatment'],
  prophetic_insight: 'This case sets precedent for future employment disputes',
  confidence: 92
};

export const ScrollMemoryTrail: React.FC<ScrollMemoryTrailProps> = ({ 
  memory,
  memories,
  cases = {}
}) => {
  // Handle both single memory and memories array
  const memoriesToRender = memory ? [memory] : (memories || [defaultMemory]);

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'DAWN': return 'bg-yellow-500';
      case 'RISE': return 'bg-orange-500';
      case 'ASCEND': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {memoriesToRender.map(mem => (
        <Card key={mem.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Scroll className="h-5 w-5" />
                Trail {mem.trail_id?.substring(-3) || mem.id.substring(0, 8)}
              </CardTitle>
              <Badge className={`${getPhaseColor(mem.scroll_phase || mem.phase)} text-white`}>
                {mem.scroll_phase || mem.phase} Gate {mem.gate}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{mem.description}</p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(mem.timestamp).toLocaleString()}
            </div>
            
            {mem.case_ids && mem.case_ids.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground">Related Cases:</span>
                <div className="flex gap-1 mt-1">
                  {mem.case_ids.map(caseId => (
                    <Badge key={caseId} variant="outline" className="text-xs">
                      {cases[caseId] || caseId}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {mem.principles && mem.principles.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground">Principles:</span>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {mem.principles.map(principle => (
                    <Badge key={principle} variant="secondary" className="text-xs">
                      {principle}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {mem.prophetic_insight && (
              <div className="p-3 bg-muted rounded-lg">
                <span className="text-xs text-muted-foreground">Prophetic Insight:</span>
                <p className="text-sm italic">{mem.prophetic_insight}</p>
                {mem.confidence && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Confidence: {mem.confidence}%
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
