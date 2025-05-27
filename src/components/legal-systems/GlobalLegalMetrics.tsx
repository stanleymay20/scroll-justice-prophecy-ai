
import { GlobalLegalMetrics as GlobalMetrics } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Globe, Scale, Users, Languages, BookOpen, Award } from "lucide-react";

interface GlobalLegalMetricsProps {
  metrics: GlobalMetrics;
}

export function GlobalLegalMetrics({ metrics }: GlobalLegalMetricsProps) {
  return (
    <Card className="border-justice-tertiary bg-transparent">
      <CardHeader className="border-b border-justice-dark">
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          Global Legal System Coverage
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm font-medium">
              <Globe className="mr-2 h-4 w-4 text-justice-light" />
              Jurisdiction Coverage
            </div>
            <span className="text-justice-light">{metrics.jurisdiction_count}</span>
          </div>
          <Progress value={metrics.case_coverage_percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {metrics.case_coverage_percentage}% of global jurisdictions analyzed
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm font-medium">
              <Scale className="mr-2 h-4 w-4 text-justice-light" />
              Principle Universality
            </div>
            <span className="text-justice-light">{metrics.principle_universality_score.toFixed(1)}/10</span>
          </div>
          <Progress value={metrics.principle_universality_score * 10} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Alignment of principles across jurisdictions
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm font-medium">
              <Languages className="mr-2 h-4 w-4 text-justice-light" />
              Language Diversity
            </div>
            <span className="text-justice-light">{metrics.language_diversity}</span>
          </div>
          <Progress value={(metrics.language_diversity / 20) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Number of supported legal languages
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm font-medium">
              <BookOpen className="mr-2 h-4 w-4 text-justice-light" />
              International Alignment
            </div>
            <span className="text-justice-light">{metrics.international_alignment.toFixed(1)}/10</span>
          </div>
          <Progress value={metrics.international_alignment * 10} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Coherence with international legal frameworks
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm font-medium">
              <Users className="mr-2 h-4 w-4 text-justice-light" />
              Human Rights Compliance
            </div>
            <span className="text-justice-light">{metrics.human_rights_compliance.toFixed(1)}/10</span>
          </div>
          <Progress value={metrics.human_rights_compliance * 10} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Alignment with UDHR principles
          </p>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Award className="h-10 w-10 text-justice-primary mb-2" />
            <div className="text-center">
              <div className="text-sm font-medium">UN/ICC Compliance</div>
              <div className="text-2xl font-bold text-justice-light">
                {((metrics.international_alignment + metrics.human_rights_compliance) / 2 * 10).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
