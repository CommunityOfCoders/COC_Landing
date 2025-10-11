'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

type ActionResult<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string };

// GET all participants with optional filters
export async function getParticipants(filters?: {
  eventId?: string;
  userId?: string;
}): Promise<ActionResult<any[]>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    let query = supabaseAdmin
      .from("participants")
      .select(`
        *,
        events:event_id (
          id,
          title,
          description,
          time,
          location,
          category,
          team_event
        ),
        users:user_id (
          uid,
          name,
          email,
          picture,
          phone,
          year,
          branch
        )
      `)
      .order("created_at", { ascending: false });

    if (filters?.eventId) {
      query = query.eq("event_id", filters.eventId);
    }

    if (filters?.userId) {
      query = query.eq("user_id", filters.userId);
    }

    const { data: participants, error } = await query;

    if (error) {
      console.error("Error fetching participants:", error);
      return { success: false, error: "Failed to fetch participants" };
    }

    return { success: true, data: participants };
  } catch (error: any) {
    console.error("Error in getParticipants:", error);
    return { success: false, error: "Internal server error" };
  }
}

// Register for an event (individual or team)
export async function registerForEvent(registration: {
  event_id: string;
  team_name?: string;
  team_members?: Array<{ email: string; name?: string }>;
}): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user from database
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("uid")
      .eq("email", session.user.email)
      .single();

    if (userError || !user) {
      return { success: false, error: "User not found" };
    }

    if (!registration.event_id) {
      return { success: false, error: "Event ID is required" };
    }

    // Check if event exists and is open for registration
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("id, registrationstatus, maxparticipants, participantcount, team_event, max_team_size, min_team_size")
      .eq("id", registration.event_id)
      .single();

    if (eventError || !event) {
      return { success: false, error: "Event not found" };
    }

    if (!event.registrationstatus) {
      return { success: false, error: "Event registration is closed" };
    }

    if (event.participantcount >= event.maxparticipants) {
      return { success: false, error: "Event is full" };
    }

    // Check if user is already registered
    const { data: existingRegistration } = await supabaseAdmin
      .from("participants")
      .select("id, team_name")
      .eq("event_id", registration.event_id)
      .eq("user_id", user.uid)
      .single();

    if (existingRegistration) {
      return {
        success: false,
        error: existingRegistration.team_name 
          ? `You are already part of team "${existingRegistration.team_name}" for this event`
          : "You are already registered for this event"
      };
    }

    // Team event registration
    if (event.team_event) {
      if (!registration.team_name) {
        return { success: false, error: "Team name is required for this event" };
      }
      
      if (!registration.team_members || !Array.isArray(registration.team_members)) {
        return { success: false, error: "Team members are required for this event" };
      }

      // Validate team size
      const totalTeamSize = registration.team_members.length + 1;
      if (totalTeamSize < event.min_team_size || totalTeamSize > event.max_team_size) {
        return {
          success: false,
          error: `Team size must be between ${event.min_team_size} and ${event.max_team_size} members`
        };
      }

      const teamMemberEmails = registration.team_members.map(m => m.email);
      
      if (teamMemberEmails.includes(session.user.email)) {
        return { success: false, error: "You don't need to add yourself to the team members list" };
      }

      // Verify all team members exist
      const { data: teamMemberUsers, error: teamMemberError } = await supabaseAdmin
        .from("users")
        .select("uid, email")
        .in("email", teamMemberEmails);

      if (teamMemberError || !teamMemberUsers || teamMemberUsers.length !== teamMemberEmails.length) {
        return { success: false, error: "One or more team member emails are not registered users" };
      }

      // Check if any team member is already registered
      const { data: existingTeamMembers } = await supabaseAdmin
        .from("participants")
        .select("user_id, team_name")
        .eq("event_id", registration.event_id)
        .in("user_id", teamMemberUsers.map(u => u.uid));

      if (existingTeamMembers && existingTeamMembers.length > 0) {
        const conflictingMember = teamMemberUsers.find(
          u => existingTeamMembers.some(p => p.user_id === u.uid)
        );
        const conflictingParticipant = existingTeamMembers.find(
          p => p.user_id === conflictingMember?.uid
        );
        return {
          success: false,
          error: `${conflictingMember?.email} is already registered${conflictingParticipant?.team_name ? ` in team "${conflictingParticipant.team_name}"` : ''} for this event`
        };
      }

      // Get leader's info to include in team_members array
      const { data: leaderInfo } = await supabaseAdmin
        .from("users")
        .select("email, name")
        .eq("uid", user.uid)
        .single();

      // Create complete team_members array including the leader
      const completeTeamMembers = [
        { email: leaderInfo?.email || session.user.email, name: leaderInfo?.name || session.user.name },
        ...registration.team_members
      ];

      // Register team leader
      const { data: leaderParticipant, error: leaderError } = await supabaseAdmin
        .from("participants")
        .insert([
          {
            event_id: registration.event_id,
            user_id: user.uid,
            status: "registered",
            team_name: registration.team_name,
            team_members: completeTeamMembers,
            is_team_leader: true,
          },
        ])
        .select()
        .single();

      if (leaderError) {
        console.error("Error creating team leader:", leaderError);
        return { success: false, error: "Failed to register team" };
      }

      // Register all team members with the complete team list
      const teamMemberInserts = teamMemberUsers.map(member => ({
        event_id: registration.event_id,
        user_id: member.uid,
        status: "registered",
        team_name: registration.team_name,
        team_members: completeTeamMembers,
        is_team_leader: false,
      }));

      const { error: teamMembersError } = await supabaseAdmin
        .from("participants")
        .insert(teamMemberInserts);

      if (teamMembersError) {
        console.error("Error creating team members:", teamMembersError);
        // Rollback
        await supabaseAdmin
          .from("participants")
          .delete()
          .eq("id", leaderParticipant.id);
        
        return { success: false, error: "Failed to register team members" };
      }

      // Increment participant count
      await supabaseAdmin
        .from("events")
        .update({ participantcount: event.participantcount + totalTeamSize })
        .eq("id", registration.event_id);

      revalidatePath("/dashboard/events");
      revalidatePath("/admin-dashboard");

      return { success: true, data: leaderParticipant };
    }

    // Individual registration
    const { data: participant, error: participantError } = await supabaseAdmin
      .from("participants")
      .insert([
        {
          event_id: registration.event_id,
          user_id: user.uid,
          status: "registered",
          team_name: null,
          team_members: null,
          is_team_leader: false,
        },
      ])
      .select()
      .single();

    if (participantError) {
      console.error("Error creating participant:", participantError);
      return { success: false, error: "Failed to register for event" };
    }

    // Increment participant count
    await supabaseAdmin
      .from("events")
      .update({ participantcount: event.participantcount + 1 })
      .eq("id", registration.event_id);

    revalidatePath("/dashboard/events");
    revalidatePath("/admin-dashboard");

    return { success: true, data: participant };
  } catch (error: any) {
    console.error("Error in registerForEvent:", error);
    return { success: false, error: "Internal server error" };
  }
}

