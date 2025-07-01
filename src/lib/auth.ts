import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

// Extended user type for custom properties
interface ExtendedUser {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
  phone?: string
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          return null
        }

        try {
          const otpRecord = await prisma.otpCode.findFirst({
            where: {
              phone: credentials.phone,
              code: credentials.otp,
              verified: false,
              expiresAt: {
                gt: new Date()
              }
            }
          })

          if (!otpRecord) {
            return null
          }

          await prisma.otpCode.update({
            where: { id: otpRecord.id },
            data: { verified: true }
          })

          let user = await prisma.user.findUnique({
            where: { phone: credentials.phone }
          })

          if (!user) {
            user = await prisma.user.create({
              data: {
                phone: credentials.phone,
                name: `User ${credentials.phone}`
              }
            })
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.image
          }
        } catch (error) {
          console.error("Phone OTP authorization error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Type assertion for custom user properties
        const customUser = user as ExtendedUser
        token.role = customUser.role
        token.phone = customUser.phone
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // Type assertion for custom session properties
        const customUser = session.user as ExtendedUser
        customUser.id = token.sub!
        customUser.role = token.role as string
        customUser.phone = token.phone as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  session: {
    strategy: "jwt"
  }
}