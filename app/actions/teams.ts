'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

type ActionResult<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string };

// GET user's team for an event
export async function getMyTeam(eventId: string): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("uid")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Get participant with team info
    const { data: participant, error } = await supabaseAdmin
      .from("participants")
      .select(`
        *,
        users:user_id (
          name,
          email,
          picture
        )
      `)
      .eq("event_id", eventId)
      .eq("user_id", user.uid)
      .single();

    if (error || !participant) {
      return { success: false, error: "Not registered for this event" };
    }

    return { success: true, data: participant };
  } catch (error: any) {
    console.error("Error in getMyTeam:", error);
    return { success: false, error: "Internal server error" };
  }
}

// ADD a team member (Team leader only)
export async function addTeamMember(
  eventId: string,
  memberEmail: string
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    if (!eventId || !memberEmail) {
      return { success: false, error: "Event ID and member email are required" };
    }

    // Get current user
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("uid, email")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Check if user is team leader
    const { data: leaderParticipant, error: leaderError } = await supabaseAdmin
      .from("participants")
      .select("id, team_name, team_members, is_team_leader")
      .eq("event_id", eventId)
      .eq("user_id", user.uid)
      .single();

    if (leaderError || !leaderParticipant) {
      return { success: false, error: "Not registered for this event" };
    }

    if (!leaderParticipant.is_team_leader) {
      return { success: false, error: "Only team leaders can add members" };
    }

    // Get event info for team size limits
    const { data: event } = await supabaseAdmin
      .from("events")
      .select("max_team_size, min_team_size, participantcount, maxparticipants")
      .eq("id", eventId)
      .single();

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    // Check team size limit (team_members now includes leader)
    const currentTeamSize = leaderParticipant.team_members?.length || 0;
    if (currentTeamSize >= event.max_team_size) {
      return {
        success: false,
        error: `Team is already at maximum size (${event.max_team_size})`
      };
    }

    // Check if event is full
    if (event.participantcount >= event.maxparticipants) {
      return { success: false, error: "Event is full" };
    }

    // Get new member user
    const { data: newMember } = await supabaseAdmin
      .from("users")
      .select("uid, email, name")
      .eq("email", memberEmail)
      .single();

    if (!newMember) {
      return { success: false, error: "Member not found. User must be registered." };
    }

    // Check if member is already registered
    const { data: existingParticipant } = await supabaseAdmin
      .from("participants")
      .select("id, team_name")
      .eq("event_id", eventId)
      .eq("user_id", newMember.uid)
      .single();

    if (existingParticipant) {
      return {
        success: false,
        error: `${memberEmail} is already registered${existingParticipant.team_name ? ` in team "${existingParticipant.team_name}"` : ''} for this event`
      };
    }

    // Update team members array for all team participants
    const updatedTeamMembers = [
      ...(leaderParticipant.team_members || []),
      { email: newMember.email, name: newMember.name },
    ];

    // Update all existing team members
    const { error: updateError } = await supabaseAdmin
      .from("participants")
      .update({ team_members: updatedTeamMembers })
      .eq("event_id", eventId)
      .eq("team_name", leaderParticipant.team_name);

    if (updateError) {
      console.error("Error updating team members:", updateError);
      return { success: false, error: "Failed to update team" };
    }

    // Register new member
    const { error: insertError } = await supabaseAdmin
      .from("participants")
      .insert([{
        event_id: eventId,
        user_id: newMember.uid,
        status: "registered",
        team_name: leaderParticipant.team_name,
        team_members: updatedTeamMembers,
        is_team_leader: false,
      }]);

    if (insertError) {
      console.error("Error registering new member:", insertError);
      return { success: false, error: "Failed to add team member" };
    }

    // Increment participant count
    await supabaseAdmin
      .from("events")
      .update({ participantcount: event.participantcount + 1 })
      .eq("id", eventId);

    revalidatePath("/dashboard/events");

    return { 
      success: true,
      data: { 
        message: "Team member added successfully",
        team_members: updatedTeamMembers 
      }
    };
  } catch (error: any) {
    console.error("Error in addTeamMember:", error);
    return { success: false, error: "Internal server error" };
  }
}

// REMOVE a team member (Team leader only)
export async function removeTeamMember(
  eventId: string,
  memberEmail: string
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    if (!eventId || !memberEmail) {
      return { success: false, error: "Event ID and member email are required" };
    }

    // Get current user
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("uid, email")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Check if user is team leader
    const { data: leaderParticipant, error: leaderError } = await supabaseAdmin
      .from("participants")
      .select("id, team_name, team_members, is_team_leader")
      .eq("event_id", eventId)
      .eq("user_id", user.uid)
      .single();

    if (leaderError || !leaderParticipant) {
      return { success: false, error: "Not registered for this event" };
    }

    if (!leaderParticipant.is_team_leader) {
      return { success: false, error: "Only team leaders can remove members" };
    }

    // Get event info for team size limits
    const { data: event } = await supabaseAdmin
      .from("events")
      .select("min_team_size, participantcount")
      .eq("id", eventId)
      .single();

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    // Get member to remove
    const { data: memberToRemove } = await supabaseAdmin
      .from("users")
      .select("uid, email")
      .eq("email", memberEmail)
      .single();

    if (!memberToRemove) {
      return { success: false, error: "Member not found" };
    }

    // Update team members array (now includes leader, so just filter)
    const updatedTeamMembers = (leaderParticipant.team_members || []).filter(
      (m: any) => m.email !== memberEmail
    );

    const currentTeamSize = leaderParticipant.team_members?.length || 0;
    const newTeamSize = updatedTeamMembers.length;
    const wouldBeUnderMinimum = newTeamSize < event.min_team_size;

    if (wouldBeUnderMinimum) {
      // Unregister entire team
      const { error: deleteTeamError } = await supabaseAdmin
        .from("participants")
        .delete()
        .eq("event_id", eventId)
        .eq("team_name", leaderParticipant.team_name);

      if (deleteTeamError) {
        console.error("Error unregistering team:", deleteTeamError);
        return { success: false, error: "Failed to unregister team" };
      }

      // Decrement participant count by the number of team members
      await supabaseAdmin
        .from("events")
        .update({ participantcount: Math.max(0, event.participantcount - currentTeamSize) })
        .eq("id", eventId);

      revalidatePath("/dashboard/events");

      return { 
        success: true,
        data: { 
          message: "Team unregistered (below minimum size)",
          unregistered: true
        }
      };
    }

    // Update all remaining team members
    const { error: updateError } = await supabaseAdmin
      .from("participants")
      .update({ team_members: updatedTeamMembers })
      .eq("event_id", eventId)
      .eq("team_name", leaderParticipant.team_name);

    if (updateError) {
      console.error("Error updating team members:", updateError);
      return { success: false, error: "Failed to update team" };
    }

    // Remove member's participant record
    const { error: deleteError } = await supabaseAdmin
      .from("participants")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", memberToRemove.uid);

    if (deleteError) {
      console.error("Error removing member:", deleteError);
      return { success: false, error: "Failed to remove team member" };
    }

    // Decrement participant count
    await supabaseAdmin
      .from("events")
      .update({ participantcount: Math.max(0, event.participantcount - 1) })
      .eq("id", eventId);

    revalidatePath("/dashboard/events");

    return { 
      success: true,
      data: { 
        message: "Team member removed successfully",
        team_members: updatedTeamMembers 
      }
    };
  } catch (error: any) {
    console.error("Error in removeTeamMember:", error);
    return { success: false, error: "Internal server error" };
  }
}
