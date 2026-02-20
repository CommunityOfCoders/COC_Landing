'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { Project, ProjectSubmission, ProjectReviewData, ProjectWithLikeStatus } from "@/types/projects";

type ActionResult<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Convert database row to Project type
function dbRowToProject(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    fullDescription: row.full_description,
    category: row.category,
    tags: row.tags || [],
    githubUrl: row.github_url,
    liveUrl: row.live_url,
    videoUrl: row.video_url,
    imageUrl: row.image_url,
    additionalImages: row.additional_images || [],
    teamName: row.team_name,
    teamMembers: row.team_members || [],
    submittedBy: row.submitted_by,
    submitterName: row.submitter_name,
    submitterYear: row.submitter_year,
    submitterBranch: row.submitter_branch,
    status: row.status,
    reviewNotes: row.review_notes,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    isFeatured: row.is_featured,
    viewsCount: row.views_count,
    likesCount: row.likes_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Get all approved projects for showcase
export async function getApprovedProjects(
  category?: string,
  featured?: boolean
): Promise<ActionResult<Project[]>> {
  try {
    let query = supabaseAdmin
      .from('projects')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (featured !== undefined) {
      query = query.eq('is_featured', featured);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      success: true,
      data: data.map(dbRowToProject),
    };
  } catch (error: any) {
    console.error('Error fetching approved projects:', error);
    return { success: false, error: error.message };
  }
}

// Get single project by ID with view increment
export async function getProjectById(id: string, incrementView = false): Promise<ActionResult<Project>> {
  try {
    if (incrementView) {
      // Increment view count
      await supabaseAdmin.rpc('increment_project_views', { project_id: id });
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: dbRowToProject(data),
    };
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return { success: false, error: error.message };
  }
}

// Submit a new project
export async function submitProject(projectData: ProjectSubmission): Promise<ActionResult<Project>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: false, error: "You must be signed in to submit a project" };
    }

    // Get user profile for additional details
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('name, year, branch')
      .eq('email', session.user.email)
      .single();

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        title: projectData.title,
        description: projectData.description,
        full_description: projectData.fullDescription,
        category: projectData.category,
        tags: projectData.tags,
        github_url: projectData.githubUrl,
        live_url: projectData.liveUrl,
        video_url: projectData.videoUrl,
        image_url: projectData.imageUrl,
        additional_images: projectData.additionalImages,
        team_name: projectData.teamName,
        team_members: projectData.teamMembers,
        submitted_by: session.user.email,
        submitter_name: userProfile?.name || session.user.name || 'Unknown',
        submitter_year: userProfile?.year,
        submitter_branch: userProfile?.branch,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/projects');
    revalidatePath('/admin-dashboard');

    return {
      success: true,
      data: dbRowToProject(data),
    };
  } catch (error: any) {
    console.error('Error submitting project:', error);
    return { success: false, error: error.message };
  }
}

// Get user's own projects
export async function getMyProjects(): Promise<ActionResult<Project[]>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: false, error: "You must be signed in" };
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('submitted_by', session.user.email)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: data.map(dbRowToProject),
    };
  } catch (error: any) {
    console.error('Error fetching user projects:', error);
    return { success: false, error: error.message };
  }
}

// Admin: Get all projects (including pending)
export async function getAllProjects(status?: string): Promise<ActionResult<Project[]>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: false, error: "You must be signed in" };
    }

    // Check if user is admin
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (!userProfile?.is_admin) {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    let query = supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      success: true,
      data: data.map(dbRowToProject),
    };
  } catch (error: any) {
    console.error('Error fetching all projects:', error);
    return { success: false, error: error.message };
  }
}

// Admin: Review a project
export async function reviewProject(
  projectId: string,
  reviewData: ProjectReviewData
): Promise<ActionResult<Project>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: false, error: "You must be signed in" };
    }

    // Check if user is admin
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (!userProfile?.is_admin) {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({
        status: reviewData.status,
        review_notes: reviewData.reviewNotes,
        reviewed_by: session.user.email,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/projects');
    revalidatePath('/admin-dashboard');

    return {
      success: true,
      data: dbRowToProject(data),
    };
  } catch (error: any) {
    console.error('Error reviewing project:', error);
    return { success: false, error: error.message };
  }
}

// Admin: Toggle featured status
export async function toggleFeaturedProject(projectId: string): Promise<ActionResult<Project>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: false, error: "You must be signed in" };
    }

    // Check if user is admin
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (!userProfile?.is_admin) {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    // Get current featured status
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('is_featured')
      .eq('id', projectId)
      .single();

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({
        is_featured: !project?.is_featured,
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/projects');
    revalidatePath('/admin-dashboard');

    return {
      success: true,
      data: dbRowToProject(data),
    };
  } catch (error: any) {
    console.error('Error toggling featured status:', error);
    return { success: false, error: error.message };
  }
}

// Like/Unlike a project
export async function toggleProjectLike(projectId: string): Promise<ActionResult<{ liked: boolean; likesCount: number }>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: false, error: "You must be signed in to like projects" };
    }

    // Check if already liked
    const { data: existingLike } = await supabaseAdmin
      .from('project_likes')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_email', session.user.email)
      .single();

    if (existingLike) {
      // Unlike
      await supabaseAdmin
        .from('project_likes')
        .delete()
        .eq('id', existingLike.id);
    } else {
      // Like
      await supabaseAdmin
        .from('project_likes')
        .insert({
          project_id: projectId,
          user_email: session.user.email,
        });
    }

    // Get updated like count
    const { count } = await supabaseAdmin
      .from('project_likes')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);

    // Update project likes count
    await supabaseAdmin
      .from('projects')
      .update({ likes_count: count || 0 })
      .eq('id', projectId);

    revalidatePath('/projects');

    return {
      success: true,
      data: {
        liked: !existingLike,
        likesCount: count || 0,
      },
    };
  } catch (error: any) {
    console.error('Error toggling project like:', error);
    return { success: false, error: error.message };
  }
}

// Check if user has liked a project
export async function hasUserLikedProject(projectId: string): Promise<ActionResult<boolean>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: true, data: false };
    }

    const { data } = await supabaseAdmin
      .from('project_likes')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_email', session.user.email)
      .single();

    return {
      success: true,
      data: !!data,
    };
  } catch (error: any) {
    return { success: true, data: false };
  }
}

// Delete project (admin or owner)
export async function deleteProject(projectId: string): Promise<ActionResult<void>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: false, error: "You must be signed in" };
    }

    // Get project to check ownership
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('submitted_by')
      .eq('id', projectId)
      .single();

    // Check if user is admin
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    const isOwner = project?.submitted_by === session.user.email;
    const isAdmin = userProfile?.is_admin;

    if (!isOwner && !isAdmin) {
      return { success: false, error: "Unauthorized: You can only delete your own projects" };
    }

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;

    revalidatePath('/projects');
    revalidatePath('/admin-dashboard');

    return { success: true, data: undefined };
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return { success: false, error: error.message };
  }
}
