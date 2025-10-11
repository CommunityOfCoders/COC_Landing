'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

type ActionResult<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Search for a user by email
export async function searchUserByEmail(email: string): Promise<ActionResult<{ exists: boolean; user: any | null }>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    if (!email) {
      return { success: false, error: "Email is required" };
    }

    // Search for user by email
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("email, name, picture")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return { success: true, data: { exists: false, user: null } };
      }
      console.error("Error searching user:", error);
      return { success: false, error: "Failed to search user" };
    }

    return { success: true, data: { exists: true, user } };
  } catch (error: any) {
    console.error("Error in searchUserByEmail:", error);
    return { success: false, error: "Internal server error" };
  }
}

// Get current user profile
export async function getCurrentUserProfile(): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("uid, name, email, picture, phone, year, branch, created_at, is_admin, graduated")
      .eq("email", session.user.email)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return { success: false, error: "User not found" };
    }

    return { success: true, data: user };
  } catch (error: any) {
    console.error("Error in getCurrentUserProfile:", error);
    return { success: false, error: "Internal server error" };
  }
}

// Get all users (Admin only)
export async function getAllUsers(): Promise<ActionResult<any[]>> {
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

    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return { success: false, error: "Failed to fetch users" };
    }

    return { success: true, data: users };
  } catch (error: any) {
    console.error("Error in getAllUsers:", error);
    return { success: false, error: "Internal server error" };
  }
}
