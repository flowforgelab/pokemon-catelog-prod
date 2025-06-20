import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

let authHandlers: { GET: any; POST: any } | null = null;
let initError: Error | null = null;

try {
  const { auth } = require("@/lib/auth-memory");
  authHandlers = toNextJsHandler(auth);
  console.log("✅ Better Auth handlers created successfully with memory sessions");
} catch (error) {
  initError = error instanceof Error ? error : new Error('Unknown initialization error');
  console.error("❌ Failed to create Better Auth handlers:", error);
  console.error("❌ Full initialization error:", {
    message: initError.message,
    stack: initError.stack,
    timestamp: new Date().toISOString()
  });
}

export async function GET(request: NextRequest) {
  try {
    if (!authHandlers) {
      console.error("❌ Auth handlers not initialized");
      return NextResponse.json(
        { 
          error: "Authentication not initialized", 
          details: "Auth handlers failed to load",
          initError: initError?.message || "Unknown initialization error",
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
    
    // Log OAuth callback attempts for debugging
    const url = new URL(request.url);
    if (url.pathname.includes('/callback/')) {
      console.log("🔍 OAuth Callback Request:", {
        pathname: url.pathname,
        searchParams: Object.fromEntries(url.searchParams),
        timestamp: new Date().toISOString()
      });
    }
    
    return await authHandlers.GET(request);
  } catch (error) {
    console.error("❌ GET request failed:", error);
    console.error("❌ Full error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      url: request.url,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: "Authentication request failed", 
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!authHandlers) {
      console.error("❌ Auth handlers not initialized");
      return NextResponse.json(
        { error: "Authentication not initialized", details: "Auth handlers failed to load" },
        { status: 500 }
      );
    }
    return await authHandlers.POST(request);
  } catch (error) {
    console.error("❌ POST request failed:", error);
    return NextResponse.json(
      { 
        error: "Authentication request failed", 
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}