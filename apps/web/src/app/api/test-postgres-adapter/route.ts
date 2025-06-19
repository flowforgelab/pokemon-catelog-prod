import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// Test the PostgreSQL adapter connection
export async function GET() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

  try {
    // Test connection
    const client = await pool.connect()
    
    // Check tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('User', 'Account', 'Session', 'VerificationToken')
      ORDER BY table_name
    `)
    
    // Get counts
    const counts: Record<string, number> = {}
    
    for (const table of tables.rows) {
      const result = await client.query(`SELECT COUNT(*) FROM "${table.table_name}"`)
      counts[table.table_name] = parseInt(result.rows[0].count)
    }
    
    client.release()
    
    return NextResponse.json({
      success: true,
      tables: tables.rows.map(r => r.table_name),
      counts,
      connectionString: process.env.DATABASE_URL ? 'Set' : 'Not set',
    })
  } catch (error) {
    console.error('PostgreSQL adapter test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  } finally {
    await pool.end()
  }
}