const https = require('https');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function fetchPokemonCards(page = 1, pageSize = 100) {
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
    console.log('Starting import...');

    let page = 1;
    let totalImported = 0;
    let hasMore = true;

    while (hasMore && page <= 5) { // Limit to 5 pages for initial test
      console.log(`Fetching page ${page}...`);
      const response = await fetchPokemonCards(page, 100);
      
      if (!response.data || response.data.length === 0) {
        hasMore = false;
        break;
      }

      for (const card of response.data) {
        try {
          // Escape single quotes properly
          const escape = (str) => {
            if (!str) return null;
            return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
          };
          
          // Format arrays for PostgreSQL
          const formatArray = (arr) => {
            if (!arr || arr.length === 0) return '{}';
            return '{' + arr.map(item => `"${escape(item)}"`).join(',') + '}';
          };

          // Format JSONB arrays
          const formatJsonbArray = (arr) => {
            if (!arr || arr.length === 0) return '[]';
            return JSON.stringify(arr).replace(/'/g, "''");
          };
          
          // Prepare the SQL with proper column mapping
          const sql = `INSERT INTO "Card" (
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
            "standardLegal",
            "expandedLegal",
            "unlimitedLegal"
          ) VALUES (
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
            '${formatJsonbArray(card.abilities)}'::jsonb[],
            '${formatJsonbArray(card.attacks)}'::jsonb[],
            '${formatJsonbArray(card.weaknesses)}'::jsonb[],
            '${formatJsonbArray(card.resistances)}'::jsonb[],
            ${card.legalities?.standard === 'Legal' ? 'true' : 'false'},
            ${card.legalities?.expanded === 'Legal' ? 'true' : 'false'},
            ${card.legalities?.unlimited === 'Legal' ? 'true' : 'false'}
          ) ON CONFLICT ("tcgId") DO UPDATE SET
            name = EXCLUDED.name,
            hp = EXCLUDED.hp;`;

          // Execute via psql in Docker
          const { stdout, stderr } = await execPromise(`docker exec -i pokemon-catalog-db psql -U postgres -d pokemon_catalog`, {
            input: sql
          });
          
          if (stderr && !stderr.includes('INSERT') && !stderr.includes('UPDATE')) {
            console.error(`Error for card ${card.id}:`, stderr);
          }
          
          totalImported++;
          
          if (totalImported % 10 === 0) {
            console.log(`Progress: ${totalImported} cards imported`);
          }
        } catch (err) {
          console.error(`Failed to import card ${card.id}:`, err.message);
        }
      }

      console.log(`Completed page ${page} - Total imported: ${totalImported}`);
      page++;
      
      // Small delay to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\nImport completed! Total cards imported: ${totalImported}`);
  } catch (err) {
    console.error('Import error:', err);
  }
}

importCards();