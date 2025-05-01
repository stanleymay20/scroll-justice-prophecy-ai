
import { supabase } from '@/integrations/supabase/client';
import { ScrollPetition, ScrollEvidence } from '@/types/petition';

// Fetch all petitions
export async function fetchPetitions(isAdmin = false): Promise<ScrollPetition[]> {
  try {
    let query = supabase.from('scroll_petitions').select('*');
    
    // If not admin, rely on RLS to filter appropriately
    if (!isAdmin) {
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as ScrollPetition[];
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
    return data as ScrollPetition;
  } catch (error) {
    console.error('Error fetching petition:', error);
    throw error;
  }
}

// Create a new petition
export async function createPetition(petition: Partial<ScrollPetition>): Promise<ScrollPetition> {
  try {
    const { data, error } = await supabase
      .from('scroll_petitions')
      .insert([petition])
      .select();
      
    if (error) throw error;
    return data[0] as ScrollPetition;
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
    return data[0] as ScrollPetition;
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
    return data[0] as ScrollPetition;
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
    return data[0] as ScrollPetition;
  } catch (error) {
    console.error('Error sealing petition:', error);
    throw error;
  }
}

// Get AI suggested verdict
export async function getAiSuggestedVerdict(
  petitionTitle: string,
  petitionDescription: string,
  evidence?: string[]
): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke("get-ai-verdict", {
      body: {
        petitionTitle,
        petitionDescription,
        evidence,
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting AI verdict:", error);
    throw error;
  }
}

// Upload evidence for a petition
export async function uploadEvidence(
  petitionId: string,
  file: File,
  description?: string
): Promise<ScrollEvidence> {
  try {
    // Generate a unique path
    const filePath = `evidence/${petitionId}/${Date.now()}_${file.name}`;
    
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('scroll_evidence')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Create evidence record
    const evidence = {
      petition_id: petitionId,
      file_path: filePath,
      file_type: file.type,
      description,
      is_sealed: false,
    };
    
    const { data, error } = await supabase
      .from('scroll_evidence')
      .insert([evidence])
      .select();
      
    if (error) throw error;
    return data[0] as ScrollEvidence;
  } catch (error) {
    console.error('Error uploading evidence:', error);
    throw error;
  }
}

// Get evidence for a petition
export async function getPetitionEvidence(petitionId: string): Promise<ScrollEvidence[]> {
  try {
    const { data, error } = await supabase
      .from('scroll_evidence')
      .select('*')
      .eq('petition_id', petitionId);
      
    if (error) throw error;
    return data as ScrollEvidence[];
  } catch (error) {
    console.error('Error fetching evidence:', error);
    throw error;
  }
}

// Analyze content for integrity
export async function analyzeContent(text: string): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke("analyze-content", {
      body: { text }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error analyzing content:", error);
    throw error;
  }
}
