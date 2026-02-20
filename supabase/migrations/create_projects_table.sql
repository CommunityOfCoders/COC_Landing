-- Create projects table for project showcase
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  
  -- Project details
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  video_url VARCHAR(500),
  image_url VARCHAR(500),
  additional_images TEXT[] DEFAULT '{}',
  
  -- Team information
  team_name VARCHAR(255),
  team_members JSONB DEFAULT '[]', -- Array of {name, role, email}
  
  -- Submission metadata
  submitted_by VARCHAR(255) NOT NULL, -- User email
  submitter_name VARCHAR(255) NOT NULL,
  submitter_year INTEGER,
  submitter_branch VARCHAR(100),
  
  -- Review status
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  review_notes TEXT,
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMPTZ,
  
  -- Showcase info
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT valid_category CHECK (category IN (
    'web-development',
    'app-development',
    'machine-learning',
    'blockchain',
    'iot',
    'game-development',
    'ai',
    'data-science',
    'cybersecurity',
    'other'
  ))
);

-- Create index on status for filtering
CREATE INDEX idx_projects_status ON projects(status);

-- Create index on submitted_by for user queries
CREATE INDEX idx_projects_submitted_by ON projects(submitted_by);

-- Create index on category for filtering
CREATE INDEX idx_projects_category ON projects(category);

-- Create index on created_at for sorting
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Create index on is_featured for featured projects
CREATE INDEX idx_projects_featured ON projects(is_featured) WHERE is_featured = TRUE;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_projects_timestamp
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

-- Create project_likes table for tracking user likes
CREATE TABLE IF NOT EXISTS project_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one like per user per project
  UNIQUE(project_id, user_email)
);

-- Create index on project_id for faster lookups
CREATE INDEX idx_project_likes_project_id ON project_likes(project_id);

-- Create index on user_email for user queries
CREATE INDEX idx_project_likes_user_email ON project_likes(user_email);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved projects
CREATE POLICY "Anyone can view approved projects"
  ON projects FOR SELECT
  USING (status = 'approved' OR submitted_by = current_setting('request.jwt.claim.email', true));

-- Policy: Authenticated users can insert their own projects
CREATE POLICY "Users can submit their own projects"
  ON projects FOR INSERT
  WITH CHECK (submitted_by = current_setting('request.jwt.claim.email', true));

-- Policy: Users can update their own pending projects
CREATE POLICY "Users can update their own pending projects"
  ON projects FOR UPDATE
  USING (submitted_by = current_setting('request.jwt.claim.email', true) AND status = 'pending');

-- Policy: Anyone can view project likes
CREATE POLICY "Anyone can view project likes"
  ON project_likes FOR SELECT
  USING (true);

-- Policy: Authenticated users can like projects
CREATE POLICY "Authenticated users can like projects"
  ON project_likes FOR INSERT
  WITH CHECK (user_email = current_setting('request.jwt.claim.email', true));

-- Policy: Users can remove their own likes
CREATE POLICY "Users can remove their own likes"
  ON project_likes FOR DELETE
  USING (user_email = current_setting('request.jwt.claim.email', true));
