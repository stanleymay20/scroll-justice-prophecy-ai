import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { TrainingParameters, Jurisdiction, LegalFrameworkFocus } from '@/types';
import { Brain, Gavel, Globe, Settings, Shield, Zap } from 'lucide-react';

interface EnhancedTrainingFormProps {
  onSubmit: (params: TrainingParameters) => void;
  loading?: boolean;
}

const mockJurisdictions: Jurisdiction[] = [
  { id: '1', code: 'US', name: 'United States', country: 'United States', region: 'North America', legal_system: 'Common Law', supported: true },
  { id: '2', code: 'DE', name: 'Germany', country: 'Germany', region: 'Europe', legal_system: 'Civil Law', supported: true },
  { id: '3', code: 'FR', name: 'France', country: 'France', region: 'Europe', legal_system: 'Civil Law', supported: true },
  { id: '4', code: 'UK', name: 'United Kingdom', country: 'United Kingdom', region: 'Europe', legal_system: 'Common Law', supported: true },
  { id: '5', code: 'JP', name: 'Japan', country: 'Japan', region: 'Asia', legal_system: 'Civil Law', supported: true },
];

const mockFrameworks: LegalFrameworkFocus[] = [
  { id: '1', name: 'Constitutional Law', weight: 90, enabled: true, description: 'Constitutional principles and rights' },
  { id: '2', name: 'Human Rights', weight: 95, enabled: true, description: 'International human rights law' },
  { id: '3', name: 'Employment Law', weight: 80, enabled: true, description: 'Labor and employment regulations' },
  { id: '4', name: 'Contract Law', weight: 75, enabled: true, description: 'Commercial and contract law' },
  { id: '5', name: 'Criminal Law', weight: 85, enabled: true, description: 'Criminal justice and procedures' },
];

const initialParams: TrainingParameters = {
  name: 'ScrollJustice AI Model',
  jurisdictions: [],
  legalFrameworks: mockFrameworks,
  legal_framework_focus: mockFrameworks,
  accuracy_threshold: 85,
  bias_detection: true,
  multilingual: true,
  case_count: 10000,
  language_weighting: {
    'en': 40,
    'de': 20,
    'fr': 15,
    'es': 10,
    'ar': 10,
    'he': 5
  },
  epochs: 100,
  learning_rate: 0.001,
  human_rights_emphasis: true,
  balance_jurisdictions: true,
  include_scroll_alignment: true
};

