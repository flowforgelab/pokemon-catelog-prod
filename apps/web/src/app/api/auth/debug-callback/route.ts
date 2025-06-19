import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// Debug endpoint to check OAuth callback data
export async function GET(request: NextRequest) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

  try {
    const client = await pool.connect()
    
    // Get recent accounts and sessions
    const accountsResult = await client.query(`
      SELECT a.*, u.email 
      FROM "Account" a 
      JOIN "User" u ON a."userId" = u.id 
      ORDER BY a.id DESC 
      LIMIT 5
    `)
    
    const sessionsResult = await client.query(`
      SELECT s.*, u.email 
      FROM "Session" s 
      JOIN "User" u ON s."userId" = u.id 
      ORDER BY s.id DESC 
      LIMIT 5
    `)
    
    const usersResult = await client.query(`
      SELECT id, email, name, "emailVerified", "createdAt" 
      FROM "User" 
      ORDER BY "createdAt" DESC 
      LIMIT 5
    `)
    
    client.release()
    
    return NextResponse.json({
      accounts: accountsResult.rows,
      sessions: sessionsResult.rows,
      users: usersResult.rows,
      env: {
        nextAuthUrl: process.env.NEXTAUTH_URL,
        googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
        nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
      }
    })
  } catch (error) {
    console.error('Debug callback error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  } finally {
    await pool.end()
  }
}