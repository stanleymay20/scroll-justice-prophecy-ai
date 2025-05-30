
// Production integrity service - no mock data, real legal validation only
import { supabase } from '@/integrations/supabase/client';
import { validatePetitionLegality } from './realDataService';

export interface IntegrityViolation {
  type: 'MOCK_DATA_DETECTED' | 'INSUFFICIENT_LEGAL_BASIS' | 'JURISDICTION_UNCLEAR' | 'SELF_VERDICT_ATTEMPT';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  auto_resolve: boolean;
}

export const validateProductionIntegrity = async (petition: {
  title: string;
  description: string;
  jurisdiction: string;
  category: string;
  petitioner_id: string;
}): Promise<{
  passed: boolean;
  violations: IntegrityViolation[];
  integrity_score: number;
}> => {
  const violations: IntegrityViolation[] = [];
  
  // Check for mock/fake data
  const mockWords = ['test', 'demo', 'fake', 'mock', 'example', 'placeholder', 'lorem', 'ipsum'];
  const titleLower = petition.title.toLowerCase();
  const descLower = petition.description.toLowerCase();
  
  if (mockWords.some(word => titleLower.includes(word) || descLower.includes(word))) {
    violations.push({
      type: 'MOCK_DATA_DETECTED',
      severity: 'HIGH',
      description: 'Petition contains mock/test data. Production system requires real petitions only.',
      auto_resolve: false
    });
  }

  // Validate legal basis
  const legalValidation = validatePetitionLegality(petition);
  if (!legalValidation.isValid) {
    violations.push({
      type: 'INSUFFICIENT_LEGAL_BASIS',
      severity: 'HIGH',
      description: `Legal validation failed: ${legalValidation.errors.join(', ')}`,
      auto_resolve: false
    });
  }

  // Check jurisdiction clarity
  if (!petition.jurisdiction || petition.jurisdiction === 'unknown' || petition.jurisdiction.length !== 2) {
    violations.push({
      type: 'JURISDICTION_UNCLEAR',
      severity: 'HIGH',
      description: 'Jurisdiction must be clearly specified for legal analysis',
      auto_resolve: false
    });
  }

  // Calculate integrity score
  const baseScore = 100;
  const deductions = violations.reduce((total, violation) => {
    return total + (violation.severity === 'HIGH' ? 30 : violation.severity === 'MEDIUM' ? 15 : 5);
  }, 0);
  
  const integrity_score = Math.max(0, baseScore - deductions);

  return {
    passed: violations.length === 0,
    violations,
    integrity_score
  };
};

export const logProductionAction = async (
  action: string,
  details: any,
  userId?: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('scroll_integrity_logs')
      .insert({
        user_id: userId || null,
        action_type: action,
        description: `Production action: ${action}`,
        integrity_impact: 5,
        petition_id: details.petition_id || null
      });

    if (error) {
      console.error('Error logging production action:', error);
    }
  } catch (error) {
    console.error('Failed to log production action:', error);
  }
};
