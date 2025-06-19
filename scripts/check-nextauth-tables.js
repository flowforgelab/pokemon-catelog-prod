const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.zgzvwrhoprhdvdnwofiq:tesfa5-peHbuv-sojnuz@aws-0-us-east-1.pooler.supabase.com:5432/postgres';

async function checkNextAuthTables() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🔌 Connected to database');

    // Check if NextAuth tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('Account', 'Session', 'User', 'VerificationToken')
      ORDER BY table_name;
    `);

    console.log('\n📋 NextAuth Tables Status:');
    const requiredTables = ['Account', 'Session', 'User', 'VerificationToken'];
    const existingTables = tables.rows.map(row => row.table_name);
    
    for (const table of requiredTables) {
      const exists = existingTables.includes(table);
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    }

    // If User table exists, check for OAuth accounts
    if (existingTables.includes('User')) {
      const userCount = await client.query('SELECT COUNT(*) FROM "User"');
      console.log(`\n👥 Users in database: ${userCount.rows[0].count}`);
    }

    if (existingTables.includes('Account')) {
      const accountCount = await client.query('SELECT COUNT(*) FROM "Account"');
      const googleAccounts = await client.query('SELECT COUNT(*) FROM "Account" WHERE provider = \'google\'');
      console.log(`🔗 OAuth accounts: ${accountCount.rows[0].count} total, ${googleAccounts.rows[0].count} Google`);
    }

    if (existingTables.includes('Session')) {
      const sessionCount = await client.query('SELECT COUNT(*) FROM "Session"');
      console.log(`📱 Active sessions: ${sessionCount.rows[0].count}`);
    }

  } catch (error) {
    console.error('💥 Database error:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

checkNextAuthTables();