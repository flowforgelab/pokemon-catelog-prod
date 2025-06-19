import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

let authHandlers: { GET: any; POST: any } | null = null;

try {
  const { auth } = require("@/lib/auth-drizzle");
  authHandlers = toNextJsHandler(auth);
  console.log("✅ Drizzle Better Auth handlers created successfully");
} catch (error) {
  console.error("❌ Failed to create Drizzle Better Auth handlers:", error);
}

export async function GET(request: NextRequest) {
  try {
    if (!authHandlers) {
      console.error("❌ Drizzle auth handlers not initialized");
      return NextResponse.json(
        { error: "Drizzle authentication not initialized", details: "Auth handlers failed to load" },
        { status: 500 }
      );
    }
    return await authHandlers.GET(request);
  } catch (error) {
    console.error("❌ Drizzle GET request failed:", error);
    return NextResponse.json(
      { 
        error: "Drizzle authentication request failed", 
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
      console.error("❌ Drizzle auth handlers not initialized");
      return NextResponse.json(
        { error: "Drizzle authentication not initialized", details: "Auth handlers failed to load" },
        { status: 500 }
      );
    }
    return await authHandlers.POST(request);
  } catch (error) {
    console.error("❌ Drizzle POST request failed:", error);
    return NextResponse.json(
      { 
        error: "Drizzle authentication request failed", 
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}