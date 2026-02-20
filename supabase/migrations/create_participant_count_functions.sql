-- Create function to decrement participant count atomically
CREATE OR REPLACE FUNCTION decrement_participant_count(event_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE events
  SET participantcount = GREATEST(participantcount - 1, 0),
      updated_at = NOW()
  WHERE id = event_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment participant count atomically (for consistency)
CREATE OR REPLACE FUNCTION increment_participant_count(event_id_param UUID, count_to_add INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
  UPDATE events
  SET participantcount = participantcount + count_to_add,
      updated_at = NOW()
  WHERE id = event_id_param;
END;
$$ LANGUAGE plpgsql;