// Update participant status (Admin only)
export async function updateParticipantStatus(
  participantId: string,
  updates: { status?: string; team_name?: string }
): Promise<ActionResult> {
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

    const { data: participant, error } = await supabaseAdmin
      .from("participants")
      .update(updates)
      .eq("id", participantId)
      .select()
      .single();

    if (error) {
      console.error("Error updating participant:", error);
      return { success: false, error: "Failed to update participant" };
    }

    revalidatePath("/admin-dashboard");

    return { success: true, data: participant };
  } catch (error: any) {
    console.error("Error in updateParticipantStatus:", error);
    return { success: false, error: "Internal server error" };
  }
}

// Delete participant (cancel registration)
export async function deleteParticipant(participantId: string): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    // Get participant info
    const { data: participant } = await supabaseAdmin
      .from("participants")
      .select("event_id, user_id, users:user_id(email)")
      .eq("id", participantId)
      .single();

    if (!participant) {
      return { success: false, error: "Participant not found" };
    }

    // Check if user is admin or the participant themselves
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("uid, is_admin")
      .eq("email", session.user.email)
      .single();

    const isAdmin = userData?.is_admin === 1;
    const isOwnRegistration = userData?.uid === participant.user_id;

    if (!isAdmin && !isOwnRegistration) {
      return { success: false, error: "Forbidden - Cannot cancel another user's registration" };
    }

    const { error } = await supabaseAdmin
      .from("participants")
      .delete()
      .eq("id", participantId);

    if (error) {
      console.error("Error deleting participant:", error);
      return { success: false, error: "Failed to cancel registration" };
    }

    // Decrement participant count
    await supabaseAdmin.rpc('decrement_participant_count', {
      event_id_param: participant.event_id
    });

    revalidatePath("/dashboard/events");
    revalidatePath("/admin-dashboard");

    return { success: true, data: { id: participantId } };
  } catch (error: any) {
    console.error("Error in deleteParticipant:", error);
    return { success: false, error: "Internal server error" };
  }
}
