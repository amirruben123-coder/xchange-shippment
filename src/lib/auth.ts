import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.wallet = (user as any).wallet
        token.points = (user as any).points
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
        ;(session.user as any).wallet = token.wallet
        ;(session.user as any).points = token.points
      }
      return session
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user || user.status === 'SUSPENDED') return null
        const ok = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!ok) return null
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          wallet: Number(user.wallet),
          points: user.points,
        }
      },
    }),
  ],
})
