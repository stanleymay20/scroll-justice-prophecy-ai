
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scrollMemories, systemHealth } from "@/services/mockData";
import { Gavel, BookText, Check, BarChart2 } from "lucide-react";
import { FileUploadZone } from "@/components/uploads/FileUploadZone";

const CaseClassification = () => {
  const [caseText, setCaseText] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [analysisType, setAnalysisType] = useState("classify");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("input"); // "input" or "files"

  const currentPhase = scrollMemories[0]?.scroll_phase || "DAWN";
  const currentGate = scrollMemories[0]?.gate || 3;

  const mockClassification = {
    primary_category: "Contract Dispute",
    subcategory: "Employment Contract",
    jurisdiction: "Federal",
    confidence: 92,
    relevant_laws: [
      "Employment Standards Act",
      "Labor Relations Act",
      "Equal Opportunity Employment Act"
    ],
    similar_cases: [
      {
        case_id: "USSC-2022-104",
        title: "Emerson v. TechCorp Inc.",
        similarity: 89
      },
      {
        case_id: "CA-APP-2021-768",
        title: "Johnson & Associates v. Smith",
        similarity: 76
      }
    ]
  };

  const mockSummary = {
    parties: {
      plaintiff: "Jane Doe",
      defendant: "ABC Corporation"
    },
    key_facts: [
      "Employment terminated after 8 years",
      "Verbal promise of severance not honored",
      "Employee handbook specifies 2 weeks per year of service"
    ],
    legal_issues: [
      "Breach of implied contract",
      "Violation of labor standards"
    ],
    key_evidence: [
      "Employee handbook (Section 4.2)",
      "Email from manager dated March 15, 2022",
      "Witness testimony from HR director"
    ],
    conclusion: "This case involves claims of wrongful termination and breach of contract related to severance pay obligations."
  };

  const mockPrediction = {
    outcome_probability: {
      plaintiff_win: 68,
      defendant_win: 32
    },
    estimated_timeline: "8-12 months",
    potential_settlement_range: "$80,000 - $120,000",
    critical_factors: [
      "Documentation of verbal promise",
      "Consistent application of severance policy",
      "Judge's historical rulings on similar cases"
    ],
    recommended_approach: "Focus on the documented employee handbook provisions while emphasizing the manager's email that suggests acknowledgment of the verbal severance agreement."
  };

  const handleAnalyze = () => {
    if (!caseTitle || !caseText) {
      return;
    }
    
    setLoading(true);
    
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
    }, 2000);
  };
  
  const handleFileUpload = (files: File[]) => {
    // In a real app, we would process the files here
    // For now, we'll just simulate by setting some sample text
    setCaseTitle(files[0]?.name?.split('.')[0] || "Uploaded Case");
    setCaseText(`Sample text extracted from ${files.length} file(s):\n\nThis employment contract dispute involves allegations of wrongful termination and breach of contract related to severance pay. The plaintiff, Jane Doe, was employed for 8 years at ABC Corporation before termination. She claims a verbal promise of severance pay was not honored despite documentation in the employee handbook specifying 2 weeks per year of service.`);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar currentPhase={currentPhase} currentGate={currentGate} />

      <div className="flex-1 p-4 md:p-8 bg-gradient-to-b from-justice-dark to-black min-h-screen">
        <PageHeader 
          heading="Legal Case Analysis" 
          text="Classify, summarize and predict case outcomes with scroll-enhanced AI"
          systemHealth={systemHealth}
        />

        <div className="mt-6">
          <Tabs defaultValue="classify" onValueChange={setAnalysisType} className="w-full">
            <TabsList className="bg-justice-dark/50 w-full overflow-x-auto">
              <TabsTrigger value="classify" className="flex items-center">
                <Gavel className="w-4 h-4 mr-2" />
                Classify
              </TabsTrigger>
              <TabsTrigger value="summarize" className="flex items-center">
                <BookText className="w-4 h-4 mr-2" />
                Summarize
              </TabsTrigger>
              <TabsTrigger value="predict" className="flex items-center">
                <BarChart2 className="w-4 h-4 mr-2" />
                Predict
              </TabsTrigger>
            </TabsList>

            <Card className="mt-4 border-justice-tertiary bg-transparent">
              <CardHeader className="border-b border-justice-dark">
                <CardTitle>Case Input</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="input" onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="input">Manual Input</TabsTrigger>
                    <TabsTrigger value="files">Upload Files</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="input">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="case-title" className="block text-sm font-medium mb-1">
                          Case Title or Reference
                        </label>
                        <Input 
                          id="case-title"
                          value={caseTitle}
                          onChange={(e) => setCaseTitle(e.target.value)}
                          placeholder="e.g., Smith v. Johnson"
                          className="bg-justice-dark/50 border-justice-tertiary/30"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="case-text" className="block text-sm font-medium mb-1">
                          Case Text
                        </label>
                        <Textarea 
                          id="case-text"
                          value={caseText}
                          onChange={(e) => setCaseText(e.target.value)}
                          placeholder="Paste or enter the case text here..."
                          rows={10} 
                          className="bg-justice-dark/50 border-justice-tertiary/30 resize-none font-mono text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="files">
                    <FileUploadZone
                      onFilesUploaded={handleFileUpload}
                      allowedTypes={[".pdf", ".docx", ".txt", ".rtf", ".json"]}
                      className="py-4"
                    />
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={loading || !caseTitle || !caseText}
                    className="bg-justice-primary hover:bg-justice-secondary"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      <span>Analyze Case</span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {result && (
              <Card className="mt-4 border-justice-tertiary bg-transparent">
                <CardHeader className="border-b border-justice-dark">
                  <CardTitle>
                    {analysisType === "classify" && "Classification Results"}
                    {analysisType === "summarize" && "Case Summary"}
                    {analysisType === "predict" && "Outcome Prediction"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResultDisplay result={result} type={analysisType} />
                </CardContent>
              </Card>
            )}
          </Tabs>
        </div>

        <Card className="mt-6 border-justice-tertiary bg-transparent">
          <CardHeader className="border-b border-justice-dark">
            <CardTitle>Judicial Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="bg-justice-tertiary/20 p-3 rounded-lg">
                <h4 className="font-medium text-justice-primary flex items-center">
                  <Gavel className="w-4 h-4 mr-2" />
                  Document Processing
                </h4>
                <p className="text-sm mt-1">
                  We recommend structured scanning and categorization of all case-related documents. The current Scroll phase indicates optimal conditions for evidence validation.
                </p>
              </div>
              
              <div className="bg-justice-tertiary/20 p-3 rounded-lg">
                <h4 className="font-medium text-justice-primary flex items-center">
                  <BookText className="w-4 h-4 mr-2" />
                  Precedent Alignment
                </h4>
                <p className="text-sm mt-1">
                  Gate {currentGate} alignment suggests cross-referencing with similar cases from 2018-2022 for maximum precedent relevance in the current judicial climate.
                </p>
              </div>
              
              <div className="bg-justice-tertiary/20 p-3 rounded-lg">
                <h4 className="font-medium text-justice-primary flex items-center">
                  <BarChart2 className="w-4 h-4 mr-2" />
                  Strategy Optimization
                </h4>
                <p className="text-sm mt-1">
                  Based on {currentPhase} phase metrics, consider emphasizing procedural compliance aspects in employment cases for optimal reception in the current judicial interpretation environment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper component to display different types of results
const ResultDisplay = ({ result, type }: { result: any, type: string }) => {
  if (!result) return null;
  
  switch (type) {
    case "classify":
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-justice-tertiary/20 p-4 rounded-lg">
              <h3 className="text-sm text-muted-foreground">Primary Category</h3>
              <p className="text-xl font-semibold">{result.primary_category}</p>
            </div>
            <div className="bg-justice-tertiary/20 p-4 rounded-lg">
              <h3 className="text-sm text-muted-foreground">Subcategory</h3>
              <p className="text-xl font-semibold">{result.subcategory}</p>
            </div>
            <div className="bg-justice-tertiary/20 p-4 rounded-lg">
              <h3 className="text-sm text-muted-foreground">Confidence</h3>
              <p className="text-xl font-semibold">{result.confidence}%</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Relevant Laws</h3>
            <ul className="list-disc list-inside space-y-1">
              {result.relevant_laws.map((law: string, i: number) => (
                <li key={i} className="text-justice-light">{law}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Similar Cases</h3>
            <div className="space-y-2">
              {result.similar_cases.map((c: any, i: number) => (
                <div key={i} className="bg-justice-dark/50 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{c.title}</h4>
                    <p className="text-sm text-muted-foreground">{c.case_id}</p>
                  </div>
                  <div className="bg-justice-primary/20 px-2 py-1 rounded text-sm">
                    {c.similarity}% similar
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
      
    case "summarize":
      return (
        <div className="space-y-6">
          <div className="bg-justice-tertiary/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Parties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <h4 className="text-sm text-muted-foreground">Plaintiff</h4>
                <p className="font-medium">{result.parties.plaintiff}</p>
              </div>
              <div>
                <h4 className="text-sm text-muted-foreground">Defendant</h4>
                <p className="font-medium">{result.parties.defendant}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Key Facts</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.key_facts.map((fact: string, i: number) => (
                  <li key={i} className="text-justice-light">{fact}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Legal Issues</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.legal_issues.map((issue: string, i: number) => (
                  <li key={i} className="text-justice-light">{issue}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Key Evidence</h3>
            <ul className="list-disc list-inside space-y-1">
              {result.key_evidence.map((evidence: string, i: number) => (
                <li key={i} className="text-justice-light">{evidence}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-justice-primary/10 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-1">Conclusion</h3>
            <p>{result.conclusion}</p>
          </div>
        </div>
      );
      
    case "predict":
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-justice-tertiary/20 p-4 rounded-lg col-span-2">
              <h3 className="text-sm text-muted-foreground mb-2">Outcome Probability</h3>
              <div className="flex items-center space-x-3">
                <div className="h-4 flex-1 bg-black/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-justice-primary to-justice-light rounded-full"
                    style={{ width: `${result.outcome_probability.plaintiff_win}%` }}
                  ></div>
                </div>
                <span className="font-medium text-sm text-justice-light">
                  {result.outcome_probability.plaintiff_win}%
                </span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Plaintiff Win Likelihood</span>
                <span>Defendant Win Likelihood</span>
              </div>
            </div>
            
            <div className="bg-justice-tertiary/20 p-4 rounded-lg">
              <h3 className="text-sm text-muted-foreground">Timeline</h3>
              <p className="text-xl font-semibold">{result.estimated_timeline}</p>
            </div>
          </div>
          
          <div className="bg-justice-tertiary/20 p-4 rounded-lg">
            <h3 className="text-sm text-muted-foreground">Potential Settlement Range</h3>
            <p className="text-2xl font-semibold text-justice-light">{result.potential_settlement_range}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Critical Factors</h3>
            <ul className="space-y-1">
              {result.critical_factors.map((factor: string, i: number) => (
                <li key={i} className="flex items-start">
                  <Check className="text-justice-primary mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-justice-primary/10 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-1">Recommended Approach</h3>
            <p>{result.recommended_approach}</p>
          </div>
        </div>
      );
      
    default:
      return <div>No results to display</div>;
  }
};

export default CaseClassification;
