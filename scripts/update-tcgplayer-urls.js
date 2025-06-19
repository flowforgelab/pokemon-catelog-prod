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

    // Get ALL cards without TCGPlayer URLs (not just ones with pricing)
    const cardsWithoutUrls = await client.query(`
      SELECT "tcgId", name, "marketPrice" 
      FROM "Card" 
      WHERE "tcgplayerUrl" IS NULL 
      ORDER BY "tcgId"
    `);

    console.log(`Found ${cardsWithoutUrls.rows.length} cards missing TCGPlayer URLs`);

    let updated = 0;
    let processed = 0;
    const total = cardsWithoutUrls.rows.length;
    
    for (const card of cardsWithoutUrls.rows) {
      processed++;
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
          console.log(`[${processed}/${total}] Updated ${card.name} (${card.tcgId})`);
        } else {
          if (processed % 50 === 0) {
            console.log(`[${processed}/${total}] Processing... (${updated} updated so far)`);
          }
        }
        
        // Rate limiting - wait 50ms between requests (slightly faster)
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`Error updating ${card.tcgId}:`, error.message);
        // On error, wait a bit longer before continuing
        await new Promise(resolve => setTimeout(resolve, 200));
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