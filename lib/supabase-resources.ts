import { supabase } from './supabase';

export type Domain = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
};

export type Subject = {
  id: string;
  domain_id: string;
  name: string;
  slug: string;
  description: string;
};

export type Resource = {
  id: string;
  subject_id: string;
  name: string;
  description: string;
  url: string;
  type: string;
  difficulty_level: string;
  tags: string[];
};

export type ResourceInteraction = {
  id: string;
  user_id: string;
  resource_id: string;
  liked: boolean;
  viewed: boolean;
  saved: boolean;
  created_at: string;
  updated_at: string;
};

export type ResourceWithInteractions = Resource & {
  interactions: ResourceInteraction[];
};

export async function getDomains(): Promise<Domain[]> {
  const { data, error } = await supabase
    .from('domains')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getDomainBySlug(slug: string): Promise<Domain | null> {
  const { data, error } = await supabase
    .from('domains')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getSubjectsByDomain(domainSlug: string): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*, domains!inner(*)')
    .eq('domains.slug', domainSlug);

  if (error) throw error;
  return data;
}

export async function getResourcesBySubject(subjectId: string): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('subject_id', subjectId)
    .order('name');

  if (error) throw error;
  return data;
}

export async function getResourceWithInteractions(
  resourceId: string,
  userId: string
): Promise<ResourceWithInteractions | null> {
  const { data, error } = await supabase
    .from('resources')
    .select('*, user_resource_interactions!inner(*)')
    .eq('id', resourceId)
    .eq('user_resource_interactions.user_id', userId);

  if (error) throw error;
  return data[0];
}

export async function interactWithResource(
  userId: string,
  resourceId: string,
  interaction: { liked?: boolean; viewed?: boolean; saved?: boolean }
) {
  const { error } = await supabase
    .from('user_resource_interactions')
    .upsert(
      {
        user_id: userId,
        resource_id: resourceId,
        ...interaction,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id,resource_id' }
    );

  if (error) throw error;
}

export async function getResourceInteractions(
  resourceId: string
): Promise<ResourceInteraction[]> {
  const { data, error } = await supabase
    .from('user_resource_interactions')
    .select('*')
    .eq('resource_id', resourceId);

  if (error) throw error;
  return data;
}