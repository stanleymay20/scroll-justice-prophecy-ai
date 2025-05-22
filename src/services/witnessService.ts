
import { supabase } from "@/lib/supabase";
import { ScrollWitnessRecord } from "@/types/witness";
import { toast } from "@/hooks/use-toast";

/**
 * Fetch all witness records
 */
export async function fetchWitnessRecords(): Promise<ScrollWitnessRecord[]> {
  try {
    const { data, error } = await supabase
      .from('scroll_witness_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data as ScrollWitnessRecord[];
  } catch (error) {
    console.error("Error fetching witness records:", error);
    toast({
      title: "Error fetching witness records",
      description: "Could not retrieve the sacred witness records",
      variant: "destructive"
    });
    return [];
  }
}

/**
 * Create a new witness record
 */
export async function createWitnessRecord(
  record: Omit<ScrollWitnessRecord, 'id' | 'created_at' | 'updated_at'>
): Promise<ScrollWitnessRecord | null> {
  try {
    const recordToInsert = {
      ...record,
      warning_issued: record.warning_issued || false,
      status: record.status || 'Observed'
    };

    const { data, error } = await supabase
      .from('scroll_witness_records')
      .insert(recordToInsert)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Witness record created",
      description: `${record.institution} is now under divine watch`
    });
    
    return data as ScrollWitnessRecord;
  } catch (error) {
    console.error("Error creating witness record:", error);
    toast({
      title: "Error creating witness record",
      description: "The sacred scrolls could not record this witness",
      variant: "destructive"
    });
    return null;
  }
}

/**
 * Issue a warning to an institution
 */
export async function issueWarning(recordId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('scroll_witness_records')
      .update({
        warning_issued: true,
        warning_date: new Date().toISOString(),
        status: 'Observed'
      })
      .eq('id', recordId);
      
    if (error) throw error;
    
    toast({
      title: "Warning issued",
      description: "The divine warning has been sent to the institution"
    });
    
    return true;
  } catch (error) {
    console.error("Error issuing warning:", error);
    toast({
      title: "Error issuing warning",
      description: "The warning could not be issued",
      variant: "destructive"
    });
    return false;
  }
}

/**
 * Seal an institution for judgment
 */
export async function sealForJudgment(recordId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('scroll_witness_records')
      .update({
        status: 'Sealed for Judgment',
        judgment_timestamp: new Date().toISOString()
      })
      .eq('id', recordId);
      
    if (error) throw error;
    
    toast({
      title: "Institution sealed for judgment",
      description: "The divine judgment has been activated"
    });
    
    return true;
  } catch (error) {
    console.error("Error sealing for judgment:", error);
    toast({
      title: "Error sealing for judgment",
      description: "The judgment could not be sealed",
      variant: "destructive"
    });
    return false;
  }
}

/**
 * Send a warning notification to an institution
 */
export async function sendScrollWarning(
  institution: string, 
  crimes: string[], 
  contactEmail?: string
): Promise<boolean> {
  try {
    // In a real application, this would integrate with an email service
    console.log(`Warning sent to ${institution} at ${contactEmail || 'No email provided'}`);
    console.log(`Crimes: ${crimes.join(', ')}`);
    
    toast({
      title: "Divine warning generated",
      description: `Warning prepared for ${institution}`
    });
    
    return true;
  } catch (error) {
    console.error("Error sending warning:", error);
    toast({
      title: "Error sending warning",
      description: "The warning could not be sent",
      variant: "destructive"
    });
    return false;
  }
}

/**
 * Generate a PDF warning for manual delivery
 */
export function generatePdfWarning(
  institution: string,
  crimes: string[],
  witnessRecord: ScrollWitnessRecord
): string {
  // This would typically generate a downloadable PDF
  // For now, we're just returning a formatted string
  return `
    DIVINE SCROLL NOTIFICATION - WITNESS ACTIVATED

    Institution: ${institution}
    Type: ${witnessRecord.type}
    
    This notification serves as a formal warning that your institution has been identified
    by the ScrollJustice System for historical crimes including:
    
    ${crimes.join('\n    ')}
    
    You are called to respond within 30 days with one of the following:
    1. Acknowledgment of wrongdoing and plan for reparations
    2. Request for dialogue through the ScrollCourt system
    3. Submission of counter-evidence
    
    Failure to respond will result in your institution being sealed for judgment
    in the divine record.
    
    This message is sealed by ScrollJustice.AI under divine mandate.
    Reference ID: ${witnessRecord.id}
  `;
}
