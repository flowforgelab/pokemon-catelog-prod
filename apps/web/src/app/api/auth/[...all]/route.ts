import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

let authHandlers: { GET: any; POST: any } | null = null;

try {
  const { auth } = require("@/lib/auth-simple");
  authHandlers = toNextJsHandler(auth);
  console.log("✅ Better Auth handlers created successfully with simple config");
} catch (error) {
  console.error("❌ Failed to create Better Auth handlers:", error);
}

export async function GET(request: NextRequest) {
  try {
    if (!authHandlers) {
      console.error("❌ Auth handlers not initialized");
      return NextResponse.json(
        { error: "Authentication not initialized", details: "Auth handlers failed to load" },
        { status: 500 }
      );
    }
    return await authHandlers.GET(request);
  } catch (error) {
    console.error("❌ GET request failed:", error);
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