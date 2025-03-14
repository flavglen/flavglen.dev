import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// add role and id to the user object
declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      role: string | undefined | unknown
      id: string | undefined
    } & DefaultSession["user"]
  }
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }), 
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token; // Store Google access token in JWT
      }

      // Usually we would do a database lookup here to get the user's role
      if(user?.email && process.env.ROLE_ADMIN_EMAIL) {
        if(process.env.ROLE_ADMIN_EMAIL.includes(user.email)) {
          token.role = "admin";
        }
      }

      return token;
    },
    async session({ session, token }) {
      if(session?.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
} as AuthOptions;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };