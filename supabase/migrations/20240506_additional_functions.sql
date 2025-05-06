
-- Function to calculate the integrity score for a petition
CREATE OR REPLACE FUNCTION public.calculate_integrity_score(petition_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  base_score INTEGER := 100;
  total_impact INTEGER := 0;
  current_score INTEGER;
BEGIN
  -- Sum up all integrity impacts from the logs
  SELECT COALESCE(SUM(integrity_impact), 0)
  INTO total_impact
  FROM public.scroll_integrity_logs
  WHERE petition_id = $1;
  
  -- Calculate the current score
  current_score := base_score + total_impact;
  
  -- Ensure score is between 0 and 100
  IF current_score > 100 THEN
    current_score := 100;
  ELSIF current_score < 0 THEN
    current_score := 0;
  END IF;
  
  -- Update the petition's integrity score
  UPDATE public.scroll_petitions
  SET scroll_integrity_score = current_score
  WHERE id = $1;
  
  RETURN current_score;
END;
$$;

-- Function to calculate user's integrity score based on their actions
CREATE OR REPLACE FUNCTION public.calculate_user_integrity(user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  base_score INTEGER := 50;
  positive_actions INTEGER := 0;
  negative_actions INTEGER := 0;
  final_score INTEGER;
BEGIN
  -- Count positive actions (petitions approved, good integrity logs)
  SELECT COUNT(*)
  INTO positive_actions
  FROM public.scroll_petitions
  WHERE petitioner_id = $1 
  AND verdict = 'approved';
  
  -- Count negative actions (integrity violations, rejected petitions)
  SELECT COUNT(*)
  INTO negative_actions
  FROM public.scroll_integrity_logs
  WHERE user_id = $1 
  AND integrity_impact < 0;
  
  -- Add rejected petitions
  negative_actions := negative_actions + (
    SELECT COUNT(*) 
    FROM public.scroll_petitions
    WHERE petitioner_id = $1 
    AND verdict = 'rejected'
  );
  
  -- Calculate final score
  final_score := base_score + (positive_actions * 5) - (negative_actions * 10);
  
  -- Ensure score is between 0 and 100
  IF final_score > 100 THEN
    final_score := 100;
  ELSIF final_score < 0 THEN
    final_score := 0;
  END IF;
  
  RETURN final_score;
END;
$$;

-- Function to calculate a new integrity score after a violation
CREATE OR REPLACE FUNCTION public.calculate_new_score(petition_id UUID, impact INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  current_score INTEGER;
  new_score INTEGER;
BEGIN
  -- Get current score
  SELECT scroll_integrity_score
  INTO current_score
  FROM public.scroll_petitions
  WHERE id = petition_id;
  
  -- Calculate new score
  new_score := current_score + impact;
  
  -- Ensure score is between 0 and 100
  IF new_score > 100 THEN
    new_score := 100;
  ELSIF new_score < 0 THEN
    new_score := 0;
  END IF;
  
  -- Update the petition's integrity score
  UPDATE public.scroll_petitions
  SET scroll_integrity_score = new_score
  WHERE id = petition_id;
  
  RETURN new_score;
END;
$$;
