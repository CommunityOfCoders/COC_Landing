import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/participants - Get all participants (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("event_id");
    const userId = searchParams.get("user_id");

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
          category
        ),
        users:user_id (
          uid,
          name,
          email,
          picture
        )
      `)
      .order("created_at", { ascending: false });

    if (eventId) {
      query = query.eq("event_id", eventId);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: participants, error } = await query;

    if (error) {
      console.error("Error fetching participants:", error);
      return NextResponse.json(
        { error: "Failed to fetch participants" },
        { status: 500 }
      );
    }

    return NextResponse.json({ participants });
  } catch (error) {
    console.error("Error in GET /api/participants:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/participants - Register for an event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("uid")
      .eq("email", session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { event_id, team_name, team_members } = body;

    if (!event_id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Check if event exists and is open for registration
    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("id, registrationstatus, maxparticipants, participantcount, team_event, max_team_size, min_team_size")
      .eq("id", event_id)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    if (!event.registrationstatus) {
      return NextResponse.json(
        { error: "Event registration is closed" },
        { status: 400 }
      );
    }

    if (event.participantcount >= event.maxparticipants) {
      return NextResponse.json(
        { error: "Event is full" },
        { status: 400 }
      );
    }

    // Check if user is already registered (in any team or individually)
    const { data: existingRegistration } = await supabaseAdmin
      .from("participants")
      .select("id, team_name")
      .eq("event_id", event_id)
      .eq("user_id", user.uid)
      .single();

    if (existingRegistration) {
      return NextResponse.json(
        { error: existingRegistration.team_name 
          ? `You are already part of team "${existingRegistration.team_name}" for this event`
          : "You are already registered for this event" 
        },
        { status: 400 }
      );
    }

    // Validate team requirements
    if (event.team_event) {
      if (!team_name) {
        return NextResponse.json(
          { error: "Team name is required for this event" },
          { status: 400 }
        );
      }
      
      if (!team_members || !Array.isArray(team_members)) {
        return NextResponse.json(
          { error: "Team members are required for this event" },
          { status: 400 }
        );
      }

      // Validate team size
      const totalTeamSize = team_members.length + 1; // +1 for the team leader
      if (totalTeamSize < event.min_team_size || totalTeamSize > event.max_team_size) {
        return NextResponse.json(
          { error: `Team size must be between ${event.min_team_size} and ${event.max_team_size} members` },
          { status: 400 }
        );
      }

      // Validate team member emails
      const teamMemberEmails = team_members.map((m: any) => m.email);
      
      // Check if team leader is in team members list
      if (teamMemberEmails.includes(session.user.email)) {
        return NextResponse.json(
          { error: "You don't need to add yourself to the team members list" },
          { status: 400 }
        );
      }

      // Verify all team members exist and are not already registered
      const { data: teamMemberUsers, error: teamMemberError } = await supabaseAdmin
        .from("users")
        .select("uid, email")
        .in("email", teamMemberEmails);

      if (teamMemberError || !teamMemberUsers || teamMemberUsers.length !== teamMemberEmails.length) {
        return NextResponse.json(
          { error: "One or more team member emails are not registered users" },
          { status: 400 }
        );
      }

      // Check if any team member is already registered for this event
      const { data: existingTeamMembers } = await supabaseAdmin
        .from("participants")
        .select("user_id, team_name")
        .eq("event_id", event_id)
        .in("user_id", teamMemberUsers.map(u => u.uid));

      if (existingTeamMembers && existingTeamMembers.length > 0) {
        const conflictingMember = teamMemberUsers.find(
          u => existingTeamMembers.some(p => p.user_id === u.uid)
        );
        const conflictingParticipant = existingTeamMembers.find(
          p => p.user_id === conflictingMember?.uid
        );
        return NextResponse.json(
          { error: `${conflictingMember?.email} is already registered${conflictingParticipant?.team_name ? ` in team "${conflictingParticipant.team_name}"` : ''} for this event` },
          { status: 400 }
        );
      }

      // Register team leader
      const { data: leaderParticipant, error: leaderError } = await supabaseAdmin
        .from("participants")
        .insert([
          {
            event_id,
            user_id: user.uid,
            status: "registered",
            team_name,
            team_members,
            is_team_leader: true,
          },
        ])
        .select()
        .single();

      if (leaderError) {
        console.error("Error creating team leader:", leaderError);
        return NextResponse.json(
          { error: "Failed to register team", details: leaderError.message },
          { status: 500 }
        );
      }

      // Register all team members
      const teamMemberInserts = teamMemberUsers.map(member => ({
        event_id,
        user_id: member.uid,
        status: "registered",
        team_name,
        team_members,
        is_team_leader: false,
      }));

      const { error: teamMembersError } = await supabaseAdmin
        .from("participants")
        .insert(teamMemberInserts);

      if (teamMembersError) {
        console.error("Error creating team members:", teamMembersError);
        // Rollback: delete the team leader registration
        await supabaseAdmin
          .from("participants")
          .delete()
          .eq("id", leaderParticipant.id);
        
        return NextResponse.json(
          { error: "Failed to register team members", details: teamMembersError.message },
          { status: 500 }
        );
      }

      // Increment participant count by total team size
      const { error: updateError } = await supabaseAdmin
        .from("events")
        .update({ participantcount: event.participantcount + totalTeamSize })
        .eq("id", event_id);

      if (updateError) {
        console.error("Error updating participant count:", updateError);
      }

      return NextResponse.json({ participant: leaderParticipant, message: "Team registered successfully" }, { status: 201 });
    }

    // Individual registration (non-team event)
    const { data: participant, error: participantError } = await supabaseAdmin
      .from("participants")
      .insert([
        {
          event_id,
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
      return NextResponse.json(
        { error: "Failed to register for event", details: participantError.message },
        { status: 500 }
      );
    }

    // Increment participant count
    const { error: updateError } = await supabaseAdmin
      .from("events")
      .update({ participantcount: event.participantcount + 1 })
      .eq("id", event_id);

    if (updateError) {
      console.error("Error updating participant count:", updateError);
    }

    return NextResponse.json({ participant }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/participants:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
