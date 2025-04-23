
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scrollMemories, systemHealth } from "@/services/mockData";
import { Gavel, BookText, Check } from "lucide-react";

const CaseClassification = () => {
  const [caseText, setCaseText] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [analysisType, setAnalysisType] = useState("classify");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Get the current scroll phase and gate from the first memory
  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;

  // Mock classification result types
  const mockClassification = {
    primary_category: "Contract Dispute",
    subcategory: "Employment Contract",
    confidence: 0.89,
    relevant_precedents: [
      { case_id: "Smithson v. Acme Corp", similarity: 0.78 },
      { case_id: "Jones v. Global Industries", similarity: 0.65 }
    ],
    jurisdiction_recommendations: ["Federal Labor Court", "State Employment Tribunal"]
  };

  const mockSummary = {
    key_points: [
      "Disputed termination of employment contract dated March 15, 2023",
      "Plaintiff claims wrongful termination without proper notice",
      "Defendant argues termination was justified due to performance issues",
      "Employment agreement contained 30-day notice clause"
    ],
    parties: {
      plaintiff: "John Smith",
      defendant: "Acme Corporation"
    },
    legal_issues: ["Wrongful termination", "Contract breach", "Notice period requirements"],
    suggested_precedents: ["Williams v. United Systems (2018)", "Thompson v. Enterprise Ltd (2020)"]
  };

  const mockPrediction = {
    outcome_prediction: {
      favorable_to_plaintiff: 0.62,
      favorable_to_defendant: 0.38
    },
    key_factors: [
      "Documented performance reviews favor defendant (high impact)",
      "Notice period requirements potentially not met (high impact)",
      "Similar cases with comparable facts favor plaintiff (medium impact)"
    ],
    recommended_approach: "Settlement negotiation recommended based on similar case outcomes",
    timeline_estimate: "8-12 months if proceeding to trial",
    settlement_range: "$45,000 - $75,000 based on similar cases"
  };

  const handleAnalyze = () => {
    if (!caseText) return;
    
    setLoading(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      switch (analysisType) {
        case "classify":
          setResult(mockClassification);
          break;
        case "summarize":
          setResult(mockSummary);
          break;
        case "predict":
          setResult(mockPrediction);
          break;
        default:
          setResult(null);
      }
      setLoading(false);
    }, 1500);
  };

  const renderResult = () => {
    if (!result) return null;

    switch (analysisType) {
      case "classify":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-semibold text-justice-primary">{result.primary_category}</div>
              <div className="text-sm bg-justice-primary/20 px-2 py-1 rounded-md">
                {result.subcategory}
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                Confidence: {(result.confidence * 100).toFixed(1)}%
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Relevant Precedents:</h3>
              <div className="space-y-2">
                {result.relevant_precedents.map((precedent: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-justice-dark/50 p-2 rounded-md">
                    <div>{precedent.case_id}</div>
                    <div className="text-sm text-muted-foreground">
                      Similarity: {(precedent.similarity * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Jurisdiction Recommendations:</h3>
              <div className="flex flex-wrap gap-2">
                {result.jurisdiction_recommendations.map((jurisdiction: string, index: number) => (
                  <div key={index} className="bg-justice-tertiary/20 px-3 py-1 rounded-full text-sm">
                    {jurisdiction}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "summarize":
        return (
          <div className="space-y-4">
            <div className="bg-justice-dark/50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-2">Key Points:</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.key_points.map((point: string, index: number) => (
                  <li key={index} className="text-sm">{point}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-justice-dark/50 p-3 rounded-md">
                <h3 className="text-sm font-medium mb-2">Parties:</h3>
                <div className="text-sm">
                  <div><span className="text-muted-foreground">Plaintiff:</span> {result.parties.plaintiff}</div>
                  <div><span className="text-muted-foreground">Defendant:</span> {result.parties.defendant}</div>
                </div>
              </div>

              <div className="bg-justice-dark/50 p-3 rounded-md">
                <h3 className="text-sm font-medium mb-2">Legal Issues:</h3>
                <div className="flex flex-wrap gap-1">
                  {result.legal_issues.map((issue: string, index: number) => (
                    <span key={index} className="bg-justice-primary/20 px-2 py-0.5 rounded text-xs">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-justice-dark/50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-2">Suggested Precedents:</h3>
              <div className="flex flex-col space-y-1">
                {result.suggested_precedents.map((precedent: string, index: number) => (
                  <div key={index} className="text-sm flex items-center">
                    <Check className="w-4 h-4 text-justice-light mr-2" />
                    {precedent}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "predict":
        return (
          <div className="space-y-4">
            <div className="bg-justice-dark/50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-2">Outcome Prediction:</h3>
              <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-justice-primary" 
                  style={{ width: `${result.outcome_prediction.favorable_to_plaintiff * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <div>{(result.outcome_prediction.favorable_to_plaintiff * 100).toFixed(0)}% Plaintiff</div>
                <div>{(result.outcome_prediction.favorable_to_defendant * 100).toFixed(0)}% Defendant</div>
              </div>
            </div>

            <div className="bg-justice-dark/50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-2">Key Factors:</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.key_factors.map((factor: string, index: number) => (
                  <li key={index} className="text-sm">{factor}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-justice-dark/50 p-3 rounded-md">
                <h3 className="text-sm font-medium mb-2">Recommended Approach:</h3>
                <p className="text-sm">{result.recommended_approach}</p>
              </div>
              <div className="bg-justice-dark/50 p-3 rounded-md">
                <h3 className="text-sm font-medium mb-2">Timeline & Settlement:</h3>
                <div className="text-sm">
                  <p>Timeline: {result.timeline_estimate}</p>
                  <p>Settlement Range: {result.settlement_range}</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      <div className="flex-1 p-4 md:p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="Case Analysis System" 
          text="Classify, Summarize and Predict Legal Case Outcomes"
          systemHealth={systemHealth}
        />

        <div className="mt-6">
          <Tabs defaultValue="classify" onValueChange={setAnalysisType}>
            <TabsList className="bg-justice-dark/50 w-full">
              <TabsTrigger value="classify" className="flex items-center">
                <Gavel className="w-4 h-4 mr-2" />
                Classify
              </TabsTrigger>
              <TabsTrigger value="summarize" className="flex items-center">
                <BookText className="w-4 h-4 mr-2" />
                Summarize
              </TabsTrigger>
              <TabsTrigger value="predict" className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Predict
              </TabsTrigger>
            </TabsList>

            {/* Common input form for all tabs */}
            <Card className="mt-4 border-justice-tertiary bg-transparent">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle>Case Input</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <label htmlFor="caseTitle" className="block text-sm font-medium mb-1">Case Title</label>
                  <Input 
                    id="caseTitle"
                    value={caseTitle}
                    onChange={(e) => setCaseTitle(e.target.value)}
                    placeholder="Enter case title..."
                    className="bg-justice-dark/50 border-justice-tertiary/30"
                  />
                </div>
                <div>
                  <label htmlFor="caseText" className="block text-sm font-medium mb-1">Case Text</label>
                  <Textarea 
                    id="caseText"
                    value={caseText}
                    onChange={(e) => setCaseText(e.target.value)}
                    placeholder="Enter case details here..."
                    className="min-h-[200px] bg-justice-dark/50 border-justice-tertiary/30"
                  />
                </div>
                <div className="flex justify-between">
                  <Select defaultValue="standard">
                    <SelectTrigger className="w-[180px] bg-justice-dark/50 border-justice-tertiary/30">
                      <SelectValue placeholder="Analysis Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Analysis</SelectItem>
                      <SelectItem value="judicial">Judicial Mode</SelectItem>
                      <SelectItem value="detailed">Detailed Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={loading || !caseText}
                    className="bg-justice-primary hover:bg-justice-secondary"
                  >
                    {loading ? "Analyzing..." : "Analyze Case"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results section */}
            {result && (
              <Card className="mt-4 border-justice-tertiary bg-transparent">
                <CardHeader className="border-b border-justice-dark">
                  <CardTitle>{
                    analysisType === "classify" ? "Classification Results" : 
                    analysisType === "summarize" ? "Case Summary" : 
                    "Outcome Prediction"
                  }</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {renderResult()}
                </CardContent>
              </Card>
            )}
          </Tabs>
        </div>

        {/* Judicial Recommendations Section */}
        <Card className="mt-6 border-justice-tertiary bg-transparent">
          <CardHeader className="border-b border-justice-dark">
            <CardTitle>Judicial Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-justice-dark/50 p-4 rounded-lg">
                <h3 className="font-semibold text-justice-primary mb-2">Legal Classification</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Our AI system categorizes cases using a taxonomy of over 200 legal domains, enabling precise routing and precedent matching.
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-justice-light mr-2" />
                    Auto-identifies case type and jurisdiction
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-justice-light mr-2" />
                    Matches to relevant legal codes
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-justice-light mr-2" />
                    Suggests relevant precedents
                  </li>
                </ul>
              </div>
              
              <div className="bg-justice-dark/50 p-4 rounded-lg">
                <h3 className="font-semibold text-justice-primary mb-2">Case Summarization</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Advanced NLP extracts key information from lengthy case documents, focusing on critical facts, arguments, and legal issues.
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-justice-light mr-2" />
                    Identifies key parties and relationships
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-justice-light mr-2" />
                    Extracts material dates and events
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-justice-light mr-2" />
                    Highlights central legal arguments
                  </li>
                </ul>
              </div>
              
              <div className="bg-justice-dark/50 p-4 rounded-lg">
                <h3 className="font-semibold text-justice-primary mb-2">Outcome Prediction</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Leveraging historical case data and machine learning to provide statistical likelihood of various case outcomes.
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-justice-light mr-2" />
                    Estimates probability of success
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-justice-light mr-2" />
                    Projects potential damages ranges
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-justice-light mr-2" />
                    Suggests optimal legal strategies
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 border border-justice-primary/30 bg-justice-primary/10 rounded-lg">
              <h3 className="text-lg font-semibold text-justice-light mb-2">Judicial Mode Recommendations</h3>
              <p className="text-sm mb-4">
                When operating in Judicial Mode, the system applies additional ethical and procedural safeguards:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-justice-primary mb-2">Procedural Guidelines</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-justice-light mr-2">•</span>
                      <span>Always maintain judicial neutrality by considering all perspectives equally</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-justice-light mr-2">•</span>
                      <span>Clearly distinguish between factual findings and interpretative conclusions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-justice-light mr-2">•</span>
                      <span>Ensure all decisions are explainable and follow clear logical reasoning</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-justice-primary mb-2">Ethical Boundaries</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-justice-light mr-2">•</span>
                      <span>Present multiple interpretations of ambiguous legal concepts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-justice-light mr-2">•</span>
                      <span>Disclose confidence levels and limitations of all predictions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-justice-light mr-2">•</span>
                      <span>Prioritize human oversight for final decision-making</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaseClassification;
