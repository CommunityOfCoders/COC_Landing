// In app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Use the shared `authOptions` from `lib/auth.ts`. Next.js Route files
// should only export valid Route handlers (GET, POST, etc.). Exporting
// arbitrary values like `authOptions` from a Route file causes type errors
// during build.
const handler = NextAuth(authOptions as any)
export { handler as GET, handler as POST }