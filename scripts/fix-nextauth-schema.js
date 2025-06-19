const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.zgzvwrhoprhdvdnwofiq:tesfa5-peHbuv-sojnuz@aws-0-us-east-1.pooler.supabase.com:5432/postgres';

async function fixNextAuthSchema() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🔌 Connected to database');

    // Create VerificationToken table if it doesn't exist
    console.log('📋 Creating VerificationToken table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
        identifier TEXT NOT NULL,
        token TEXT NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `);

    // Check Account table structure
    console.log('🔍 Checking Account table structure...');
    const accountColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'Account' 
      ORDER BY ordinal_position;
    `);

    console.log('\n📊 Account table columns:');
    accountColumns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });

    // Check if required NextAuth columns exist
    const requiredColumns = [
      'id', 'userId', 'type', 'provider', 'providerAccountId', 
      'refresh_token', 'access_token', 'expires_at', 'token_type', 'scope', 'id_token'
    ];

    const existingColumns = accountColumns.rows.map(col => col.column_name);
    
    console.log('\n🔧 Required NextAuth columns:');
    for (const col of requiredColumns) {
      const exists = existingColumns.includes(col);
      console.log(`  ${exists ? '✅' : '❌'} ${col}`);
    }

    // Add missing columns if needed
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('\n🛠️  Adding missing columns...');
      
      for (const col of missingColumns) {
        let colType = 'TEXT';
        if (col === 'expires_at') colType = 'INTEGER';
        
        try {
          await client.query(`ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "${col}" ${colType};`);
          console.log(`  ✅ Added ${col}`);
        } catch (error) {
          console.log(`  ❌ Failed to add ${col}: ${error.message}`);
        }
      }
    }

    console.log('\n✅ NextAuth schema fix complete!');

  } catch (error) {
    console.error('💥 Database error:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

fixNextAuthSchema();