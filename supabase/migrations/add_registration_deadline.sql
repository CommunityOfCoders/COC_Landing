-- Add registration_deadline column to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS registration_deadline text;

-- Add comment explaining the column
COMMENT ON COLUMN public.events.registration_deadline IS 'Date by which registration must be completed. Format: YYYY-MM-DD. Registration auto-closes after this date.';
