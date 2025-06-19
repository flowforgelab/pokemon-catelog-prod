const { Client } = require('pg');

const DATABASE_URL = 'postgresql://postgres.zgzvwrhoprhdvdnwofiq:tesfa5-peHbuv-sojnuz@aws-0-us-east-1.pooler.supabase.com:5432/postgres';

async function testDeckAnalysis() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // 1. Find a user
    const userResult = await client.query(`
      SELECT id, email FROM "User" LIMIT 1
    `);
    
    if (userResult.rows.length === 0) {
      console.log('❌ No users found. Please create a user first.');
      return;
    }

    const userId = userResult.rows[0].id;
    console.log(`✅ Found user: ${userResult.rows[0].email}\n`);

    // 2. Create a test deck
    const deckResult = await client.query(`
      INSERT INTO "Deck" (id, "userId", name, format, description)
      VALUES (gen_random_uuid(), $1, 'Test Aggro Fire Deck', 'standard', 'Testing deck analysis')
      RETURNING id, name
    `, [userId]);

    const deckId = deckResult.rows[0].id;
    console.log(`✅ Created deck: ${deckResult.rows[0].name}\n`);

    // 3. Add some cards to the deck
    const cards = await client.query(`
      SELECT id, name, supertype, hp, types
      FROM "Card"
      WHERE supertype = 'Pokémon' 
        AND 'Fire' = ANY(types)
        AND hp <= 120
        AND "standardLegal" = true
      LIMIT 8
    `);

    console.log(`✅ Found ${cards.rows.length} Fire Pokémon for testing\n`);

    // Add Pokemon to deck
    for (const card of cards.rows) {
      await client.query(`
        INSERT INTO "DeckCard" ("deckId", "cardId", quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT ("deckId", "cardId") DO NOTHING
      `, [deckId, card.id, 2]);
    }

    // Add some energy
    const energyCards = await client.query(`
      SELECT id, name FROM "Card"
      WHERE supertype = 'Energy' AND name LIKE '%Fire Energy%'
      LIMIT 1
    `);

    if (energyCards.rows.length > 0) {
      await client.query(`
        INSERT INTO "DeckCard" ("deckId", "cardId", quantity)
        VALUES ($1, $2, 12)
      `, [deckId, energyCards.rows[0].id]);
      console.log(`✅ Added 12 Fire Energy\n`);
    }

    // Add trainers
    const trainerCards = await client.query(`
      SELECT id, name FROM "Card"
      WHERE supertype = 'Trainer' 
        AND "standardLegal" = true
        AND name IN ('Professor''s Research', 'Switch', 'Potion')
      LIMIT 3
    `);

    for (const trainer of trainerCards.rows) {
      await client.query(`
        INSERT INTO "DeckCard" ("deckId", "cardId", quantity)
        VALUES ($1, $2, 4)
      `, [deckId, trainer.id]);
    }

    // 4. Check deck composition
    const deckStats = await client.query(`
      SELECT 
        COUNT(DISTINCT dc."cardId") as unique_cards,
        SUM(dc.quantity) as total_cards,
        COUNT(DISTINCT dc."cardId") FILTER (WHERE c.supertype = 'Pokémon') as pokemon_types,
        SUM(dc.quantity) FILTER (WHERE c.supertype = 'Pokémon') as pokemon_count,
        SUM(dc.quantity) FILTER (WHERE c.supertype = 'Energy') as energy_count,
        SUM(dc.quantity) FILTER (WHERE c.supertype = 'Trainer') as trainer_count
      FROM "DeckCard" dc
      JOIN "Card" c ON dc."cardId" = c.id
      WHERE dc."deckId" = $1
    `, [deckId]);

    console.log('📊 Deck Composition:');
    console.log(`   Total Cards: ${deckStats.rows[0].total_cards}/60`);
    console.log(`   Pokemon: ${deckStats.rows[0].pokemon_count}`);
    console.log(`   Energy: ${deckStats.rows[0].energy_count}`);
    console.log(`   Trainers: ${deckStats.rows[0].trainer_count}\n`);

    // 5. Test via GraphQL
    console.log('🧪 To test the deck analysis:\n');
    console.log('1. Start the API server: cd apps/api && pnpm dev');
    console.log('2. Go to http://localhost:3001/graphql');
    console.log('3. Run this mutation:\n');
    console.log(`mutation {
  analyzeDeck(id: "${deckId}") {
    id
    strategy
    consistencyScore
    energyCurve
    recommendations
    warnings
  }
}`);

    console.log('\n4. Then check recommendations:\n');
    console.log(`query {
  deckRecommendations(id: "${deckId}") {
    card {
      name
      marketPrice
    }
    reasoning
    priority
  }
}`);

    // 6. Check if analysis was saved
    const analysisCheck = await client.query(`
      SELECT * FROM "DeckAnalysis" WHERE "deckId" = $1
    `, [deckId]);

    if (analysisCheck.rows.length > 0) {
      console.log('\n✅ Deck analysis already exists in database!');
      console.log(`   Strategy: ${analysisCheck.rows[0].strategy}`);
      console.log(`   Consistency: ${analysisCheck.rows[0].consistencyScore}/100`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

testDeckAnalysis();