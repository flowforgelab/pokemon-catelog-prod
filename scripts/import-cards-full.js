const https = require('https');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function fetchPokemonCards(page = 1, pageSize = 50) {
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
    console.log('Starting full import with complete card data...');
    
    let totalImported = 0;
    
    for (let page = 1; page <= 10; page++) {
      console.log(`\nFetching page ${page}...`);
      const response = await fetchPokemonCards(page, 50);
      
      if (!response.data || response.data.length === 0) {
        console.log('No more data');
        break;
      }

      console.log(`Processing ${response.data.length} cards...`);
      
      for (const card of response.data) {
        try {
          // Escape single quotes and handle null values
          const escape = (str) => {
            if (!str) return 'NULL';
            return `'${str.replace(/'/g, "''")}'`;
          };
          
          const escapeArray = (arr) => {
            if (!arr || arr.length === 0) return 'NULL';
            return `'{${arr.join(',')}}'`;
          };
          
          const escapeJsonArray = (arr) => {
            if (!arr || arr.length === 0) return 'NULL';
            return `'${JSON.stringify(arr).replace(/'/g, "''")}'::jsonb[]`;
          };
          
          // Build comprehensive insert with all fields
          const sql = `
            INSERT INTO "Card" (
              "tcgId", 
              "name", 
              "supertype",
              "subtypes",
              "types",
              "hp",
              "retreatCost",
              "number",
              "artist",
              "rarity",
              "flavorText",
              "setId", 
              "setName", 
              "setSeries", 
              "setPrintedTotal", 
              "setTotal", 
              "setReleaseDate", 
              "imageSmall", 
              "imageLarge",
              "nationalPokedexNumbers",
              "rules",
              "abilities",
              "attacks",
              "weaknesses",
              "resistances",
              "tcgplayerUrl"
            ) VALUES (
              ${escape(card.id)},
              ${escape(card.name)},
              ${escape(card.supertype)},
              ${escapeArray(card.subtypes)},
              ${escapeArray(card.types)},
              ${card.hp || 'NULL'},
              ${escapeArray(card.retreatCost)},
              ${escape(card.number)},
              ${escape(card.artist)},
              ${escape(card.rarity)},
              ${escape(card.flavorText)},
              ${escape(card.set.id)},
              ${escape(card.set.name)},
              ${escape(card.set.series)},
              ${card.set.printedTotal || card.set.total},
              ${card.set.total},
              ${escape(card.set.releaseDate)},
              ${escape(card.images.small)},
              ${escape(card.images.large)},
              ${escapeArray(card.nationalPokedexNumbers)},
              ${escapeArray(card.rules)},
              ${escapeJsonArray(card.abilities)},
              ${escapeJsonArray(card.attacks)},
              ${escapeJsonArray(card.weaknesses)},
              ${escapeJsonArray(card.resistances)},
              ${escape(card.tcgplayer?.url)}
            ) ON CONFLICT ("tcgId") DO UPDATE SET
              "name" = EXCLUDED."name",
              "types" = EXCLUDED."types",
              "hp" = EXCLUDED."hp",
              "artist" = EXCLUDED."artist",
              "rarity" = EXCLUDED."rarity",
              "flavorText" = EXCLUDED."flavorText",
              "abilities" = EXCLUDED."abilities",
              "attacks" = EXCLUDED."attacks",
              "weaknesses" = EXCLUDED."weaknesses",
              "resistances" = EXCLUDED."resistances",
              "updatedAt" = NOW();
          `;

          // Execute the SQL
          await execPromise(`docker exec pokemon-catalog-db psql -U postgres -d pokemon_catalog -c "${sql.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
          
          totalImported++;
          
          if (totalImported % 10 === 0) {
            process.stdout.write(`\rImported: ${totalImported} cards`);
          }
        } catch (err) {
          console.log(`\nError importing card ${card.name}:`, err.message);
        }
      }
      
      // Small delay between pages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n\nImport completed! Total cards imported: ${totalImported}`);
    
    // Verify import and show sample data
    console.log('\nVerifying import...');
    const { stdout: count } = await execPromise(`docker exec pokemon-catalog-db psql -U postgres -d pokemon_catalog -t -c "SELECT COUNT(*) FROM \\"Card\\""`);
    console.log('Total cards in database:', count.trim());
    
    const { stdout: sample } = await execPromise(`docker exec pokemon-catalog-db psql -U postgres -d pokemon_catalog -c "SELECT name, hp, rarity, types FROM \\"Card\\" WHERE hp IS NOT NULL AND rarity IS NOT NULL LIMIT 5"`);
    console.log('\nSample cards with full data:');
    console.log(sample);
    
  } catch (err) {
    console.error('Import error:', err);
  }
}

importCards();