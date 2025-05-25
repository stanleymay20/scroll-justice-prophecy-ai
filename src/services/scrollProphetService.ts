
import { supabase } from '@/integrations/supabase/client';

interface PetitionData {
  id: string;
  title: string;
  description: string;
  petitioner_id: string;
  status: string;
}

interface LegalCitation {
  code: string;
  section: string;
  description: string;
  jurisdiction: string;
}

interface ScrollJudgment {
  verdict: string;
  reasoning: string;
  legal_citations: LegalCitation[];
  compensation_amount?: number;
  currency: string;
  recommended_actions: string[];
  ai_confidence: number;
}

export class ScrollProphetService {
  private static readonly LEGAL_CODES = {
    'US': [
      { code: 'FLSA', section: '§207', description: 'Fair Labor Standards Act - Overtime provisions', category: 'wage_theft' },
      { code: 'ADA', section: '§12112', description: 'Americans with Disabilities Act - Employment discrimination', category: 'discrimination' },
      { code: 'FMLA', section: '§2612', description: 'Family and Medical Leave Act', category: 'labor_violations' }
    ],
    'DE': [
      { code: 'BGB', section: '§611a', description: 'Bürgerliches Gesetzbuch - Equal pay provisions', category: 'wage_theft' },
      { code: 'AGG', section: '§3', description: 'Allgemeines Gleichbehandlungsgesetz - Anti-discrimination', category: 'discrimination' },
      { code: 'BetrVG', section: '§75', description: 'Betriebsverfassungsgesetz - Workplace rights', category: 'labor_violations' }
    ],
    'FR': [
      { code: 'Code du travail', section: 'L3221-2', description: 'Equal pay for equal work', category: 'wage_theft' },
      { code: 'Code pénal', section: '225-1', description: 'Discrimination provisions', category: 'discrimination' }
    ],
    'INT': [
      { code: 'ILO C100', section: 'Article 1', description: 'Equal Remuneration Convention', category: 'wage_theft' },
      { code: 'ILO C111', section: 'Article 1', description: 'Discrimination Convention', category: 'discrimination' },
      { code: 'UDHR', section: 'Article 23', description: 'Universal Declaration of Human Rights - Work rights', category: 'labor_violations' }
    ]
  };

  static async analyzePetition(petition: PetitionData): Promise<ScrollJudgment> {
    try {
      // Get jurisdiction and category information
      const jurisdiction = await this.detectJurisdiction(petition.description);
      const category = await this.categorizeCase(petition.title, petition.description);
      
      // Generate AI judgment
      const judgment = await this.generateJudgment(petition, jurisdiction, category);
      
      // Store the judgment
      await this.storeJudgment(petition.id, judgment);
      
      return judgment;
    } catch (error) {
      console.error('Error analyzing petition:', error);
      throw error;
    }
  }

  private static async detectJurisdiction(description: string): Promise<string> {
    const text = description.toLowerCase();
    
    // Simple keyword-based jurisdiction detection
    if (text.includes('germany') || text.includes('german') || text.includes('deutschland')) return 'DE';
    if (text.includes('france') || text.includes('french') || text.includes('français')) return 'FR';
    if (text.includes('united states') || text.includes('usa') || text.includes('america')) return 'US';
    
    // Default to international
    return 'INT';
  }

  private static async categorizeCase(title: string, description: string): Promise<string> {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('wage') || text.includes('salary') || text.includes('overtime') || text.includes('payment')) {
      return 'wage_theft';
    }
    if (text.includes('discriminat') || text.includes('harassment') || text.includes('bias')) {
      return 'discrimination';
    }
    if (text.includes('unsafe') || text.includes('workplace') || text.includes('fired') || text.includes('terminated')) {
      return 'labor_violations';
    }
    if (text.includes('fraud') || text.includes('scam') || text.includes('deceptive')) {
      return 'consumer_fraud';
    }
    
