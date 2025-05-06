
-- Create the scroll_recovery_keys table for the recovery system
CREATE TABLE IF NOT EXISTS public.scroll_recovery_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  passphrase TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  recovery_type TEXT NOT NULL DEFAULT 'text',
  voice_transcript TEXT,
  last_used TIMESTAMP WITH TIME ZONE,
  active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.scroll_recovery_keys ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view only their own recovery keys
CREATE POLICY "Users can view their own recovery keys" 
ON public.scroll_recovery_keys 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to create their own recovery keys
CREATE POLICY "Users can create their own recovery keys" 
ON public.scroll_recovery_keys 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own recovery keys
CREATE POLICY "Users can update their own recovery keys" 
ON public.scroll_recovery_keys 
FOR UPDATE 
USING (auth.uid() = user_id);
