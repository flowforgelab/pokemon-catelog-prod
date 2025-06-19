const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.zgzvwrhoprhdvdnwofiq:tesfa5-peHbuv-sojnuz@aws-0-us-east-1.pooler.supabase.com:5432/postgres';

async function updateTCGPlayerURLs() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Get cards without TCGPlayer URLs but with pricing (meaning they should have URLs)
    const cardsWithoutUrls = await client.query(`
      SELECT "tcgId", name, "marketPrice" 
      FROM "Card" 
      WHERE "tcgplayerUrl" IS NULL 
      AND "marketPrice" IS NOT NULL 
      AND "marketPrice" > 0
      LIMIT 100
    `);

    console.log(`Found ${cardsWithoutUrls.rows.length} cards with pricing but missing TCGPlayer URLs`);

    let updated = 0;
    for (const card of cardsWithoutUrls.rows) {
      try {
        // Fetch card data from Pokemon TCG API
        const response = await fetch(`https://api.pokemontcg.io/v2/cards/${card.tcgId}`);
        const data = await response.json();
        
        if (data.data?.tcgplayer?.url) {
          // Update the card with the TCGPlayer URL
          await client.query(
            'UPDATE "Card" SET "tcgplayerUrl" = $1 WHERE "tcgId" = $2',
            [data.data.tcgplayer.url, card.tcgId]
          );
          updated++;
          console.log(`Updated ${card.name} (${card.tcgId}) with URL: ${data.data.tcgplayer.url}`);
        }
        
        // Rate limiting - wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error updating ${card.tcgId}:`, error.message);
      }
    }

    console.log(`\nUpdate complete! Updated ${updated} cards with TCGPlayer URLs`);
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await client.end();
  }
}

updateTCGPlayerURLs();