const https = require('https');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

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

async function executeSql(sql) {
  const escapedSql = sql.replace(/'/g, "'\"'\"'");
  const command = `docker exec pokemon-catalog-db psql -U postgres -d pokemon_catalog -c '${escapedSql}'`;
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stderr && !stderr.includes('NOTICE')) {
      console.error('SQL Error:', stderr);
    }
    return stdout;
  } catch (error) {
    console.error('Exec error:', error);
    throw error;
  }
}

async function importCards() {
  try {
    console.log('Connected to database via Docker');

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
          // Escape single quotes in string values
          const escape = (str) => str ? str.replace(/'/g, "''") : null;
          
          const sql = `
            INSERT INTO "Card" (
              id, name, hp, types, supertype, subtype, rarity,
              artist, number, "nationalPokedexNumber", legalities,
              images, tcgplayer, "setId", "setSeries", "setName",
              "setReleaseDate", attacks, weaknesses, resistances,
              retreat_cost, rules, abilities, flavor_text
            ) VALUES (
              '${card.id}',
              '${escape(card.name)}',
              ${card.hp ? `'${card.hp}'` : 'NULL'},
              '${JSON.stringify(card.types || [])}',
              '${card.supertype}',
              ${card.subtype ? `'${escape(card.subtype)}'` : 'NULL'},
              ${card.rarity ? `'${escape(card.rarity)}'` : 'NULL'},
              ${card.artist ? `'${escape(card.artist)}'` : 'NULL'},
              ${card.number ? `'${card.number}'` : 'NULL'},
              ${card.nationalPokedexNumbers ? card.nationalPokedexNumbers[0] : 'NULL'},
              '${JSON.stringify(card.legalities || {})}',
              '${JSON.stringify(card.images || {})}',
              '${JSON.stringify(card.tcgplayer || {})}',
              ${card.set?.id ? `'${card.set.id}'` : 'NULL'},
              ${card.set?.series ? `'${escape(card.set.series)}'` : 'NULL'},
              ${card.set?.name ? `'${escape(card.set.name)}'` : 'NULL'},
              ${card.set?.releaseDate ? `'${card.set.releaseDate}'` : 'NULL'},
              '${JSON.stringify(card.attacks || [])}',
              '${JSON.stringify(card.weaknesses || [])}',
              '${JSON.stringify(card.resistances || [])}',
              '${JSON.stringify(card.retreatCost || [])}',
              '${JSON.stringify(card.rules || [])}',
              '${JSON.stringify(card.abilities || [])}',
              ${card.flavorText ? `'${escape(card.flavorText)}'` : 'NULL'}
            ) ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              hp = EXCLUDED.hp;
          `;
          
          await executeSql(sql);
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
  }
}

importCards();