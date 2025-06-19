const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.zgzvwrhoprhdvdnwofiq:tesfa5-peHbuv-sojnuz@aws-0-us-east-1.pooler.supabase.com:5432/postgres';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateTCGPlayerURLsImproved() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🔌 Connected to database');

    // Get ALL cards without TCGPlayer URLs (not just ones with pricing)
    const cardsWithoutUrls = await client.query(`
      SELECT "tcgId", name, "marketPrice", "setName" 
      FROM "Card" 
      WHERE "tcgplayerUrl" IS NULL 
      ORDER BY "setName", "tcgId"
    `);

    console.log(`📋 Found ${cardsWithoutUrls.rows.length} cards missing TCGPlayer URLs`);
    console.log(`⏰ Starting update process...`);

    let updated = 0;
    let processed = 0;
    let throttleCount = 0;
    let errorCount = 0;
    const total = cardsWithoutUrls.rows.length;
    
    // Improved rate limiting variables
    let currentDelay = 100; // Start with 100ms delay
    const maxDelay = 2000; // Max 2 second delay
    const minDelay = 100; // Min 100ms delay
    
    for (const card of cardsWithoutUrls.rows) {
      processed++;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          // Fetch card data from Pokemon TCG API
          const response = await fetch(`https://api.pokemontcg.io/v2/cards/${card.tcgId}`);
          
          if (response.status === 429) {
            // Rate limited - increase delay exponentially
            throttleCount++;
            currentDelay = Math.min(currentDelay * 1.5, maxDelay);
            console.log(`⚠️  Rate limited. Increasing delay to ${currentDelay}ms (throttle #${throttleCount})`);
            await sleep(currentDelay * 2); // Wait longer when throttled
            retryCount++;
            continue;
          }
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const data = await response.json();
          
          if (data.data?.tcgplayer?.url) {
            // Update the card with the TCGPlayer URL
            await client.query(
              'UPDATE "Card" SET "tcgplayerUrl" = $1 WHERE "tcgId" = $2',
              [data.data.tcgplayer.url, card.tcgId]
            );
            updated++;
            console.log(`✅ [${processed}/${total}] Updated ${card.name} (${card.setName})`);
            
            // Success - reduce delay slightly
            currentDelay = Math.max(currentDelay * 0.95, minDelay);
          } else {
            // No URL available but request succeeded
            if (processed % 100 === 0) {
              console.log(`📊 [${processed}/${total}] Progress: ${updated} updated, ${throttleCount} throttles, ${errorCount} errors`);
            }
          }
          
          break; // Success, exit retry loop
          
        } catch (error) {
          retryCount++;
          errorCount++;
          
          if (retryCount >= maxRetries) {
            console.error(`❌ Failed ${card.tcgId} after ${maxRetries} retries:`, error.message);
          } else {
            console.log(`🔄 Retry ${retryCount}/${maxRetries} for ${card.tcgId}: ${error.message}`);
            await sleep(currentDelay * retryCount); // Longer wait for retries
          }
        }
      }
      
      // Rate limiting - wait between requests
      await sleep(currentDelay);
      
      // Progress checkpoint every 500 cards
      if (processed % 500 === 0) {
        console.log(`\n📈 CHECKPOINT [${processed}/${total}]`);
        console.log(`   ✅ Updated: ${updated} cards`);
        console.log(`   ⚠️  Throttles: ${throttleCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log(`   ⏱️  Current delay: ${currentDelay}ms`);
        console.log(`   📊 Success rate: ${((updated / processed) * 100).toFixed(1)}%\n`);
      }
    }

    console.log(`\n🎉 UPDATE COMPLETE!`);
    console.log(`📊 Final Stats:`);
    console.log(`   ✅ Updated: ${updated} cards with TCGPlayer URLs`);
    console.log(`   📋 Processed: ${processed} total cards`);
    console.log(`   ⚠️  Throttles: ${throttleCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📈 Success rate: ${((updated / processed) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('💥 Database error:', error);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Add signal handlers for graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});

console.log('🚀 Starting improved TCGPlayer URL update script...');
updateTCGPlayerURLsImproved();