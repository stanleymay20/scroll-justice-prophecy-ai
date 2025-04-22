
import { Principle } from "@/types";
import { Card } from "@/components/ui/card";

interface PrincipleEvolutionChartProps {
  principle: Principle;
}

export function PrincipleEvolutionChart({ principle }: PrincipleEvolutionChartProps) {
  // Check if there's evolution data
  if (!principle.evolution || principle.evolution.length === 0) {
    return (
      <div className="text-center p-6 bg-justice-dark/10 rounded-lg">
        <p className="text-muted-foreground">No evolution data available</p>
      </div>
    );
  }

  // Sort evolution chronologically
  const sortedEvolution = [...principle.evolution].sort((a, b) => a.year - b.year);
  
  // Calculate the maximum impact score for scaling
  const maxImpact = Math.max(...sortedEvolution.map(e => e.impact_score));
  
  // Calculate timeline width
  const startYear = sortedEvolution[0].year;
  const endYear = sortedEvolution[sortedEvolution.length - 1].year;
  const timeSpan = endYear - startYear;
  
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong": return "bg-principle-strong text-justice-dark";
      case "medium": return "bg-principle-medium text-justice-dark";
      case "weak": return "bg-principle-weak text-white";
      default: return "bg-principle-medium text-justice-dark";
    }
  };

  return (
    <Card className="p-6 bg-justice-dark text-white border-justice-tertiary">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">{principle.name}</h3>
        <div className={`rounded-full px-3 py-1 text-sm ${getStrengthColor(principle.strength)}`}>
          {principle.strength}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">{principle.description}</p>
      
      <div className="relative h-[200px] border-l border-b border-justice-tertiary">
        {/* Y-axis label */}
        <div className="absolute -left-8 top-1/2 -rotate-90 text-xs text-muted-foreground whitespace-nowrap">
          Impact Score
        </div>
        
        {/* Timeline */}
        <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-justice-tertiary"></div>
        
        {/* Evolution points */}
        {sortedEvolution.map((point, index) => {
          const xPosition = timeSpan === 0 ? 50 : ((point.year - startYear) / timeSpan) * 100;
          const height = (point.impact_score / maxImpact) * 100;
          
          return (
            <div 
              key={index}
              className="absolute transform -translate-x-1/2"
              style={{ 
                left: `${xPosition}%`, 
                bottom: 0,
              }}
            >
              {/* Evolution point */}
              <div className="relative">
                <div 
                  className="absolute bottom-0 w-4 bg-justice-primary rounded-t-sm"
                  style={{ height: `${height * 1.5}px` }}
                ></div>
                <div className="absolute bottom-full mb-1 transform -translate-x-1/2 left-1/2 w-1 h-1 bg-white rounded-full"></div>
                
                {/* Year label */}
                <div className="absolute bottom-[-20px] transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                  {point.year}
                </div>
                
                {/* Hover tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-justice-dark border border-justice-tertiary rounded p-2 text-xs w-48 transform -translate-x-1/2 left-1/2 pointer-events-none">
                  <p>Year: {point.year}</p>
                  <p>Impact: {point.impact_score.toFixed(1)}/10</p>
                  <p className="truncate">{point.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
