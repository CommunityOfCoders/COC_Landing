import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin-dashboard");
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  
  // Protect dashboard and admin routes
  if (isDashboardRoute || isAdminRoute) {
    // Redirect to sign in if not authenticated
    if (!token) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Verify VJTI email
    if (token.email && !token.email.endsWith('.vjti.ac.in')) {
      return NextResponse.redirect(new URL("/auth/error", request.url));
    }

    // Check admin status directly from Supabase
    if (token.email) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        );

        const { data: userData, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('email', token.email)
          .single();

        const isAdmin = userData?.is_admin === 1;

        // Admin-only routes protection
        if (isAdminRoute) {
          if (!isAdmin) {
            // Non-admin users trying to access admin dashboard - redirect to regular dashboard
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
        }
        
        // Allow admins to access both /dashboard and /admin-dashboard
        // No redirect needed for admins accessing regular dashboard
      } catch (error) {
        console.error('Error checking admin status in middleware:', error);
        // If there's an error, allow regular dashboard access but not admin
        if (isAdminRoute) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin-dashboard/:path*"],
};