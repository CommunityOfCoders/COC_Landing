// In app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import auth from "@/app/actions/auth/auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ account, profile }) {
      // Check if signing in with Google and email ends with .vjti.ac.in
      if (account?.provider === "google" && profile?.email) {
        const isVjtiEmail = profile.email.endsWith('.vjti.ac.in');
        if(isVjtiEmail){
          const res = await auth(profile);
          if(res.status === 'ok'){
            return true;
          } else {
            console.log("Auth function returned not ok");
            return false;
          }
        }
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl + "/dashboard";
    },
    async session({ session, token }) {
      // Add user id to session
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };