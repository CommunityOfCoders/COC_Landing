import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabaseAdmin } from "./supabase-admin"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      console.log('SignIn attempt for:', profile?.email);

      if (account?.provider === "google" && profile?.email) {
        // Check if email ends with .vjti.ac.in
        if (!profile.email.endsWith('.vjti.ac.in')) {
          return false;
        }
        //extract dep and year from email
        const dep = profile.email.split('@')[1].split('.')[0];
        const match = profile.email.match(/_?b(\d+)@/);
        const year = match ? parseInt(match[1], 10) + 2000 : null;

        // console.log(`Extracted department: ${dep}, year: ${year} from email: ${profile.email}`);
        // Sync user to Supabase
        try {
          const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('uid, is_admin')
            .eq('email', profile.email)
            .single();

          if (!existingUser) {
            // Create new user in Supabase with explicit is_admin = 0
            await supabaseAdmin
              .from('users')
              .insert([{
                email: profile.email,
                name: profile.name || user.name,
                picture: profile.image || user.image,
                branch:dep,
                year: year,
                is_admin: 0, // Explicitly set to 0, can only be changed via Supabase
              }]);
          } else {
            // Update existing user
            await supabaseAdmin
              .from('users')
              .update({
                name: profile.name || user.name,
                picture: profile.image || user.image,
                branch:dep,
                year: year,
              })
              .eq('email', profile.email);
          }
        } catch (error) {
          console.error('Error syncing user to Supabase:', error);
          // Don't block sign in if Supabase sync fails
        }

        return true;
      }
      return false;
    },
    async jwt({ token, user, trigger, session }) {
      // Fetch user's admin status from Supabase only on initial sign in
      // Subsequent requests will use the cached value in the JWT token
      if (user) {
        // Initial sign in - fetch admin status
        try {
          const { data: userData } = await supabaseAdmin
            .from('users')
            .select('is_admin')
            .eq('email', token.email)
            .single();

          if (userData) {
            token.isAdmin = userData.is_admin === 1;
          }
        } catch (error) {
          console.error('Error fetching user admin status:', error);
          token.isAdmin = false;
        }
      }

      // Handle session updates (e.g., when admin status changes)
      if (session && trigger === 'update') {
        token.isAdmin = session.isAdmin;
      }

      return token;
    },
    async session({ session, token }) {
      // Add isAdmin to session
      if (session.user) {
        session.user.isAdmin = token.isAdmin || false;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // For callback redirects after sign in, redirect to dashboard
      // The middleware will handle routing admins to admin-dashboard
      if (url.includes('/api/auth/callback')) {
        return baseUrl + "/dashboard";
      }

      // Handle other redirects
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl + "/dashboard";
    },
  },
}