-- Create a function to delete all rows from a table
CREATE OR REPLACE FUNCTION delete_all_rows(table_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('DELETE FROM %I', table_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
