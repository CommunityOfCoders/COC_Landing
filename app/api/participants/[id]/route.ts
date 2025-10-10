import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

// PATCH /api/participants/[id] - Update participant status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database to check admin status
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("uid, is_admin")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();

    // Get the participant to check ownership
    const { data: participant } = await supabaseAdmin
      .from("participants")
      .select("user_id")
      .eq("id", params.id)
      .single();

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    // Only allow user to update their own registration or admin to update any
    if (participant.user_id !== user.uid && user.is_admin !== 1) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: updatedParticipant, error } = await supabaseAdmin
      .from("participants")
      .update(body)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating participant:", error);
      return NextResponse.json(
        { error: "Failed to update participant", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ participant: updatedParticipant });
  } catch (error) {
    console.error("Error in PATCH /api/participants/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/participants/[id] - Cancel registration
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("uid, is_admin")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the participant to check ownership and event_id
    const { data: participant } = await supabaseAdmin
      .from("participants")
      .select("user_id, event_id")
      .eq("id", params.id)
      .single();

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    // Only allow user to delete their own registration or admin to delete any
    if (participant.user_id !== user.uid && user.is_admin !== 1) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the participant
    const { error: deleteError } = await supabaseAdmin
      .from("participants")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      console.error("Error deleting participant:", deleteError);
      return NextResponse.json(
        { error: "Failed to cancel registration", details: deleteError.message },
        { status: 500 }
      );
    }

    // Decrement participant count
    const { data: event } = await supabaseAdmin
      .from("events")
      .select("participantcount")
      .eq("id", participant.event_id)
      .single();

    if (event && event.participantcount > 0) {
      await supabaseAdmin
        .from("events")
        .update({ participantcount: event.participantcount - 1 })
        .eq("id", participant.event_id);
    }

    return NextResponse.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/participants/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
