const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Database connection
const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || 'postgresql://postgres.zgzvwrhoprhdvdnwofiq:tesfa5-peHbuv-sojnuz@aws-0-us-east-1.pooler.supabase.com:6543/postgres';

async function importCards() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 30000,
    query_timeout: 300000
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Only import the card data
    const dataPath = path.join(__dirname, '..', 'pokemon-cards-data.sql');
    
    if (!fs.existsSync(dataPath)) {
      console.error('pokemon-cards-data.sql not found');
      return;
    }
    
    const data = fs.readFileSync(dataPath, 'utf8');
    
    console.log('Importing Pokemon card data (this may take a few minutes)...');
    await client.query(data);
    console.log('Data imported successfully');

    // Verify import
    const result = await client.query('SELECT COUNT(*) FROM "Card"');
    console.log(`Total cards in database: ${result.rows[0].count}`);

  } catch (err) {
    console.error('Import error:', err.message);
    if (err.message.includes('already exists')) {
      console.log('Some data may already exist, checking current state...');
      try {
        const result = await client.query('SELECT COUNT(*) FROM "Card"');
        console.log(`Current cards in database: ${result.rows[0].count}`);
      } catch (e) {
        console.error('Could not check card count:', e.message);
      }
    }
  } finally {
    await client.end();
  }
}

importCards();