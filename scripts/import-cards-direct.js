const https = require('https');
const { Client } = require('pg');

// Direct PostgreSQL connection
const client = new Client({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/pokemon_catalog'
});

async function fetchPokemonCards(page = 1, pageSize = 250) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.pokemontcg.io',
      path: `/v2/cards?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function importCards() {
  try {
    await client.connect();
    console.log('Connected to database');

    let page = 1;
    let totalImported = 0;
    let hasMore = true;

    while (hasMore && page <= 20) { // Limit to 20 pages for now
      console.log(`Fetching page ${page}...`);
      const response = await fetchPokemonCards(page, 250);
      
      if (!response.data || response.data.length === 0) {
        hasMore = false;
        break;
      }

      for (const card of response.data) {
        try {
          await client.query(`
            INSERT INTO "Card" (
              id, name, hp, types, supertype, subtype, rarity,
              artist, number, "nationalPokedexNumber", legalities,
              images, tcgplayer, "setId", "setSeries", "setName",
              "setReleaseDate", attacks, weaknesses, resistances,
              retreat_cost, rules, abilities, flavor_text
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
              $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
            ) ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              hp = EXCLUDED.hp
          `, [
            card.id,
            card.name,
            card.hp || null,
            JSON.stringify(card.types || []),
            card.supertype,
            card.subtype || null,
            card.rarity || null,
            card.artist || null,
            card.number || null,
            card.nationalPokedexNumbers ? card.nationalPokedexNumbers[0] : null,
            JSON.stringify(card.legalities || {}),
            JSON.stringify(card.images || {}),
            JSON.stringify(card.tcgplayer || {}),
            card.set?.id || null,
            card.set?.series || null,
            card.set?.name || null,
            card.set?.releaseDate || null,
            JSON.stringify(card.attacks || []),
            JSON.stringify(card.weaknesses || []),
            JSON.stringify(card.resistances || []),
            JSON.stringify(card.retreatCost || []),
            JSON.stringify(card.rules || []),
            JSON.stringify(card.abilities || []),
            card.flavorText || null
          ]);
          totalImported++;
        } catch (err) {
          console.error(`Failed to import card ${card.id}:`, err.message);
        }
      }

      console.log(`Imported ${response.data.length} cards from page ${page}`);
      page++;
      
      // Small delay to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`Total cards imported: ${totalImported}`);
  } catch (err) {
    console.error('Import error:', err);
  } finally {
    await client.end();
  }
}

importCards();