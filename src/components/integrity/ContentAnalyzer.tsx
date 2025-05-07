
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { analyzeContent } from '@/services/integrityService';

interface ContentAnalyzerProps {
  initialContent: string;
  onAnalysisComplete?: (result: { score: number; issues: string[] }) => void;
}

export const ContentAnalyzer = ({
  initialContent,
  onAnalysisComplete
}: ContentAnalyzerProps) => {
  const [score, setScore] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);
  const [content, setContent] = useState(initialContent);
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    // Reset state when content changes
    setContent(initialContent);
    setAnalyzed(false);
    
    // Debounce analysis to avoid too many API calls
    const handler = setTimeout(() => {
      if (initialContent.trim().length > 20) {
        analyzeContent();
      }
    }, 1000);
    
    return () => clearTimeout(handler);
  }, [initialContent]);

  const analyzeContent = async () => {
    if (isAnalyzing || content.trim().length < 20) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeContent(content);
      
      if (result) {
        setScore(result.score);
        setIssues(result.issues || []);
        
        if (onAnalysisComplete) {
          onAnalysisComplete({
            score: result.score,
            issues: result.issues || []
          });
        }
      }
      
      setAnalyzed(true);
    } catch (error) {
      console.error('Error analyzing content:', error);
      setIssues(['Error analyzing content. Please try again.']);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreClass = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getProgressColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  if (!analyzed && content.trim().length < 20) {
    return null;
  }

  return (
    <div className="mt-4 border border-justice-tertiary/20 rounded-md p-3 bg-black/20">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Content Integrity Analysis</h3>
        <span className={`text-sm font-bold ${getScoreClass()}`}>
          {isAnalyzing ? 'Analyzing...' : `Score: ${score}`}
        </span>
      </div>
      
      <Progress
        value={score}
        className="h-2"
        indicatorClassName={getProgressColor()}
      />
      
      {issues.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-justice-light/70 mb-1">Potential issues:</p>
          <div className="flex flex-wrap gap-1">
            {issues.map((issue, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {issue}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
