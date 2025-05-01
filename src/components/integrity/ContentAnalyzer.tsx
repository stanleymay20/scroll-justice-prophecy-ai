
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Shield, Check } from "lucide-react";
import { analyzeContent } from "@/services/integrityService";

interface ContentAnalyzerProps {
  initialContent?: string;
  onAnalysisComplete?: (result: any) => void;
}

export const ContentAnalyzer = ({ initialContent = "", onAnalysisComplete }: ContentAnalyzerProps) => {
  const [content, setContent] = useState(initialContent);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError("Please enter content to analyze");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeContent(content);
      setResult(analysisResult);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }
    } catch (err) {
      console.error("Error analyzing content:", err);
      setError("Failed to analyze content: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setAnalyzing(false);
    }
  };

  const getIntegrityColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Sacred Integrity Analysis</h3>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter text to analyze for sacred integrity..."
          className="h-32"
        />
      </div>

      <Button
        onClick={handleAnalyze}
        disabled={analyzing || !content.trim()}
      >
        {analyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" /> Analyze Integrity
          </>
        )}
      </Button>

      {result && (
        <div className="rounded-md bg-black/30 p-4 border border-justice-tertiary/30">
          <h4 className="font-medium text-white mb-2">Analysis Results</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-justice-light/70">Integrity Score:</span>
              <span className={getIntegrityColor(result.integrityScore)}>
                {result.integrityScore}%
              </span>
            </div>
            
            {result.issues && result.issues.length > 0 ? (
              <div>
                <p className="text-sm text-justice-light/70 mb-1">Potential Issues:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {result.issues.map((issue: string, index: number) => (
                    <li key={index} className="text-sm text-justice-light">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex items-center text-green-500">
                <Check className="h-4 w-4 mr-2" />
                <span>No integrity issues detected</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
