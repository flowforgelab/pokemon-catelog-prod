import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  // Use memory/cookie-based sessions instead of database
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day
    }
  },

  // Configure social providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Let Better Auth handle the redirect URI automatically
    },
  },

  // Environment configuration
  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,

  // Add Next.js cookies plugin
  plugins: [nextCookies()],

  // Disable database adapter entirely - use cookie-based sessions
  trustedOrigins: ["https://pokemon-catelog-prod.vercel.app"],
  
  // Add error handling
  logger: {
    level: "error",
    disabled: false,
  },
});