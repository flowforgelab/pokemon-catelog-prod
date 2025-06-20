import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log("🚀 Direct Google sign-in route called");
    
    // Import and use the auth handlers directly
    const { auth } = await import('@/lib/auth-memory');
    const { toNextJsHandler } = await import('better-auth/next-js');
    
    const handlers = toNextJsHandler(auth);
    
    console.log("🚀 Calling Better Auth handler for Google sign-in");
    return await handlers.GET(request);
    
  } catch (error) {
    console.error("❌ Direct Google sign-in failed:", error);
    return NextResponse.json({
      error: "Google sign-in failed",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}