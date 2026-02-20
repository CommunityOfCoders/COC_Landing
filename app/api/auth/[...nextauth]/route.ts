// In app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Use the shared `authOptions` from `lib/auth.ts`. Next.js Route files
// should only export valid Route handlers (GET, POST, etc.). Exporting
// arbitrary values like `authOptions` from a Route file causes type errors
// during build.

// Note: For Cloudflare Pages compatibility, this route needs edge runtime
// but NextAuth v4 has crypto dependencies. Consider upgrading to Auth.js v5
// or using a different auth solution for full edge compatibility.
// export const runtime = 'edge'

const handler = NextAuth(authOptions as any)
export { handler as GET, handler as POST }