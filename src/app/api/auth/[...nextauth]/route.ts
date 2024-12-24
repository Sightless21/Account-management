/* eslint-disable @typescript-eslint/prefer-as-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { create } from 'domain'

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (
          user &&
          ( await bcrypt.compare(credentials.password, user.hashedPassword || '') )
        ) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role : user.role,
            createdAt : user.createdAt
          }
        } else {
          throw new Error('Invalid email or password')
        }
      },
    })
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt' as 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user }: { token: any, user?: any }) => {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.createdAt = user.createdAt
      }
      return token
    },
    session: async ({ session, token }: { session: any, token: any }) => {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.createdAt = token.createdAt
      }
      return session
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }