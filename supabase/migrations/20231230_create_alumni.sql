-- Create alumni table
create table if not exists alumni (
  id text primary key,
  name text not null,
  email text unique not null,
  graduation_year integer not null,
  company text,
  role text,
  linkedin text,
  expertise text[],
  avatar_url text,
  bio text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
