import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

    // Admin-only routes protection
    if (isAdminRoute) {
      // For Cloudflare Pages compatibility, admin check is done client-side
      // Middleware only protects the route with authentication
      // The page itself will check admin status from the JWT token
      if (!token.isAdmin) {
        // Non-admin users trying to access admin dashboard - redirect to regular dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Allow admins to access both /dashboard and /admin-dashboard
    // No redirect needed for admins accessing regular dashboard
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin-dashboard/:path*"],
};