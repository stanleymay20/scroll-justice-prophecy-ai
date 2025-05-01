
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
    const { data, error } = await supabase
      .from('scroll_petitions')
      .select('*')
      .order('created_at', { ascending: false });
    
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
    if (!petition.title || !petition.description || !petition.petitioner_id) {
      throw new Error('Missing required fields for petition creation');
    }

    // Create a properly typed object for insertion
    const petitionToInsert: PetitionInsert = {
      title: petition.title,
      description: petition.description,
      petitioner_id: petition.petitioner_id,
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
    
    return data[0] as unknown as ScrollPetition;
  } catch (error) {
    console.error('Error sealing petition:', error);
    throw error;
  }
}
