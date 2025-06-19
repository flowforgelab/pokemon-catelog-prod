import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  const startTime = Date.now()
  
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 3000,
    })
    
    // Simple query with timeout
    const result = await pool.query('SELECT NOW() as time, current_database() as db')
    await pool.end()
    
    return NextResponse.json({
      success: true,
      database: result.rows[0].db,
      serverTime: result.rows[0].time,
      connectionTime: Date.now() - startTime,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      connectionTime: Date.now() - startTime,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
    })
  }
}