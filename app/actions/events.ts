'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

type ActionResult<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string };

// GET all events
export async function getEvents(): Promise<ActionResult<any[]>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: events, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
      return { success: false, error: "Failed to fetch events" };
    }

    return { success: true, data: events };
  } catch (error: any) {
    console.error("Error in getEvents:", error);
    return { success: false, error: "Internal server error" };
  }
}

// CREATE a new event (Admin only)
export async function createEvent(eventData: {
  title: string;
  description: string;
  date?: string;
  time?: string;
  location: string;
  maxParticipants?: number;
  registrationStatus?: string;
  category?: string;
  organizer?: string;
  tags?: string[];
  requirements?: string[];
  imageUrl?: string;
  teamEvent?: boolean;
  maxTeamSize?: number;
  minTeamSize?: number;
  eventStatus?: string;
  isFeatured?: boolean;
  externalLink?: string;
  eventHighlights?: any[];
  eventPhotos?: string[];
  attendanceCount?: number;
}): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user is admin
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("is_admin")
      .eq("email", session.user.email)
      .single();

    if (userData?.is_admin !== 1) {
      return { success: false, error: "Forbidden - Admin access required" };
    }

    // Validate required fields
    if (!eventData.title || !eventData.description || !eventData.location) {
      return { success: false, error: "Missing required fields: title, description, location" };
    }

    // Default placeholder image if not provided
    const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop';

    const { data: event, error } = await supabaseAdmin
      .from("events")
      .insert([
        {
          title: eventData.title,
          description: eventData.description,
          date: eventData.date || new Date().toISOString().split('T')[0],
          time: eventData.time,
          location: eventData.location,
          maxparticipants: eventData.maxParticipants || 100,
          registrationstatus: eventData.registrationStatus || 'upcoming',
          category: eventData.category || "workshop",
          organizer: eventData.organizer || "COC",
          tags: eventData.tags || [],
          requirements: eventData.requirements || [],
          imageurl: eventData.imageUrl || DEFAULT_IMAGE,
          participantcount: 0,
          team_event: eventData.teamEvent ?? false,
          max_team_size: eventData.maxTeamSize || 1,
          min_team_size: eventData.minTeamSize || 1,
          event_status: eventData.eventStatus || 'upcoming',
          is_featured: eventData.isFeatured ?? false,
          external_link: eventData.externalLink,
          event_highlights: eventData.eventHighlights || [],
          event_photos: eventData.eventPhotos || [],
          attendance_count: eventData.attendanceCount || 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating event:", error);
      return { success: false, error: error.message || "Failed to create event" };
    }

    // Revalidate pages that show events
    revalidatePath("/dashboard/events");
    revalidatePath("/admin-dashboard");
    revalidatePath("/dashboard");

    return { success: true, data: event };
  } catch (error: any) {
    console.error("Error in createEvent:", error);
    return { success: false, error: "Internal server error" };
  }
}

// UPDATE an event (Admin only)
export async function updateEvent(eventId: string, updates: Partial<any>): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user is admin
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("is_admin")
      .eq("email", session.user.email)
      .single();

    if (userData?.is_admin !== 1) {
      return { success: false, error: "Forbidden - Admin access required" };
    }

    const { data: event, error } = await supabaseAdmin
      .from("events")
      .update(updates)
      .eq("id", eventId)
      .select()
      .single();

    if (error) {
      console.error("Error updating event:", error);
      return { success: false, error: error.message || "Failed to update event" };
    }

    // Revalidate pages that show events
    revalidatePath("/dashboard/events");
    revalidatePath("/admin-dashboard");
    revalidatePath("/dashboard");

    return { success: true, data: event };
  } catch (error: any) {
    console.error("Error in updateEvent:", error);
    return { success: false, error: "Internal server error" };
  }
}

// DELETE an event (Admin only)
export async function deleteEvent(eventId: string): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user is admin
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("is_admin")
      .eq("email", session.user.email)
      .single();

    if (userData?.is_admin !== 1) {
      return { success: false, error: "Forbidden - Admin access required" };
    }

    const { error } = await supabaseAdmin
      .from("events")
      .delete()
      .eq("id", eventId);

    if (error) {
      console.error("Error deleting event:", error);
      return { success: false, error: error.message || "Failed to delete event" };
    }

    // Revalidate pages that show events
    revalidatePath("/dashboard/events");
    revalidatePath("/admin-dashboard");
    revalidatePath("/dashboard");

    return { success: true, data: { id: eventId } };
  } catch (error: any) {
    console.error("Error in deleteEvent:", error);
    return { success: false, error: "Internal server error" };
  }
}

// GET a specific event by ID
export async function getEventById(eventId: string): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: event, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) {
      console.error("Error fetching event:", error);
      return { success: false, error: "Event not found" };
    }

    return { success: true, data: event };
  } catch (error: any) {
    console.error("Error in getEventById:", error);
    return { success: false, error: "Internal server error" };
  }
}
