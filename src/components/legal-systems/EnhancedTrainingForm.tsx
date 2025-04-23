
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Globe, Database, BookOpen, FileText, Languages } from "lucide-react";
import { TrainingParameters, LegalFrameworkFocus, Jurisdiction } from "@/types";

interface EnhancedTrainingFormProps {
  availableJurisdictions: Jurisdiction[];
  onStartTraining: (params: TrainingParameters) => void;
}

export function EnhancedTrainingForm({ availableJurisdictions, onStartTraining }: EnhancedTrainingFormProps) {
  const [trainingParams, setTrainingParams] = useState<TrainingParameters>({
    name: "Global Legal AI v1.0",
    jurisdictions: ["US", "UK", "CA", "UN", "ICC"],
    principles: ["Equal Protection", "Right to Privacy", "Human Rights", "Rule of Law"],
    case_count: 10000,
    epochs: 150,
    learning_rate: 0.001,
    balance_jurisdictions: true,
    include_scroll_alignment: true,
    include_international_law: true,
    un_charter_compliance: true,
    icc_rome_statute_compliance: true,
    human_rights_emphasis: 0.8,
    language_weighting: {
      "en": 1.0,
      "fr": 0.9,
      "es": 0.9,
      "ar": 0.8,
      "zh": 0.8,
      "ru": 0.8
    },
    legal_framework_focus: [
      { name: "UN Charter", weight: 0.9, description: "United Nations foundational principles" },
      { name: "UDHR", weight: 1.0, description: "Universal Declaration of Human Rights" },
      { name: "Rome Statute", weight: 0.85, description: "International Criminal Court foundation" },
      { name: "ICCPR", weight: 0.8, description: "International Covenant on Civil and Political Rights" },
      { name: "ICESCR", weight: 0.8, description: "International Covenant on Economic, Social and Cultural Rights" }
    ]
  });

  const handleJurisdictionToggle = (code: string) => {
    setTrainingParams(prev => {
      const newJurisdictions = prev.jurisdictions.includes(code)
        ? prev.jurisdictions.filter(j => j !== code)
        : [...prev.jurisdictions, code];
      
      return { ...prev, jurisdictions: newJurisdictions };
    });
  };

  const handleLegalFrameworkWeightChange = (name: string, weight: number) => {
    setTrainingParams(prev => {
      const updatedFrameworks = prev.legal_framework_focus?.map(framework => 
        framework.name === name ? { ...framework, weight } : framework
      ) || [];
      
      return { ...prev, legal_framework_focus: updatedFrameworks };
    });
  };

  const handleSubmit = () => {
    onStartTraining(trainingParams);
  };

  // Group jurisdictions by region for easier selection
  const jurisdictionsByRegion = availableJurisdictions.reduce((acc, jurisdiction) => {
    if (!acc[jurisdiction.region]) {
      acc[jurisdiction.region] = [];
    }
    acc[jurisdiction.region].push(jurisdiction);
    return acc;
  }, {} as Record<string, Jurisdiction[]>);

  return (
    <Card className="border-justice-tertiary bg-transparent">
      <CardHeader className="border-b border-justice-dark">
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          Global Legal AI Model Training
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                Model Name
              </label>
              <Input 
                placeholder="Enter model name..." 
                value={trainingParams.name || ""}
                className="bg-justice-dark/50 border-justice-tertiary text-white"
                onChange={(e) => setTrainingParams(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                <Globe className="inline-block mr-1 h-4 w-4" />
                Jurisdictions Coverage
              </label>
              <div className="max-h-44 overflow-y-auto p-2 bg-justice-dark/50 border border-justice-tertiary rounded-md">
                {Object.entries(jurisdictionsByRegion).map(([region, jurisdictions]) => (
                  <div key={region} className="mb-3">
                    <div className="text-xs uppercase text-muted-foreground mb-1">{region}</div>
                    <div className="flex flex-wrap gap-2">
                      {jurisdictions.map(jurisdiction => (
                        <Badge 
                          key={jurisdiction.id}
                          variant={trainingParams.jurisdictions.includes(jurisdiction.code) ? "default" : "outline"}
                          className={`cursor-pointer ${trainingParams.jurisdictions.includes(jurisdiction.code) ? 'bg-justice-primary' : ''}`}
                          onClick={() => handleJurisdictionToggle(jurisdiction.code)}
                        >
                          {jurisdiction.code} - {jurisdiction.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-2 text-xs text-muted-foreground">
                  {trainingParams.jurisdictions.length} jurisdictions selected
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                <Database className="inline-block mr-1 h-4 w-4" />
                Training Dataset Size
              </label>
              <Select 
                value={trainingParams.case_count.toString()} 
                onValueChange={(val) => setTrainingParams({...trainingParams, case_count: parseInt(val)})}
              >
                <SelectTrigger className="bg-justice-dark/50 border-justice-tertiary">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5000">Small (5,000 cases)</SelectItem>
                  <SelectItem value="10000">Medium (10,000 cases)</SelectItem>
                  <SelectItem value="25000">Large (25,000 cases)</SelectItem>
                  <SelectItem value="50000">Comprehensive (50,000 cases)</SelectItem>
                  <SelectItem value="100000">Global Coverage (100,000 cases)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                <Languages className="inline-block mr-1 h-4 w-4" />
                Language Support Priority
              </label>
              <div className="space-y-2 bg-justice-dark/50 p-2 rounded-md">
                {Object.entries(trainingParams.language_weighting || {}).map(([lang, weight]) => (
                  <div key={lang} className="flex items-center justify-between">
                    <span className="text-sm">{getLanguageName(lang)}</span>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[weight * 100]}
                        min={0}
                        max={100}
                        step={5}
                        className="w-24"
                        onValueChange={(val) => setTrainingParams({
                          ...trainingParams, 
                          language_weighting: {
                            ...(trainingParams.language_weighting || {}),
                            [lang]: val[0] / 100
                          }
                        })}
                      />
                      <span className="w-8 text-xs">{(weight * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                <BookOpen className="inline-block mr-1 h-4 w-4" />
                International Legal Frameworks
              </label>
              <div className="max-h-44 overflow-y-auto p-2 bg-justice-dark/50 border border-justice-tertiary rounded-md">
                {trainingParams.legal_framework_focus?.map((framework) => (
                  <div key={framework.name} className="mb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm">{framework.name}</div>
                        <div className="text-xs text-muted-foreground">{framework.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[framework.weight * 100]}
                          min={0}
                          max={100}
                          step={5}
                          className="w-24"
                          onValueChange={(val) => handleLegalFrameworkWeightChange(
                            framework.name, 
                            val[0] / 100
                          )}
                        />
                        <span className="w-8 text-xs">{(framework.weight * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Training Epochs
                </label>
                <Input 
                  type="number"
                  value={trainingParams.epochs}
                  min="50"
                  max="500"
                  className="bg-justice-dark/50 border-justice-tertiary text-white"
                  onChange={(e) => setTrainingParams({...trainingParams, epochs: parseInt(e.target.value)})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Learning Rate
                </label>
                <Input 
                  type="number"
                  value={trainingParams.learning_rate}
                  step="0.0001"
                  min="0.0001"
                  max="0.01"
                  className="bg-justice-dark/50 border-justice-tertiary text-white"
                  onChange={(e) => setTrainingParams({...trainingParams, learning_rate: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                Human Rights Emphasis
              </label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[trainingParams.human_rights_emphasis * 100]}
                  min={0}
                  max={100}
                  step={5}
                  className="flex-1"
                  onValueChange={(val) => setTrainingParams({
                    ...trainingParams, 
                    human_rights_emphasis: val[0] / 100
                  })}
                />
                <span className="w-12 text-sm">{(trainingParams.human_rights_emphasis * 100).toFixed(0)}%</span>
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  Balance Jurisdictions
                </label>
                <Switch 
                  checked={trainingParams.balance_jurisdictions}
                  onCheckedChange={(val) => setTrainingParams({...trainingParams, balance_jurisdictions: val})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  Include Scroll Alignment
                </label>
                <Switch 
                  checked={trainingParams.include_scroll_alignment}
                  onCheckedChange={(val) => setTrainingParams({...trainingParams, include_scroll_alignment: val})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  UN Charter Compliance
                </label>
                <Switch 
                  checked={trainingParams.un_charter_compliance}
                  onCheckedChange={(val) => setTrainingParams({...trainingParams, un_charter_compliance: val})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  ICC Rome Statute Compliance
                </label>
                <Switch 
                  checked={trainingParams.icc_rome_statute_compliance}
                  onCheckedChange={(val) => setTrainingParams({...trainingParams, icc_rome_statute_compliance: val})}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-justice-dark pt-4">
        <Button 
          className="w-full bg-justice-primary hover:bg-justice-secondary"
          onClick={handleSubmit}
        >
          <Brain className="mr-2 h-5 w-5" />
          Start Global Legal AI Training
        </Button>
      </CardFooter>
    </Card>
  );
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    "en": "English",
    "fr": "French",
    "es": "Spanish",
    "ar": "Arabic",
    "zh": "Chinese",
    "ru": "Russian",
    "de": "German",
    "pt": "Portuguese",
    "ja": "Japanese",
    "ko": "Korean",
    "it": "Italian",
    "nl": "Dutch"
  };
  
  return languages[code] || code;
}
