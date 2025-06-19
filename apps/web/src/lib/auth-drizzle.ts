import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    }
  },

  // Configure social providers (keeping Google OAuth)
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // Environment configuration
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || "https://pokemon-catelog-prod.vercel.app",
  secret: process.env.BETTER_AUTH_SECRET || process.env.NEXTAUTH_SECRET!,

  // Add Next.js cookies plugin for proper cookie handling
  plugins: [nextCookies()],
});