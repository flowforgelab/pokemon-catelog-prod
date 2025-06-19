const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Supabase connection with SSL and timeout settings
const SUPABASE_CONNECTION = process.env.SUPABASE_DB_URL || 'postgresql://postgres:tesfa5-peHbuv-sojnuz@db.zgzvwrhoprhdvdnwofiq.supabase.co:5432/postgres';

async function importToSupabase() {
  const client = new Client({
    connectionString: SUPABASE_CONNECTION,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 30000,
    query_timeout: 300000
  });

  try {
    await client.connect();
    console.log('Connected to Supabase database');

    // First, apply the schema
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Applying database schema...');
    await client.query(schema);
    console.log('Schema applied successfully');

    // Then import the data
    const dataPath = path.join(__dirname, '..', 'pokemon-cards-data.sql');
    const data = fs.readFileSync(dataPath, 'utf8');
    
    console.log('Importing Pokemon card data (this may take a few minutes)...');
    await client.query(data);
    console.log('Data imported successfully');

    // Verify import
    const result = await client.query('SELECT COUNT(*) FROM "Card"');
    console.log(`Total cards in database: ${result.rows[0].count}`);

  } catch (err) {
    console.error('Import error:', err.message);
  } finally {
    await client.end();
  }
}

importToSupabase();