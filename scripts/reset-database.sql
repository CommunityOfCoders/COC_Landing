-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS user_resource_interactions;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS domains;
DROP TABLE IF EXISTS alumni;
DROP TABLE IF EXISTS team_members;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create team_members table
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  role text NOT NULL,
  description text,
  image_url text,
  joined_date timestamp with time zone DEFAULT now(),
  specialization text,
  social_links jsonb DEFAULT '{"github": null, "linkedin": null, "twitter": null}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create alumni table
CREATE TABLE alumni (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  role text NOT NULL,
  description text,
  image_url text,
  joined_date timestamp with time zone,
  graduation_year integer NOT NULL,
  company text,
  specialization text,
  social_links jsonb DEFAULT '{"github": null, "linkedin": null, "twitter": null}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create domains table
CREATE TABLE domains (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create subjects table
CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id uuid REFERENCES domains(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create resources table
CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  url text,
  type text,
  difficulty_level text,
  tags text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create user_resource_interactions table
CREATE TABLE user_resource_interactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  resource_id uuid REFERENCES resources(id) ON DELETE CASCADE,
  liked boolean DEFAULT false,
  saved boolean DEFAULT false,
  viewed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_alumni_updated_at
    BEFORE UPDATE ON alumni
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_domains_updated_at
    BEFORE UPDATE ON domains
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
    BEFORE UPDATE ON subjects
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_resource_interactions_updated_at
    BEFORE UPDATE ON user_resource_interactions
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Truncate all tables in reverse order of dependencies
TRUNCATE TABLE user_resource_interactions CASCADE;
TRUNCATE TABLE resources CASCADE;
TRUNCATE TABLE subjects CASCADE;
TRUNCATE TABLE domains CASCADE;
TRUNCATE TABLE alumni CASCADE;
TRUNCATE TABLE team_members CASCADE;
