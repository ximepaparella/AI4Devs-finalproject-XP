import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call your backend API for authentication
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          if (response.data) {
            // Return the user object and token
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: `${response.data.user.firstName} ${response.data.user.lastName}`,
              role: response.data.user.role,
              token: response.data.token,
            };
          }
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to the token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user info to the session
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions); 