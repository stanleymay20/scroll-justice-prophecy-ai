
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TrainingParameters, Jurisdiction, LegalFrameworkFocus } from '@/types';

interface EnhancedTrainingFormProps {
  onSubmit: (params: TrainingParameters) => void;
  loading?: boolean;
  availableJurisdictions?: Jurisdiction[];
  onStartTraining?: (params: TrainingParameters) => void;
}

const defaultLegalFrameworks: LegalFrameworkFocus[] = [
  { id: '1', name: 'Human Rights', weight: 100, enabled: true, description: 'Universal human rights principles' },
  { id: '2', name: 'Constitutional Law', weight: 90, enabled: true, description: 'Constitutional principles and rights' },
  { id: '3', name: 'Civil Rights', weight: 85, enabled: true, description: 'Civil liberties and protections' },
  { id: '4', name: 'International Law', weight: 80, enabled: false, description: 'International legal standards' },
  { id: '5', name: 'Commercial Law', weight: 70, enabled: false, description: 'Business and commercial regulations' }
];

export const EnhancedTrainingForm: React.FC<EnhancedTrainingFormProps> = ({
  onSubmit,
  loading = false,
  availableJurisdictions = [],
  onStartTraining
}) => {
  const [formData, setFormData] = useState<TrainingParameters>({
    name: '',
    jurisdictions: [],
    legalFrameworks: defaultLegalFrameworks,
    accuracy_threshold: 85,
    bias_detection: true,
    multilingual: true,
    legal_framework_focus: defaultLegalFrameworks,
    case_count: 1000,
    language_weighting: {},
    epochs: 10,
    learning_rate: 0.001,
    human_rights_emphasis: true,
    balance_jurisdictions: true,
    include_scroll_alignment: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onStartTraining) {
      onStartTraining(formData);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enhanced AI Training Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Model Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter model name"
              required
            />
          </div>

          <div>
            <Label>Jurisdictions</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select jurisdictions" />
              </SelectTrigger>
              <SelectContent>
                {availableJurisdictions.map((jurisdiction) => (
                  <SelectItem key={jurisdiction.id} value={jurisdiction.code}>
                    {jurisdiction.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="accuracy">Accuracy Threshold (%)</Label>
            <Input
              id="accuracy"
              type="number"
              min="0"
              max="100"
              value={formData.accuracy_threshold}
              onChange={(e) => setFormData({ ...formData, accuracy_threshold: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Training Options</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bias-detection"
                checked={formData.bias_detection}
                onCheckedChange={(checked) => setFormData({ ...formData, bias_detection: checked as boolean })}
              />
              <Label htmlFor="bias-detection">Enable bias detection</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="multilingual"
                checked={formData.multilingual}
                onCheckedChange={(checked) => setFormData({ ...formData, multilingual: checked as boolean })}
              />
              <Label htmlFor="multilingual">Multilingual support</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="human-rights"
                checked={formData.human_rights_emphasis}
                onCheckedChange={(checked) => setFormData({ ...formData, human_rights_emphasis: checked as boolean })}
              />
              <Label htmlFor="human-rights">Human rights emphasis</Label>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Training...' : 'Start Training'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