export const EnhancedTrainingForm: React.FC<EnhancedTrainingFormProps> = ({ 
  onSubmit, 
  loading = false 
}) => {
  const [params, setParams] = useState<TrainingParameters>(initialParams);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(params);
  };

  const updateFramework = (id: string, updates: Partial<LegalFrameworkFocus>) => {
    setParams(prev => ({
      ...prev,
      legal_framework_focus: prev.legal_framework_focus.map(framework =>
        framework.id === id ? { ...framework, ...updates } : framework
      )
    }));
  };

  const regions = [...new Set(mockJurisdictions.map(j => j.region))];
  const getJurisdictionsByRegion = (region: string) => 
    mockJurisdictions.filter(j => j.region === region);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Model Configuration
          </CardTitle>
          <CardDescription>
            Configure the basic parameters for your AI legal model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="model-name">Model Name</Label>
            <Input
              id="model-name"
              value={params.name}
              onChange={(e) => setParams(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter model name"
            />
          </div>

          <div>
            <Label htmlFor="case-count">Training Case Count</Label>
            <Input
              id="case-count"
              type="number"
              value={params.case_count}
              onChange={(e) => setParams(prev => ({ ...prev, case_count: parseInt(e.target.value) }))}
              min="1000"
              max="100000"
            />
          </div>

          <div>
            <Label htmlFor="accuracy">Minimum Accuracy Threshold (%)</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[params.accuracy_threshold]}
                onValueChange={([value]) => setParams(prev => ({ ...prev, accuracy_threshold: value }))}
                max={100}
                min={50}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-sm">{params.accuracy_threshold}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="jurisdictions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jurisdictions">
            <Globe className="h-4 w-4 mr-2" />
            Jurisdictions
          </TabsTrigger>
          <TabsTrigger value="frameworks">
            <Gavel className="h-4 w-4 mr-2" />
            Legal Frameworks
          </TabsTrigger>
          <TabsTrigger value="languages">
            <Zap className="h-4 w-4 mr-2" />
            Languages
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Settings className="h-4 w-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jurisdictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Training Jurisdictions</CardTitle>
              <CardDescription>
                Choose which legal jurisdictions to include in the training dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              {regions.map(region => (
                <div key={region} className="mb-6">
                  <h4 className="font-medium mb-3">{region}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {getJurisdictionsByRegion(region).map(jurisdiction => (
                      <Label
                        key={jurisdiction.id}
                        className="flex items-center space-x-2 cursor-pointer p-2 border rounded hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={params.jurisdictions.includes(jurisdiction.code)}
                          onChange={(e) => {
                            const codes = e.target.checked
                              ? [...params.jurisdictions, jurisdiction.code]
                              : params.jurisdictions.filter(c => c !== jurisdiction.code);
                            setParams(prev => ({ ...prev, jurisdictions: codes }));
                          }}
                        />
                        <span>{jurisdiction.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {jurisdiction.legal_system}
                        </Badge>
                      </Label>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Legal Framework Emphasis</CardTitle>
              <CardDescription>
                Adjust the importance weighting for different areas of law
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {params.legal_framework_focus.map(framework => (
                  <div key={framework.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={framework.enabled}
                        onCheckedChange={(enabled) => updateFramework(framework.id, { enabled })}
                      />
                      <span className="font-medium">{framework.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Slider
                        value={[framework.weight]}
                        onValueChange={([weight]) => updateFramework(framework.id, { weight })}
                        max={100}
                        min={0}
                        step={5}
                        className="w-32"
                        disabled={!framework.enabled}
                      />
                      <span className="w-10 text-sm">{framework.weight}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Language Training Weights</CardTitle>
              <CardDescription>
                Set the percentage of training data for each language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(params.language_weighting).map(([lang, weight]) => (
                  <div key={lang} className="flex items-center justify-between">
                    <Label className="capitalize">{lang === 'en' ? 'English' : lang === 'de' ? 'German' : lang === 'fr' ? 'French' : lang === 'es' ? 'Spanish' : lang === 'ar' ? 'Arabic' : 'Hebrew'}</Label>
                    <div className="flex items-center space-x-3">
                      <Slider
                        value={[weight]}
                        onValueChange={([newWeight]) => {
                          setParams(prev => ({
                            ...prev,
                            language_weighting: {
                              ...prev.language_weighting,
                              [lang]: newWeight
                            }
                          }));
                        }}
                        max={50}
                        min={0}
                        step={5}
                        className="w-32"
                      />
                      <span className="w-10 text-sm">{weight}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Training Parameters</CardTitle>
              <CardDescription>
                Fine-tune the model training process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="epochs">Training Epochs</Label>
                <Input
                  id="epochs"
                  type="number"
                  value={params.epochs}
                  onChange={(e) => setParams(prev => ({ ...prev, epochs: parseInt(e.target.value) }))}
                  min="10"
                  max="1000"
                />
              </div>

              <div>
                <Label htmlFor="learning-rate">Learning Rate</Label>
                <Input
                  id="learning-rate"
                  type="number"
                  step="0.0001"
                  value={params.learning_rate}
                  onChange={(e) => setParams(prev => ({ ...prev, learning_rate: parseFloat(e.target.value) }))}
                  min="0.0001"
                  max="0.1"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Human Rights Emphasis</Label>
                  <Switch
                    checked={params.human_rights_emphasis}
                    onCheckedChange={(human_rights_emphasis) => 
                      setParams(prev => ({ ...prev, human_rights_emphasis }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Balance Jurisdictions</Label>
                  <Switch
                    checked={params.balance_jurisdictions}
                    onCheckedChange={(balance_jurisdictions) => setParams(prev => ({ ...prev, balance_jurisdictions }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Include Scroll Alignment</Label>
                  <Switch
                    checked={params.include_scroll_alignment}
                    onCheckedChange={(include_scroll_alignment) => setParams(prev => ({ ...prev, include_scroll_alignment }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Bias Detection</Label>
                  <Switch
                    checked={params.bias_detection}
                    onCheckedChange={(bias_detection) => setParams(prev => ({ ...prev, bias_detection }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Multilingual Support</Label>
                  <Switch
                    checked={params.multilingual}
                    onCheckedChange={(multilingual) => setParams(prev => ({ ...prev, multilingual }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save Draft
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Training...' : 'Start Training'}
        </Button>
      </div>
    </form>
  );
};
