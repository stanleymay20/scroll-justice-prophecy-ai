
-- Function to calculate integrity score based on petition content
CREATE OR REPLACE FUNCTION public.calculate_integrity_score(
  petition_title TEXT,
  petition_description TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  score INTEGER := 100; -- Start with perfect score
  issues TEXT[] := '{}';
  lowercased_title TEXT;
  lowercased_desc TEXT;
  forbidden_terms TEXT[] := ARRAY['fake', 'lie', 'scam', 'false', 'misleading', 'deceptive'];
  suspect_patterns TEXT[] := ARRAY['!!!', '???', 'URGENT', 'SECRET', 'CONFIDENTIAL'];
  result JSONB;
BEGIN
  -- Convert to lowercase for case-insensitive checking
  lowercased_title := LOWER(petition_title);
  lowercased_desc := LOWER(petition_description);
  
  -- Check length requirements
  IF LENGTH(petition_title) < 10 THEN
    score := score - 15;
    issues := array_append(issues, 'Title is too short (minimum 10 characters)');
  END IF;
  
  IF LENGTH(petition_description) < 50 THEN
    score := score - 20;
    issues := array_append(issues, 'Description is too short (minimum 50 characters)');
  END IF;
  
  -- Check for forbidden terms
  FOREACH VAR IN ARRAY forbidden_terms LOOP
    IF lowercased_title ~* ('\m' || VAR || '\M') OR lowercased_desc ~* ('\m' || VAR || '\M') THEN
      score := score - 10;
      issues := array_append(issues, 'Contains prohibited term: ' || VAR);
    END IF;
  END LOOP;
  
  -- Check for suspicious patterns
  FOREACH VAR IN ARRAY suspect_patterns LOOP
    IF lowercased_title ~ VAR OR lowercased_desc ~ VAR THEN
      score := score - 5;
      issues := array_append(issues, 'Contains suspicious pattern: ' || VAR);
    END IF;
  END LOOP;
  
  -- Check for excessive capitalization
  IF (LENGTH(regexp_replace(petition_title, '[^A-Z]', '', 'g')) > LENGTH(petition_title) * 0.7) OR
     (LENGTH(regexp_replace(petition_description, '[^A-Z]', '', 'g')) > LENGTH(petition_description) * 0.7) THEN
    score := score - 15;
    issues := array_append(issues, 'Excessive use of capital letters');
  END IF;
  
  -- Ensure score doesn't go below zero
  IF score < 0 THEN
    score := 0;
  END IF;
  
  -- Create result JSON
  result := jsonb_build_object(
    'score', score,
    'issues', issues
  );
  
  RETURN result;
END;
$$;

COMMENT ON FUNCTION public.calculate_integrity_score IS 'Evaluates petition text to calculate an integrity score and identify potential issues';
