import { betterAuth, string } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
import { emailOTP } from 'better-auth/plugins'

const isDevelopment = process.env.NODE_ENV === "development"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  session: {
    expiresIn: 60 * 30,
    updateAge: 60 * 30
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      clubId: {
        type: "string"
      },
    }
  },
  trustedOrigins: isDevelopment
    ? [
      "https://localhost:3000",
      "http://localhost:3000",
      "https://*.app.github.dev", // Aceita qualquer URL do Codespaces
    ]
    : [process.env.BETTER_AUTH_URL || "https://seu-dominio.com"],
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
      },
    })
  ]
})