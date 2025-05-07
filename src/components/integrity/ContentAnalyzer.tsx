
import { useState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ContentAnalyzerProps {
  initialContent: string;
  autoAnalyze?: boolean;
  threshold?: number;
  onAnalysisComplete?: (result: { score: number, issues: string[] }) => void;
}

export const ContentAnalyzer = ({
  initialContent,
  autoAnalyze = true,
  threshold = 50,
  onAnalysisComplete
}: ContentAnalyzerProps) => {
  const [content, setContent] = useState(initialContent);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ score: number; issues: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setContent(initialContent);
    
    // Auto analyze if enabled and content changes
    if (autoAnalyze && initialContent) {
      analyzeContent();
    }
  }, [initialContent, autoAnalyze]);

  const analyzeContent = async () => {
    if (!content || content.trim().length < 10) {
      setError("Content is too short to analyze");
      return;
    }

    setAnalyzing(true);
    setError(null);
    
    try {
      // Simulate analysis (Replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get proper score for content based on some metrics
      // In a real implementation, this would call an AI service
      const contentLower = content.toLowerCase();
      const wordCount = content.split(/\s+/).length;
      
      // Sample issues detection
      const issues: string[] = [];
      const flaggedTerms: { term: string; severity: number }[] = [];
      
      // Sample flagged terms (in reality, this would be a much more comprehensive list)
      if (contentLower.includes('urgent') || contentLower.includes('immediately')) {
        issues.push("Urgent language may indicate rushed judgment");
        flaggedTerms.push({ term: 'urgent/immediately', severity: 3 });
      }
      
      if (contentLower.includes('never') || contentLower.includes('always')) {
        issues.push("Absolute terms may indicate oversimplification");
        flaggedTerms.push({ term: 'never/always', severity: 2 });
      }
      
      if (wordCount < 50) {
        issues.push("Content may be too brief for thorough consideration");
      }
      
      // Calculate a score based on issues
      let score = 100;
      
      // Reduce score based on flagged terms
      flaggedTerms.forEach(term => {
        score -= term.severity * 5;
      });
      
      // Reduce score if content is too short
      if (wordCount < 50) {
        score -= (50 - wordCount);
      }
      
      // Ensure score stays within bounds
      score = Math.max(0, Math.min(100, score));
      
      const result = { score, issues };
      setAnalysisResult(result);
      
      // Call the callback with the result
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('Error analyzing content:', err);
      setError("Failed to analyze content");
    } finally {
      setAnalyzing(false);
    }
  };

  if (analyzing) {
    return (
      <div className="space-y-4 border border-justice-tertiary/30 rounded-md p-4 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Analysis Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!analysisResult) {
    return null;
  }

  // Get severity based on score
  const getSeverity = () => {
    if (analysisResult.score >= 80) return { color: "success", icon: <CheckCircle2 className="h-4 w-4" /> };
    if (analysisResult.score >= threshold) return { color: "warning", icon: <AlertCircle className="h-4 w-4" /> };
    return { color: "destructive", icon: <AlertTriangle className="h-4 w-4" /> };
  };
  
  const severity = getSeverity();
  const variantColor = severity.color as "success" | "warning" | "destructive" | "default";

  return (
    <div className={`border rounded-md p-4 ${
      analysisResult.score >= 80 
        ? "border-green-500/30 bg-green-500/10"
        : analysisResult.score >= threshold
          ? "border-yellow-500/30 bg-yellow-500/10"
          : "border-red-500/30 bg-red-500/10"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {severity.icon}
          <span className="font-medium">Content Integrity Score</span>
        </div>
        <Badge variant={variantColor}>{analysisResult.score}%</Badge>
      </div>
      
      <Progress 
        value={analysisResult.score} 
        className={`h-2 mb-4 ${
          analysisResult.score >= 80 
            ? "bg-green-950 [&>div]:bg-green-500" 
            : analysisResult.score >= threshold
              ? "bg-yellow-950 [&>div]:bg-yellow-500"
              : "bg-red-950 [&>div]:bg-red-500"
        }`}
      />
      
      {analysisResult.issues.length > 0 && (
        <div className="space-y-1 text-sm">
          <p className="font-medium mb-1">Potential Integrity Issues:</p>
          <ul className="list-disc pl-5 space-y-1">
            {analysisResult.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      
      {analysisResult.score < threshold && (
        <Alert variant="destructive" className="mt-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Integrity Warning</AlertTitle>
          <AlertDescription>
            This content may not meet the integrity requirements of the ScrollCourt system.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
