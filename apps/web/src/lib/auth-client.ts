"use client";

import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: 
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BASE_URL || 
    (typeof window !== 'undefined' ? window.location.origin : '') ||
    'https://pokemon-catelog-prod.vercel.app',
});

// Export commonly used methods with the same API as NextAuth
export const {
  signIn,
  signOut,
  useSession,
  signUp,
  getSession,
} = authClient;

// Export the full client for advanced usage
export { authClient };