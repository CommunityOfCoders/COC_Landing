-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  title text NOT NULL,
  description text,
  time text,
  location text,
  maxparticipants integer,
  category text CHECK (category = ANY (ARRAY['workshop'::text, 'hackathon'::text, 'seminar'::text, 'competition'::text, 'webinar'::text, 'bootcamp'::text, 'conference'::text, 'networking'::text, 'tech-talk'::text, 'panel-discussion'::text, 'project-showcase'::text, 'coding-contest'::text, 'study-group'::text, 'other'::text])),
  organizer text,
  tags jsonb DEFAULT '[]'::jsonb,
  requirements jsonb DEFAULT '[]'::jsonb,
  participantcount integer DEFAULT 0,
  stats jsonb DEFAULT '{"total": 0, "attended": 0, "cancelled": 0, "confirmed": 0}'::jsonb,
  team_event boolean DEFAULT false,
  max_team_size integer DEFAULT 1,
  min_team_size integer DEFAULT 1,
  date text,
  registration_deadline text,
  imageurl text NOT NULL DEFAULT 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'::text,
  registrationstatus text DEFAULT 'upcoming'::text CHECK (registrationstatus = ANY (ARRAY['upcoming'::text, 'open'::text, 'closed'::text])),
  event_status text DEFAULT 'upcoming'::text CHECK (event_status = ANY (ARRAY['upcoming'::text, 'ongoing'::text, 'completed'::text, 'cancelled'::text])),
  event_highlights jsonb DEFAULT '[]'::jsonb,
  event_photos ARRAY DEFAULT ARRAY[]::text[],
  attendance_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  external_link text,
  CONSTRAINT events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.participants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text DEFAULT 'registered'::text CHECK (status = ANY (ARRAY['registered'::text, 'confirmed'::text, 'attended'::text, 'cancelled'::text])),
  team_name text,
  team_members jsonb,
  is_team_leader boolean DEFAULT false,
  CONSTRAINT participants_pkey PRIMARY KEY (id),
  CONSTRAINT participants_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(uid)
);
CREATE TABLE public.users (
  uid uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  email text NOT NULL UNIQUE,
  picture text,
  branch text,
  year bigint NOT NULL DEFAULT 1,
  is_admin smallint NOT NULL DEFAULT 0 CHECK (is_admin = ANY (ARRAY[0, 1])),
  phone text,
  graduated boolean DEFAULT false,
  CONSTRAINT users_pkey PRIMARY KEY (uid)
);