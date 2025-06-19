import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  // Use a simpler database configuration that works with existing schema
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL!,
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  // Configure social providers (keeping Google OAuth)
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // Environment configuration
  baseURL: process.env.BETTER_AUTH_URL || "https://pokemon-catelog-prod.vercel.app",
  secret: process.env.BETTER_AUTH_SECRET!,

  // Add Next.js cookies plugin for proper cookie handling
  plugins: [nextCookies()],
  
  // Add error handling
  logger: {
    level: "error",
    disabled: false,
  },
});