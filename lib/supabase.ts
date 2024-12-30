import { createClient } from '@supabase/supabase-js';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  image_url: string;
  joined_date: string;
  specialization: string;
  social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getCurrentTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('joined_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAlumni(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('alumni')
    .select('*')
    .order('graduation_year', { ascending: false });

  if (error) throw error;
  return data;
}

export async function checkAndUpdateAlumniStatus() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const { data: eligibleMembers, error } = await supabase
    .from('team_members')
    .select('*')
    .lt('joined_date', oneYearAgo.toISOString());

  if (error) throw error;

  for (const member of eligibleMembers || []) {
    await supabase.from('alumni').insert([{
      ...member,
      graduation_year: new Date().getFullYear()
    }]);

    await supabase
      .from('team_members')
      .delete()
      .eq('id', member.id);
  }
}