
-- Function to calculate user integrity score based on their history
CREATE OR REPLACE FUNCTION public.calculate_user_integrity(
  user_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  base_score INTEGER := 100;
  total_impact INTEGER := 0;
  incident_count INTEGER := 0;
  user_exists BOOLEAN;
BEGIN
  -- Check if the user exists
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE id = user_id
  ) INTO user_exists;
  
  IF NOT user_exists THEN
    RETURN NULL; -- Return null for non-existent users
  END IF;
  
  -- Calculate total integrity impact from logs
  SELECT 
    COALESCE(SUM(integrity_impact), 0),
    COUNT(*)
  INTO 
    total_impact,
    incident_count
  FROM public.scroll_integrity_logs
  WHERE user_id = calculate_user_integrity.user_id;
  
  -- Apply total impact to base score
  base_score := base_score - total_impact;
  
  -- Apply additional penalty if there are many incidents (progressive discipline)
  IF incident_count > 5 THEN
    base_score := base_score - (incident_count - 5) * 3;
  END IF;
  
  -- Ensure the score stays within 0-100 range
  IF base_score < 0 THEN
    base_score := 0;
  ELSIF base_score > 100 THEN
    base_score := 100;
  END IF;
  
  RETURN base_score;
END;
$$;

COMMENT ON FUNCTION public.calculate_user_integrity IS 'Calculates a user integrity score based on their history of integrity violations';
