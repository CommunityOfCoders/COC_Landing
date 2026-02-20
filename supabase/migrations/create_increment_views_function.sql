-- Create function to increment project views atomically
CREATE OR REPLACE FUNCTION increment_project_views(project_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE projects
  SET views_count = views_count + 1
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;
