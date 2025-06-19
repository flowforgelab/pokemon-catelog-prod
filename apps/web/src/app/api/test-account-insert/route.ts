import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// Test inserting an account record directly
export async function GET() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

  try {
    const client = await pool.connect()
    
    // First, check the Account table structure
    const schemaResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'Account'
      ORDER BY ordinal_position
    `)
    
    // Check constraints
    const constraintsResult = await client.query(`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'Account'
    `)
    
    // Try to insert a test account
    let testInsertResult = null
    let testInsertError = null
    
    try {
      // Get the demo user ID
      const userResult = await client.query(`SELECT id FROM "User" WHERE email = 'demo@example.com'`)
      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].id
        
        const insertResult = await client.query(`
          INSERT INTO "Account" 
          ("userId", type, provider, "providerAccountId")
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `, [userId, 'oauth', 'test', 'test-' + Date.now()])
        
        testInsertResult = insertResult.rows[0]
        
        // Clean up
        await client.query(`DELETE FROM "Account" WHERE id = $1`, [testInsertResult.id])
      }
    } catch (error) {
      testInsertError = error instanceof Error ? error.message : 'Unknown error'
    }
    
    client.release()
    
    return NextResponse.json({
      schema: schemaResult.rows,
      constraints: constraintsResult.rows,
      testInsert: {
        success: !!testInsertResult,
        error: testInsertError,
        result: testInsertResult
      }
    })
  } catch (error) {
    console.error('Test account insert error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  } finally {
    await pool.end()
  }
}