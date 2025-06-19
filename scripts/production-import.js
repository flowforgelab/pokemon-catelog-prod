const https = require('https');
const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres.zgzvwrhoprhdvdnwofiq:tesfa5-peHbuv-sojnuz@aws-0-us-east-1.pooler.supabase.com:6543/postgres";

async function fetchPokemonCards(page = 1, pageSize = 100) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.pokemontcg.io',
      path: `/v2/cards?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
      headers: { 'Accept': 'application/json' }
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

function mapCardData(card) {
  return {
    id: require('crypto').randomUUID(),
    tcgId: card.id,
    name: card.name,
    supertype: card.supertype,
    subtypes: card.subtypes || [],
    types: card.types || [],
    hp: card.hp ? parseInt(card.hp) : null,
    retreatCost: card.retreatCost || [],
    number: card.number,
    artist: card.artist || null,
    rarity: card.rarity || null,
    flavorText: card.flavorText || null,
    setId: card.set?.id || 'unknown',
    setName: card.set?.name || 'Unknown Set',
    setSeries: card.set?.series || 'Unknown Series',
    setPrintedTotal: card.set?.printedTotal || 0,
    setTotal: card.set?.total || 0,
    setReleaseDate: card.set?.releaseDate || '1999-01-01',
    imageSmall: card.images?.small || '',
    imageLarge: card.images?.large || '',
    nationalPokedexNumbers: card.nationalPokedexNumbers || [],
    rules: card.rules || [],
    abilities: card.abilities || [],
    attacks: card.attacks || [],
    weaknesses: card.weaknesses || [],
    resistances: card.resistances || [],
    marketPrice: card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || null
  };
}

async function importBatch(client, cards) {
  const values = [];
  const placeholders = [];
  
  cards.forEach((card, index) => {
    const mapped = mapCardData(card);
    const offset = index * 27;
    placeholders.push(`($${offset+1}, $${offset+2}, $${offset+3}, $${offset+4}, $${offset+5}, $${offset+6}, $${offset+7}, $${offset+8}, $${offset+9}, $${offset+10}, $${offset+11}, $${offset+12}, $${offset+13}, $${offset+14}, $${offset+15}, $${offset+16}, $${offset+17}, $${offset+18}, $${offset+19}, $${offset+20}, $${offset+21}, $${offset+22}, $${offset+23}, $${offset+24}, $${offset+25}, $${offset+26}, $${offset+27})`);
    
    values.push(
      mapped.id, mapped.tcgId, mapped.name, mapped.supertype, mapped.subtypes,
      mapped.types, mapped.hp, mapped.retreatCost, mapped.number, mapped.artist,
      mapped.rarity, mapped.flavorText, mapped.setId, mapped.setName, mapped.setSeries,
      mapped.setPrintedTotal, mapped.setTotal, mapped.setReleaseDate, mapped.imageSmall, mapped.imageLarge,
      mapped.nationalPokedexNumbers, mapped.rules, mapped.abilities, mapped.attacks, mapped.weaknesses, mapped.resistances,
      mapped.marketPrice
    );
  });

  const query = `
    INSERT INTO "Card" (
      id, "tcgId", name, supertype, subtypes, types, hp, "retreatCost",
      number, artist, rarity, "flavorText", "setId", "setName", "setSeries",
      "setPrintedTotal", "setTotal", "setReleaseDate", "imageSmall", "imageLarge",
      "nationalPokedexNumbers", rules, abilities, attacks, weaknesses, resistances,
      "marketPrice"
    ) VALUES ${placeholders.join(', ')}
    ON CONFLICT ("tcgId") DO NOTHING
  `;

  await client.query(query, values);
}

async function importAllCards() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to production database');

    let page = 1;
    let totalImported = 0;
    const batchSize = 50; // Smaller batches for stability

    while (page <= 500) { // Pokemon TCG API has ~19k cards across ~400 pages
      try {
        console.log(`Fetching page ${page}...`);
        const response = await fetchPokemonCards(page, batchSize);
        
        if (!response.data || response.data.length === 0) {
          console.log('No more cards to fetch');
          break;
        }

        await importBatch(client, response.data);
        totalImported += response.data.length;
        
        console.log(`Imported ${response.data.length} cards from page ${page}. Total: ${totalImported}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        page++;
        
      } catch (error) {
        console.error(`Error on page ${page}:`, error.message);
        // Continue with next page on error
        page++;
      }
    }

    const result = await client.query('SELECT COUNT(*) FROM "Card"');
    console.log(`\n✅ Import completed! Total cards in database: ${result.rows[0].count}`);

  } catch (error) {
    console.error('Import failed:', error.message);
  } finally {
    await client.end();
  }
}

importAllCards();