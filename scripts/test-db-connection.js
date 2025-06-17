const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres123@localhost:5432/pokemon_catalog'
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL!');
    
    const res = await client.query('SELECT current_database(), current_user');
    console.log('Database:', res.rows[0].current_database);
    console.log('User:', res.rows[0].current_user);
    
    // Test creating a table
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_prisma (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255)
      )
    `);
    console.log('✅ Table creation works!');
    
    // Clean up
    await client.query('DROP TABLE IF EXISTS test_prisma');
    
    await client.end();
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    console.error('Stack:', err.stack);
  }
}

testConnection();