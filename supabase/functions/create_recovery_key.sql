
-- Function to create a recovery key entry
CREATE OR REPLACE FUNCTION public.create_recovery_key(
  user_id UUID,
  passphrase TEXT,
  recovery_type TEXT DEFAULT 'text',
  voice_transcript TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.scroll_recovery_keys (
    user_id,
    passphrase,
    recovery_type,
    voice_transcript
  ) VALUES (
    user_id,
    passphrase,
    recovery_type,
    voice_transcript
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;
