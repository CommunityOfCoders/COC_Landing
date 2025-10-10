import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: events, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error in GET /api/events:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("is_admin")
      .eq("email", session.user.email)
      .single();

    if (userData?.is_admin !== 1) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      date,
      time,
      location,
      maxParticipants,
      registrationStatus,
      category,
      organizer,
      tags,
      requirements,
      imageUrl,
      teamEvent,
      maxTeamSize,
      minTeamSize,
    } = body;

    // Validate required fields
    if (!title || !description || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: event, error } = await supabaseAdmin
      .from("events")
      .insert([
        {
          title,
          description,
          date: date || new Date().toISOString().split('T')[0],
          time,
          location,
          maxparticipants: maxParticipants || 100,
          registrationstatus: registrationStatus || 'upcoming',
          category: category || "workshop",
          organizer: organizer || "COC",
          tags: tags || [],
          requirements: requirements || [],
          imageurl: imageUrl,
          participantcount: 0,
          team_event: teamEvent ?? false,
          max_team_size: maxTeamSize || 1,
          min_team_size: minTeamSize || 1,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating event:", error);
      return NextResponse.json(
        { error: "Failed to create event", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/events:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
