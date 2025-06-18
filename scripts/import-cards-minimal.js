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
    console.log('Starting minimal import...');
    
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
          // Escape single quotes
          const escape = (str) => {
            if (!str) return '';
            return str.replace(/'/g, "''");
          };
          
          // Build minimal insert with only required fields
          const sql = `
            INSERT INTO "Card" (
              "tcgId", 
              "name", 
              "supertype", 
              "number", 
              "setId", 
              "setName", 
              "setSeries", 
              "setPrintedTotal", 
              "setTotal", 
              "setReleaseDate", 
              "imageSmall", 
              "imageLarge"
            ) VALUES (
              '${card.id}',
              '${escape(card.name)}',
              '${card.supertype}',
              '${card.number}',
              '${card.set.id}',
              '${escape(card.set.name)}',
              '${card.set.series}',
              ${card.set.printedTotal || card.set.total},
              ${card.set.total},
              '${card.set.releaseDate}',
              '${card.images.small}',
              '${card.images.large}'
            ) ON CONFLICT ("tcgId") DO NOTHING;
          `;

          // Execute the SQL
          await execPromise(`docker exec pokemon-catalog-db psql -U postgres -d pokemon_catalog -c "${sql.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
          
          totalImported++;
          
          if (totalImported % 10 === 0) {
            process.stdout.write(`\rImported: ${totalImported} cards`);
          }
        } catch (err) {
          // Silently skip errors to continue import
        }
      }
      
      // Small delay between pages
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n\nImport completed! Total cards imported: ${totalImported}`);
    
    // Verify import
    const { stdout } = await execPromise(`docker exec pokemon-catalog-db psql -U postgres -d pokemon_catalog -c "SELECT COUNT(*) FROM \\"Card\\""`);
    console.log('Cards in database:', stdout);
    
  } catch (err) {
    console.error('Import error:', err);
  }
}

importCards();