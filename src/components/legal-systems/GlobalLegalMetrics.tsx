
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { GlobalLegalMetrics as GlobalLegalMetricsType } from '@/types';
import { Globe, TrendingUp, Users, Gavel, Shield, Scale } from 'lucide-react';

interface GlobalLegalMetricsProps {
  data?: GlobalLegalMetricsType;
}

const defaultMetrics: GlobalLegalMetricsType = {
  total_cases: 15420,
  success_rate: 87.3,
  avg_resolution_time: 4.2,
  jurisdictions_covered: 47,
  active_judges: 238,
  jurisdiction_count: 47,
  case_coverage_percentage: 78.5,
  principle_universality_score: 92.1,
  language_diversity: 85.4,
  international_alignment: 89.7,
  human_rights_compliance: 94.2
};

export const GlobalLegalMetrics: React.FC<GlobalLegalMetricsProps> = ({ 
  data = defaultMetrics 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Global Coverage</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.jurisdiction_count || data.jurisdictions_covered}</div>
          <p className="text-xs text-muted-foreground">
            {data.case_coverage_percentage?.toFixed(1) || '78.5'}% case coverage
          </p>
          <Progress value={data.case_coverage_percentage || 78.5} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Principle Universality</CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.principle_universality_score?.toFixed(1) || '92.1'}%</div>
          <p className="text-xs text-muted-foreground">
            Across {data.principle_universality_score ? Math.floor(data.principle_universality_score / 10) : 9} legal families
          </p>
          <Progress value={data.principle_universality_score || 92.1} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Language Diversity</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.language_diversity?.toFixed(1) || '85.4'}%</div>
          <p className="text-xs text-muted-foreground">
            {data.language_diversity ? Math.floor(data.language_diversity / 10) : 8} languages supported
          </p>
          <Progress value={data.language_diversity || 85.4} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">International Alignment</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.international_alignment?.toFixed(1) || '89.7'}%</div>
          <p className="text-xs text-muted-foreground">
            UN & ICC compliance
          </p>
          <Progress value={data.international_alignment || 89.7} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Human Rights</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.human_rights_compliance?.toFixed(1) || '94.2'}%</div>
          <p className="text-xs text-muted-foreground">
            UDHR compliance rate
          </p>
          <Progress value={data.human_rights_compliance || 94.2} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Global Justice Index</CardTitle>
          <Gavel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {((data.international_alignment || 89.7) + (data.human_rights_compliance || 94.2)) / 2}
          </div>
          <p className="text-xs text-muted-foreground">
            Overall system effectiveness
          </p>
          <Progress value={((data.international_alignment || 89.7) + (data.human_rights_compliance || 94.2)) / 2} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};
