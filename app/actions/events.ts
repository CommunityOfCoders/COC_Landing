'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

type ActionResult<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Helper function to calculate event status based on date
function calculateEventStatus(eventDate: string | null, currentStatus: string): string {
  // Don't change cancelled events
  if (currentStatus === 'cancelled') return 'cancelled';
  
  if (!eventDate) return currentStatus || 'upcoming';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);
  
  const diffTime = event.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 0) return 'upcoming';
  if (diffDays === 0) return 'ongoing';
  return 'completed';
}

// Helper function to calculate registration status based on deadline, event date, and capacity
function calculateRegistrationStatus(
  eventDate: string | null,
  registrationDeadline: string | null,
  currentStatus: string,
  participantCount: number,
  maxParticipants: number
): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if event has already passed
  if (eventDate) {
    const event = new Date(eventDate);
    event.setHours(0, 0, 0, 0);
    if (event < today) return 'closed';
  }
  
  // Check if registration deadline has passed
  if (registrationDeadline) {
    const deadline = new Date(registrationDeadline);
    deadline.setHours(23, 59, 59, 999); // End of deadline day
    if (new Date() > deadline) return 'closed';
  }
  
  // Check if capacity is full
  if (maxParticipants && participantCount >= maxParticipants) return 'closed';
  
  // Check if registration deadline is in the future (registration is open)
  if (registrationDeadline) {
    const deadline = new Date(registrationDeadline);
    deadline.setHours(0, 0, 0, 0);
    if (deadline >= today) return 'open';
  }
  
  // If no deadline set but event is in the future, consider it open
  if (eventDate) {
    const event = new Date(eventDate);
    event.setHours(0, 0, 0, 0);
    if (event >= today) return 'open';
  }
  
  return currentStatus || 'upcoming';
}

// Helper function to auto-update event statuses in the database
async function autoUpdateEventStatuses(events: any[]): Promise<any[]> {
  const updates: { id: string; event_status?: string; registrationstatus?: string }[] = [];
  
  const updatedEvents = events.map((event) => {
    const calculatedEventStatus = calculateEventStatus(event.date, event.event_status);
    const calculatedRegStatus = calculateRegistrationStatus(
      event.date,
      event.registration_deadline,
      event.registrationstatus,
      event.participantcount || 0,
      event.maxparticipants || 0
    );
    
    const needsUpdate = 
      calculatedEventStatus !== event.event_status || 
      calculatedRegStatus !== event.registrationstatus;
    
    if (needsUpdate) {
      updates.push({ 
        id: event.id, 
        event_status: calculatedEventStatus,
        registrationstatus: calculatedRegStatus
      });
      return { 
        ...event, 
        event_status: calculatedEventStatus,
        registrationstatus: calculatedRegStatus
      };
    }
    return event;
  });
  
  // Batch update events that need status changes
  for (const update of updates) {
    await supabaseAdmin
      .from("events")
      .update({ 
        event_status: update.event_status,
        registrationstatus: update.registrationstatus,
        updated_at: new Date().toISOString() 
      })
      .eq("id", update.id);
  }
  
  return updatedEvents;
}

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

    // Auto-update event statuses based on date
    const updatedEvents = await autoUpdateEventStatuses(events);

    return { success: true, data: updatedEvents };
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
  registrationstatus?: string;
  registrationDeadline?: string;
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
          registrationstatus: eventData.registrationstatus || 'open',
          registration_deadline: eventData.registrationDeadline || null,
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

    // Transform camelCase keys to snake_case for database columns
    const dbUpdates: Record<string, any> = {};
    const keyMap: Record<string, string> = {
      maxParticipants: 'maxparticipants',
      imageUrl: 'imageurl',
      participantCount: 'participantcount',
      teamEvent: 'team_event',
      maxTeamSize: 'max_team_size',
      minTeamSize: 'min_team_size',
      eventStatus: 'event_status',
      isFeatured: 'is_featured',
      externalLink: 'external_link',
      eventHighlights: 'event_highlights',
      eventPhotos: 'event_photos',
      attendanceCount: 'attendance_count',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      registrationDeadline: 'registration_deadline',
    };

    for (const [key, value] of Object.entries(updates)) {
      // Skip undefined values and empty strings for optional fields
      if (value === undefined) continue;
      // Skip createdAt - it should not be updated
      if (key === 'createdAt' || key === 'created_at') continue;
      
      const dbKey = keyMap[key] || key;
      dbUpdates[dbKey] = value;
    }

    // Always update the updated_at timestamp
    dbUpdates.updated_at = new Date().toISOString();

    const { data: event, error } = await supabaseAdmin
      .from("events")
      .update(dbUpdates)
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

// GET featured events (Public - no auth required)
export async function getFeaturedEvents(): Promise<ActionResult<any[]>> {
  try {
    const { data: events, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("is_featured", true)
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching featured events:", error);
      return { success: false, error: "Failed to fetch featured events" };
    }

    // Auto-update event statuses based on date
    const updatedEvents = await autoUpdateEventStatuses(events);

    // Transform to camelCase for frontend
    const transformedEvents = updatedEvents.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      maxParticipants: event.maxparticipants,
      registrationStatus: event.registrationstatus,
      eventStatus: event.event_status,
      category: event.category,
      organizer: event.organizer,
      imageUrl: event.imageurl,
      tags: event.tags || [],
      externalLink: event.external_link,
    }));

    return { success: true, data: transformedEvents };
  } catch (error: any) {
    console.error("Error in getFeaturedEvents:", error);
    return { success: false, error: "Internal server error" };
  }
}
