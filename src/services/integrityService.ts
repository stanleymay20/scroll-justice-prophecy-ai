
import { supabase } from '@/integrations/supabase/client';

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
