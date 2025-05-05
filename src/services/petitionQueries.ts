import { supabase } from '@/integrations/supabase/client';
import { ScrollPetition } from '@/types/petition';

// Interface matching Supabase's expected insert type
interface PetitionInsert {
  title: string;
  description: string;
  petitioner_id: string;
  status?: string;
  scroll_integrity_score?: number;
  is_sealed: boolean;
}

// Fetch all petitions
export async function fetchPetitions(isAdmin = false): Promise<ScrollPetition[]> {
  try {
    let query = supabase
      .from('scroll_petitions')
      .select('*')
      .order('created_at', { ascending: false });
    
    // If not admin, only show non-sealed petitions or ones belonging to the user
    if (!isAdmin) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        query = query.or(`is_sealed.eq.false,petitioner_id.eq.${user.id}`);
      } else {
        query = query.eq('is_sealed', false);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    if (!data) return [];
    
    return data as unknown as ScrollPetition[];
  } catch (error) {
    console.error('Error fetching petitions:', error);
    throw error;
  }
}

// Fetch a single petition by ID
export async function fetchPetitionById(id: string): Promise<ScrollPetition> {
  try {
    const { data, error } = await supabase
      .from('scroll_petitions')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    if (!data) throw new Error('Petition not found');
    
    return data as unknown as ScrollPetition;
  } catch (error) {
    console.error('Error fetching petition:', error);
    throw error;
  }
}

// Create a new petition
export async function createPetition(petition: Partial<ScrollPetition>): Promise<ScrollPetition> {
  try {
    // Ensure required fields are present
    if (!petition.title || !petition.description) {
      throw new Error('Missing required fields for petition creation');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be logged in to create a petition');
    }

    // Create a properly typed object for insertion
    const petitionToInsert: PetitionInsert = {
      title: petition.title,
      description: petition.description,
      petitioner_id: petition.petitioner_id || user.id,
      status: petition.status || 'pending',
      scroll_integrity_score: petition.scroll_integrity_score,
      is_sealed: petition.is_sealed || false,
    };

    const { data, error } = await supabase
      .from('scroll_petitions')
      .insert(petitionToInsert)
      .select();
      
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to create petition');
    
    return data[0] as unknown as ScrollPetition;
  } catch (error) {
    console.error('Error creating petition:', error);
    throw error;
  }
}

// Update a petition
export async function updatePetition(id: string, updates: Partial<ScrollPetition>): Promise<ScrollPetition> {
  try {
    const { data, error } = await supabase
      .from('scroll_petitions')
      .update(updates)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to update petition');
    
    return data[0] as unknown as ScrollPetition;
  } catch (error) {
    console.error('Error updating petition:', error);
    throw error;
  }
}

// Deliver verdict on a petition
export async function deliverVerdict(
  id: string, 
  verdict: string, 
  reasoning: string
): Promise<ScrollPetition> {
  try {
    const updates = {
      verdict,
      verdict_reasoning: reasoning,
      verdict_timestamp: new Date().toISOString(),
      status: 'verdict_delivered',
    };
    
    const { data, error } = await supabase
      .from('scroll_petitions')
      .update(updates)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to deliver verdict');
    
    // Log the integrity action
    await logIntegrityAction(
      'VERDICT_DELIVERED',
      10, // Positive impact
      `Verdict delivered on petition #${id.substring(0, 8)}`,
      id
    );
    
    return data[0] as unknown as ScrollPetition;
  } catch (error) {
    console.error('Error delivering verdict:', error);
    throw error;
  }
}

// Seal a petition
export async function sealPetition(id: string): Promise<ScrollPetition> {
  try {
    const updates = {
      is_sealed: true,
      status: 'sealed',
    };
    
    const { data, error } = await supabase
      .from('scroll_petitions')
      .update(updates)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to seal petition');
    
    // Log the integrity action
    await logIntegrityAction(
      'PETITION_SEALED',
      5, // Positive impact
      `Petition #${id.substring(0, 8)} was sealed permanently`,
      id
    );
    
    return data[0] as unknown as ScrollPetition;
  } catch (error) {
    console.error('Error sealing petition:', error);
    throw error;
  }
}

// Assign a judge to a petition
export async function assignJudge(petitionId: string, judgeId: string): Promise<ScrollPetition> {
  try {
    const updates = {
      assigned_judge_id: judgeId,
      status: 'in_review'
    };
    
    const { data, error } = await supabase
      .from('scroll_petitions')
      .update(updates)
      .eq('id', petitionId)
      .select();
      
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to assign judge');
    
    await logIntegrityAction(
      'JUDGE_ASSIGNED',
      3, // Positive impact
      `Judge assigned to petition #${petitionId.substring(0, 8)}`,
      petitionId
    );
    
    return data[0] as unknown as ScrollPetition;
  } catch (error) {
    console.error('Error assigning judge:', error);
    throw error;
  }
}

// Log an integrity action - Making this function exportable
export async function logIntegrityAction(
  actionType: string,
  impactLevel: number,
  description: string,
  petitionId?: string
): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    const { error } = await supabase.from('scroll_integrity_logs').insert({
      user_id: userId || null,
      petition_id: petitionId || null,
      action_type: actionType,
      description: description,
      integrity_impact: impactLevel
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error logging integrity action:', error);
    return false;
  }
}