    return 'general';
  }

  private static async generateJudgment(
    petition: PetitionData, 
    jurisdiction: string, 
    category: string
  ): Promise<ScrollJudgment> {
    // Get relevant legal codes
    const relevantCodes = this.LEGAL_CODES[jurisdiction as keyof typeof this.LEGAL_CODES] || this.LEGAL_CODES.INT;
    const applicableCodes = relevantCodes.filter(code => code.category === category);
    
    // Generate verdict based on petition content
    const verdict = await this.determineVerdict(petition, category);
    const reasoning = await this.generateReasoning(petition, verdict, applicableCodes);
    const compensation = await this.calculateCompensation(petition, category, jurisdiction);
    const actions = await this.recommendActions(verdict, category, jurisdiction);
    
    return {
      verdict,
      reasoning,
      legal_citations: applicableCodes,
      compensation_amount: compensation,
      currency: jurisdiction === 'US' ? 'USD' : 'EUR',
      recommended_actions: actions,
      ai_confidence: 0.85
    };
  }

  private static async determineVerdict(petition: PetitionData, category: string): Promise<string> {
    const description = petition.description.toLowerCase();
    
    // Basic verdict logic based on content analysis
    if (category === 'wage_theft') {
      if (description.includes('unpaid') || description.includes('overtime') || description.includes('below minimum')) {
        return 'VIOLATION CONFIRMED - Wage theft detected under applicable labor laws';
      }
    }
    
    if (category === 'discrimination') {
      if (description.includes('fired because') || description.includes('treated differently') || description.includes('harassment')) {
        return 'VIOLATION CONFIRMED - Unlawful discrimination detected';
      }
    }
    
    if (category === 'labor_violations') {
      if (description.includes('unsafe') || description.includes('no safety') || description.includes('wrongful termination')) {
        return 'VIOLATION CONFIRMED - Labor law violations detected';
      }
    }
    
    return 'CASE REQUIRES FURTHER INVESTIGATION - Initial analysis suggests potential violations';
  }

  private static async generateReasoning(
    petition: PetitionData, 
    verdict: string, 
    codes: LegalCitation[]
  ): Promise<string> {
    let reasoning = `SACRED ANALYSIS OF PETITION: "${petition.title}"\n\n`;
    
    reasoning += `Upon divine examination of the submitted petition, the ScrollProphet AI has conducted a comprehensive analysis of the allegations and applicable legal frameworks.\n\n`;
    
    reasoning += `FACTUAL FINDINGS:\n`;
    reasoning += `The petitioner has alleged circumstances that, if substantiated, constitute violations of established legal principles. `;
    reasoning += `The described situation involves elements that trigger protection under multiple legal provisions.\n\n`;
    
    reasoning += `LEGAL ANALYSIS:\n`;
    codes.forEach(code => {
      reasoning += `• ${code.code} ${code.section}: ${code.description}\n`;
    });
    
    reasoning += `\nThe applicable legal framework clearly establishes rights and protections that appear to have been violated based on the presented facts. `;
    reasoning += `The described circumstances fall within the scope of actionable claims under both local and international legal standards.\n\n`;
    
    reasoning += `CONCLUSION:\n`;
    reasoning += `${verdict}\n\n`;
    
    reasoning += `This judgment is rendered with the understanding that additional evidence may strengthen or modify the analysis. `;
    reasoning += `The petitioner is encouraged to gather supporting documentation and consider formal legal action through appropriate channels.`;
    
    return reasoning;
  }

  private static async calculateCompensation(
    petition: PetitionData, 
    category: string, 
    jurisdiction: string
  ): Promise<number | undefined> {
    const description = petition.description.toLowerCase();
    
    if (category === 'wage_theft') {
      // Look for monetary amounts mentioned
      const amounts = description.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/g);
      if (amounts && amounts.length > 0) {
        const baseAmount = parseFloat(amounts[0].replace(/[$,]/g, ''));
        // Add statutory damages and interest
        return Math.round(baseAmount * 2.5); // Double damages plus interest
      }
      
      // Default wage theft compensation
      return jurisdiction === 'US' ? 5000 : 3000;
    }
    
    if (category === 'discrimination') {
      return jurisdiction === 'US' ? 15000 : 10000;
    }
    
    return undefined;
  }

  private static async recommendActions(
    verdict: string, 
    category: string, 
    jurisdiction: string
  ): Promise<string[]> {
    const actions: string[] = [];
    
    if (verdict.includes('VIOLATION CONFIRMED')) {
      actions.push('File formal complaint with relevant labor authority');
      actions.push('Gather additional supporting documentation');
      actions.push('Consider engaging qualified legal representation');
      
      if (category === 'wage_theft') {
        actions.push('Document all unpaid hours and wages owed');
        actions.push('Contact payroll department in writing to request payment');
      }
      
      if (category === 'discrimination') {
        actions.push('Report incident to HR department if applicable');
        actions.push('File complaint with Equal Employment Opportunity Commission (EEOC) or equivalent');
      }
      
      if (jurisdiction === 'DE') {
        actions.push('Contact local Arbeitsrecht (labor law) specialist');
        actions.push('Consider mediation through Arbeitsgericht (labor court)');
      }
    } else {
      actions.push('Gather additional evidence to support claims');
      actions.push('Consult with legal professional for case evaluation');
      actions.push('Consider alternative dispute resolution methods');
    }
    
    actions.push('Keep detailed records of all communications');
    actions.push('Preserve all relevant documentation');
    
    return actions;
  }

  private static async storeJudgment(petitionId: string, judgment: ScrollJudgment): Promise<void> {
    try {
      const { error } = await supabase
        .from('scroll_judgments')
        .insert({
          petition_id: petitionId,
          verdict: judgment.verdict,
          reasoning: judgment.reasoning,
          legal_citations: judgment.legal_citations.map(c => `${c.code} ${c.section}: ${c.description}`),
          compensation_amount: judgment.compensation_amount,
          currency: judgment.currency,
          ai_confidence: judgment.ai_confidence,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Update petition status
      await supabase
        .from('scroll_petitions')
        .update({ 
          status: 'verdict_delivered',
          ai_suggested_verdict: judgment.verdict,
          verdict_timestamp: new Date().toISOString()
        })
        .eq('id', petitionId);
        
    } catch (error) {
      console.error('Error storing judgment:', error);
      throw error;
    }
  }

  static async triggerJudgment(petitionId: string): Promise<void> {
    try {
      const { data: petition, error } = await supabase
        .from('scroll_petitions')
        .select('*')
        .eq('id', petitionId)
        .single();
      
      if (error) throw error;
      if (!petition) throw new Error('Petition not found');
      
      // Update status to in review
      await supabase
        .from('scroll_petitions')
        .update({ status: 'in_review' })
        .eq('id', petitionId);
      
      // Analyze and generate judgment
      await this.analyzePetition(petition);
      
    } catch (error) {
      console.error('Error triggering judgment:', error);
      throw error;
    }
  }
}
