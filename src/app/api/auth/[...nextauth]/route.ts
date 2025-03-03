/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Session } from "next-auth";
interface CustomUser  {
  id: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  hashedPassword?: string;
  profileImage?: string | null;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@doe.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        }) as CustomUser | null;
        // console.log("user : ", user); //✅ Debug

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.hashedPassword?? ""))
        ) {
          return {
            id: user.id.toString(),
            role: user.role.toString(),
            profileImage: user.profileImage || null, // แนบ URL รูปโปรไฟล์ (ถ้ามี)
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
        token.role = user.role as string;
        token.profileImage = user.profileImage;
      }
      return token;
    },
    session: async ({ session, token }: { session: Session; token: any }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.profileImage = token.profileImage;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
