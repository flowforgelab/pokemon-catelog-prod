const https = require('https');
const fs = require('fs');
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

    console.log(`Fetching from: ${options.hostname}${options.path}`);
    
    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`Received ${parsed.data?.length || 0} cards`);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function importBatch() {
  try {
    console.log('Starting batch import...');
    
    // Fetch just 1 page with 50 cards to test
    const response = await fetchPokemonCards(1, 50);
    
    if (!response.data || response.data.length === 0) {
      console.log('No data received from API');
      return;
    }

    console.log(`Processing ${response.data.length} cards...`);
    
    // Build a single multi-row INSERT statement
    let sql = `INSERT INTO "Card" (
      "tcgId", "name", "supertype", "subtypes", "types", "hp", 
      "retreatCost", "number", "artist", "rarity", "flavorText", 
      "setId", "setName", "setSeries", "setPrintedTotal", "setTotal", 
      "setReleaseDate", "imageSmall", "imageLarge", "nationalPokedexNumbers", 
      "rules", "abilities", "attacks", "weaknesses", "resistances",
      "standardLegal", "expandedLegal", "unlimitedLegal"
    ) VALUES `;

    const values = [];
    let successCount = 0;

    for (const card of response.data) {
      try {
        // Escape function
        const escape = (str) => {
          if (!str) return null;
          return str.replace(/'/g, "''");
        };
        
        // Format arrays
        const formatArray = (arr) => {
          if (!arr || arr.length === 0) return '{}';
          return '{' + arr.map(item => `"${escape(item)}"`).join(',') + '}';
        };

        // Format JSONB
        const formatJsonb = (obj) => {
          if (!obj) return '[]';
          return JSON.stringify(obj).replace(/'/g, "''");
        };
        
        const value = `(
          '${card.id}',
          '${escape(card.name)}',
          '${card.supertype}',
          '${formatArray(card.subtypes)}',
          '${formatArray(card.types)}',
          ${card.hp ? parseInt(card.hp) : 'NULL'},
          '${formatArray(card.retreatCost)}',
          '${card.number}',
          ${card.artist ? `'${escape(card.artist)}'` : 'NULL'},
          ${card.rarity ? `'${escape(card.rarity)}'` : 'NULL'},
          ${card.flavorText ? `'${escape(card.flavorText)}'` : 'NULL'},
          '${card.set.id}',
          '${escape(card.set.name)}',
          '${card.set.series}',
          ${card.set.printedTotal || card.set.total},
          ${card.set.total},
          '${card.set.releaseDate}',
          '${card.images.small}',
          '${card.images.large}',
          '${card.nationalPokedexNumbers ? '{' + card.nationalPokedexNumbers.join(',') + '}' : '{}'}',
          '${formatArray(card.rules)}',
          '${formatJsonb(card.abilities)}'::jsonb[],
          '${formatJsonb(card.attacks)}'::jsonb[],
          '${formatJsonb(card.weaknesses)}'::jsonb[],
          '${formatJsonb(card.resistances)}'::jsonb[],
          ${card.legalities?.standard === 'Legal'},
          ${card.legalities?.expanded === 'Legal'},
          ${card.legalities?.unlimited === 'Legal'}
        )`;
        
        values.push(value);
        successCount++;
      } catch (err) {
        console.error(`Skipping card ${card.id}: ${err.message}`);
      }
    }

    if (values.length === 0) {
      console.log('No valid cards to import');
      return;
    }

    sql += values.join(',\n') + ' ON CONFLICT ("tcgId") DO UPDATE SET name = EXCLUDED.name, hp = EXCLUDED.hp;';
    
    // Write SQL to file for debugging
    fs.writeFileSync('import.sql', sql);
    console.log('SQL written to import.sql');
    
    // Execute the SQL
    console.log('Executing batch insert...');
    const { stdout, stderr } = await execPromise(`docker exec -i pokemon-catalog-db psql -U postgres -d pokemon_catalog < import.sql`);
    
    if (stderr && !stderr.includes('INSERT')) {
      console.error('Error:', stderr);
    } else {
      console.log(`Successfully imported ${successCount} cards!`);
    }
    
    // Clean up
    fs.unlinkSync('import.sql');
    
  } catch (err) {
    console.error('Import error:', err);
  }
}

importBatch();