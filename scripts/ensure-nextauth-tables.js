#!/usr/bin/env node

const { Pool } = require('pg')
require('dotenv').config()

async function ensureNextAuthTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

  try {
    console.log('Checking NextAuth tables...')
    
    // Create tables if they don't exist
    const queries = [
      // User table
      `CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        image TEXT,
        "emailVerified" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Account table
      `CREATE TABLE IF NOT EXISTS "Account" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        UNIQUE(provider, "providerAccountId")
      )`,
      
      // Session table
      `CREATE TABLE IF NOT EXISTS "Session" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "sessionToken" TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        expires TIMESTAMP NOT NULL
      )`,
      
      // VerificationToken table
      `CREATE TABLE IF NOT EXISTS "VerificationToken" (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMP NOT NULL,
        UNIQUE(identifier, token)
      )`,
    ]
    
    for (const query of queries) {
      await pool.query(query)
      console.log('✓ Ensured table exists')
    }
    
    // Check table counts
    const tables = ['User', 'Account', 'Session', 'VerificationToken']
    console.log('\nTable counts:')
    
    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) FROM "${table}"`)
      console.log(`${table}: ${result.rows[0].count} records`)
    }
    
    console.log('\nNextAuth tables are ready!')
    
  } catch (error) {
    console.error('Error ensuring NextAuth tables:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

if (require.main === module) {
  ensureNextAuthTables()
}