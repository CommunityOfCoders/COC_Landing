-- Create domains table
create table domains (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create subjects table
create table subjects (
  id uuid default uuid_generate_v4() primary key,
  domain_id uuid references domains(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create resources table
create table resources (
  id uuid default uuid_generate_v4() primary key,
  subject_id uuid references subjects(id) on delete cascade,
  name text not null,
  description text,
  type text not null, -- 'video', 'document', 'link', etc.
  url text not null,
  tags text[] default '{}',
  difficulty_level text, -- 'beginner', 'intermediate', 'advanced'
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  likes_count integer default 0,
  views_count integer default 0
);

-- Create user_resource_interactions table
create table user_resource_interactions (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  resource_id uuid references resources(id) on delete cascade,
  liked boolean default false,
  viewed boolean default false,
  saved boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, resource_id)
);
