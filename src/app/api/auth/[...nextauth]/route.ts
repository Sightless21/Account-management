/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@doe.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        // console.log("user : ", user); ✅ Debug

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.hashedPassword))
        ) {
          return {
            id: user.id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          };
        } else {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as "jwt" | "database",
  },
  callbacks: {
    jwt: async ({ token, user }: { token: any; user: any }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      // console.log("JWT Token : ",token) ✅ Debug
      return token;
    },
    session: async ({ session, token }: { token: any; session: any }) => {
      // console.log("Token in session callback:", token); ✅ Debug
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      // console.log("Session after setting id:", JSON.stringify(session, null, 2)); // ✅ Debug ค่า session
      return session;
      
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
