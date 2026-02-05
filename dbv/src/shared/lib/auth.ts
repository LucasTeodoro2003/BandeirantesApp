import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'

const isDevelopment = process.env.NODE_ENV === "development"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: { 
    enabled: true, 
  },
  trustedOrigins: isDevelopment
    ? [
        "https://localhost:3000",
        "http://localhost:3000",
        "https://*.app.github.dev", // Aceita qualquer URL do Codespaces
      ]
    : [process.env.BETTER_AUTH_URL || "https://seu-dominio.com"],
})