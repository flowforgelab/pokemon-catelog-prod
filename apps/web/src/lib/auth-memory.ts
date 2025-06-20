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
      // Explicitly set the scopes that Better Auth needs
      scope: ["openid", "email", "profile"],
    },
  },

  // Environment configuration - ensure consistent with client
  baseURL: process.env.BETTER_AUTH_URL || "https://pokemon-catelog-prod.vercel.app",
  secret: process.env.BETTER_AUTH_SECRET!,

  // Add Next.js cookies plugin
  plugins: [nextCookies()],

  // Disable database adapter entirely - use cookie-based sessions
  trustedOrigins: ["https://pokemon-catelog-prod.vercel.app"],
  
  // Add comprehensive error handling and logging
  logger: {
    level: "debug", // More verbose logging for OAuth debugging
    disabled: false,
  },
  
  // Add advanced configuration for OAuth debugging
  advanced: {
    generateId: () => crypto.randomUUID(),
    crossSubDomainCookies: {
      enabled: false, // Disable for single domain
    }
  },
});