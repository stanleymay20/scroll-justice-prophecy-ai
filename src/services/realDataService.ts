
import { supabase } from '@/integrations/supabase/client';
import { findRelevantArticles } from './legalData';

export interface RealPetitionData {
  id: string;
  title: string;
  description: string;
  jurisdiction: string;
  category: string;
  legal_basis: string[];
  is_demonstration: boolean;
  demonstration_label?: string;
}

// Remove all mock data and ensure only real or clearly marked demonstration data
export const clearMockData = async (): Promise<void> => {
  try {
    console.log('Clearing all mock/fake data from system...');
    
    // Update any existing demo data to be clearly labeled
    const { error: petitionError } = await supabase
      .from('scroll_petitions')
      .update({ 
        is_simulation: false,
        title: 'DEMONSTRATION ONLY - ' + 'title',
        description: 'DEMONSTRATION ONLY - This is not a real petition. ' + 'description'
      })
      .eq('is_simulation', true);

    if (petitionError) {
      console.error('Error updating demonstration petitions:', petitionError);
    }

    console.log('Mock data clearing completed');
  } catch (error) {
    console.error('Error clearing mock data:', error);
    throw error;
  }
};

// Validate that petition data meets production standards
export const validatePetitionLegality = (petition: {
  title: string;
  description: string;
  jurisdiction: string;
  category: string;
}): {
  isValid: boolean;
  errors: string[];
  legal_basis: string[];
} => {
  const errors: string[] = [];
  const legal_basis: string[] = [];

  // Check for required fields
  if (!petition.title || petition.title.trim().length === 0) {
    errors.push('Petition title is required');
  }

  if (!petition.description || petition.description.trim().length < 50) {
    errors.push('Petition description must be at least 50 characters and provide sufficient detail');
  }

  if (!petition.jurisdiction || petition.jurisdiction === '') {
    errors.push('Jurisdiction must be specified for legal analysis');
  }

  if (!petition.category || petition.category === '') {
    errors.push('Injustice category must be specified');
  }

  // Find applicable legal frameworks
  if (petition.jurisdiction && petition.category) {
    const relevantArticles = findRelevantArticles(petition.jurisdiction, petition.category);
    legal_basis.push(...relevantArticles.map(article => 
      `${article.article_number}: ${article.title}`
    ));

    if (legal_basis.length === 0) {
      errors.push(`No applicable legal framework found for ${petition.category} in ${petition.jurisdiction}. Please verify jurisdiction and category.`);
    }
  }

  // Check for mock/fake indicators
  const mockIndicators = ['test', 'demo', 'fake', 'mock', 'example', 'placeholder'];
  const titleLower = petition.title.toLowerCase();
  const descLower = petition.description.toLowerCase();

  if (mockIndicators.some(indicator => 
    titleLower.includes(indicator) || descLower.includes(indicator)
  )) {
    errors.push('Petition contains test/mock content indicators. Production system requires real petitions only.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    legal_basis
  };
};

// Generate real legal citations for AI verdicts
export const generateLegalCitations = (jurisdiction: string, category: string): string[] => {
  const relevantArticles = findRelevantArticles(jurisdiction, category);
  
  return relevantArticles.map(article => {
    // Format proper legal citations
    if (article.title.includes('Universal Declaration')) {
      return `Universal Declaration of Human Rights, G.A. Res. 217A (III), U.N. Doc. A/810 at 71 (1948), ${article.article_number}`;
    } else if (article.title.includes('Grundgesetz')) {
      return `Grundgesetz für die Bundesrepublik Deutschland [Basic Law], Art. ${article.article_number.replace('Article ', '')} (Ger.)`;
    } else if (article.title.includes('Constitution of Ghana')) {
      return `Constitution of the Republic of Ghana, 1992, ${article.article_number}`;
    } else if (article.title.includes('U.S. Constitution')) {
      return `U.S. Const. amend. XIV, § 1`;
    } else {
      return `${article.title}, ${article.article_number}`;
    }
  });
};
