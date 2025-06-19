import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

  try {
    const client = await pool.connect()
    
    // Check for unique constraints and indexes
    const uniqueResult = await client.query(`
      SELECT 
        conname as constraint_name,
        pg_get_constraintdef(oid) as definition
      FROM pg_constraint
      WHERE conrelid = '"Account"'::regclass
      AND contype = 'u'
    `)
    
    const indexResult = await client.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename = 'Account'
    `)
    
    // Check if there are any existing Google accounts
    const googleAccountsResult = await client.query(`
      SELECT 
        a."providerAccountId",
        a."userId",
        u.email,
        a."createdAt" AT TIME ZONE 'UTC' as created_utc
      FROM "Account" a
      JOIN "User" u ON a."userId" = u.id
      WHERE a.provider = 'google'
      ORDER BY a."createdAt" DESC
      LIMIT 10
    `)
    
    client.release()
    
    return NextResponse.json({
      uniqueConstraints: uniqueResult.rows,
      indexes: indexResult.rows,
      googleAccounts: googleAccountsResult.rows,
      googleAccountCount: googleAccountsResult.rowCount
    })
  } catch (error) {
    console.error('Check unique constraint error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  } finally {
    await pool.end()
  }
}