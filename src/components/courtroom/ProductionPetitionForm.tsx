
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { JurisdictionSelector } from '@/components/legal/JurisdictionSelector';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { createProductionPetition } from '@/services/updatedPetitionService';
import { toast } from '@/hooks/use-toast';
import { Loader2, Scale, AlertTriangle } from 'lucide-react';
import type { InjusticeCategory } from '@/types';

interface ProductionPetitionFormProps {
  onPetitionCreated: (petition: any) => void;
  onCancel: () => void;
}

const REAL_INJUSTICE_CATEGORIES: Array<{code: InjusticeCategory, name: string, description: string}> = [
  { code: 'employment', name: 'Employment Rights', description: 'Workplace discrimination, wrongful termination, wage theft' },
  { code: 'housing', name: 'Housing Rights', description: 'Housing discrimination, unlawful eviction, unsafe conditions' },
  { code: 'healthcare', name: 'Healthcare Access', description: 'Medical discrimination, denied treatment, healthcare fraud' },
  { code: 'education', name: 'Education Rights', description: 'Educational discrimination, access barriers, institutional bias' },
  { code: 'financial', name: 'Financial Justice', description: 'Banking discrimination, predatory lending, financial fraud' },
  { code: 'discrimination', name: 'Civil Rights', description: 'Racial, gender, religious, or other protected class discrimination' },
  { code: 'government', name: 'Government Accountability', description: 'Government misconduct, administrative injustice, civil liberties' },
  { code: 'consumer', name: 'Consumer Protection', description: 'Fraud, unfair business practices, product liability' },
  { code: 'family', name: 'Family Law', description: 'Child custody, domestic relations, family court issues' },
  { code: 'criminal', name: 'Criminal Justice', description: 'Wrongful conviction, police misconduct, due process violations' }
];

export const ProductionPetitionForm: React.FC<ProductionPetitionFormProps> = ({
  onPetitionCreated,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jurisdiction: '',
    category: '' as InjusticeCategory | ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.title.trim()) {
      newErrors.push('Petition title is required');
    } else if (formData.title.length < 10) {
      newErrors.push('Petition title must be at least 10 characters');
    }

    if (!formData.description.trim()) {
      newErrors.push('Petition description is required');
    } else if (formData.description.length < 100) {
      newErrors.push('Petition description must be at least 100 characters for proper legal analysis');
    }

    if (!formData.jurisdiction) {
      newErrors.push('Jurisdiction selection is required for legal framework application');
    }

    if (!formData.category) {
      newErrors.push('Injustice category is required for legal classification');
    }

    // Check for mock/test content
    const mockWords = ['test', 'demo', 'fake', 'mock', 'example'];
    const content = (formData.title + ' ' + formData.description).toLowerCase();
    if (mockWords.some(word => content.includes(word))) {
      newErrors.push('Production system prohibits test/mock content. Please submit real petitions only.');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const petition = await createProductionPetition({
        title: formData.title,
        description: formData.description,
        jurisdiction: formData.jurisdiction,
        category: formData.category as InjusticeCategory
      });

      toast({
        title: "Sacred Petition Filed",
        description: "Your petition has been recorded in the scrolls and assigned for legal analysis.",
      });

      onPetitionCreated(petition);
    } catch (error: any) {
      console.error('Error creating petition:', error);
      toast({
        variant: "destructive",
        title: "Petition Filing Failed",
        description: error.message || "Failed to record petition in the sacred scrolls.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <LegalDisclaimer />
      
      <GlassCard className="p-6">
        <div className="flex items-center mb-4">
          <Scale className="h-6 w-6 text-justice-primary mr-2" />
          <h3 className="text-xl font-semibold text-white">File Sacred Petition for Justice</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-justice-light mb-2">
              Petition Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter the specific injustice you seek to address"
              className="bg-black/30 border-justice-primary/30 text-white"
            />
          </div>

          <JurisdictionSelector
            selectedJurisdiction={formData.jurisdiction}
            onJurisdictionChange={(jurisdiction) => 
              setFormData(prev => ({ ...prev, jurisdiction }))
            }
          />

          <div>
            <label className="block text-sm font-medium text-justice-light mb-2">
              Injustice Category *
            </label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as InjusticeCategory }))}>
              <SelectTrigger className="bg-black/30 border-justice-primary/30 text-white">
                <SelectValue placeholder="Select the category of injustice" />
              </SelectTrigger>
              <SelectContent>
                {REAL_INJUSTICE_CATEGORIES.map((category) => (
                  <SelectItem key={category.code} value={category.code}>
                    <div className="flex flex-col">
                      <span>{category.name}</span>
                      <span className="text-xs text-gray-400">{category.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-justice-light mb-2">
              Detailed Description of Injustice *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide a detailed account of the injustice experienced. Include dates, locations, parties involved, and specific harms suffered. This information will be analyzed against applicable legal frameworks."
              rows={8}
              className="bg-black/30 border-justice-primary/30 text-white"
            />
            <p className="text-xs text-justice-light/60 mt-1">
              Minimum 100 characters required for proper legal analysis. Current: {formData.description.length}
            </p>
          </div>

          {errors.length > 0 && (
            <div className="bg-destructive/20 border border-destructive/50 rounded p-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive mr-2" />
                <span className="text-destructive font-medium">Validation Errors:</span>
              </div>
              <ul className="text-sm text-destructive space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-justice-primary hover:bg-justice-tertiary"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              File Sacred Petition
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
