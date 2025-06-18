const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function quickUpdate() {
  try {
    console.log('Quick update of card data...');
    
    // Update all cards with sample data in bulk
    const bulkUpdateSql = `
      UPDATE "Card" 
      SET 
        types = CASE 
          WHEN random() < 0.2 THEN ARRAY['Fire']::text[]
          WHEN random() < 0.4 THEN ARRAY['Water']::text[]
          WHEN random() < 0.6 THEN ARRAY['Grass']::text[]
          WHEN random() < 0.8 THEN ARRAY['Electric']::text[]
          ELSE ARRAY['Psychic']::text[]
        END,
        hp = FLOOR(random() * 150 + 50)::int,
        rarity = CASE 
          WHEN random() < 0.4 THEN 'Common'
          WHEN random() < 0.7 THEN 'Uncommon'
          WHEN random() < 0.9 THEN 'Rare'
          ELSE 'Rare Holo'
        END,
        artist = CASE 
          WHEN random() < 0.33 THEN 'Ken Sugimori'
          WHEN random() < 0.66 THEN 'Mitsuhiro Arita'
          ELSE 'Atsuko Nishida'
        END,
        "updatedAt" = NOW()
      WHERE hp IS NULL OR rarity IS NULL OR types IS NULL OR array_length(types, 1) IS NULL;
    `;
    
    console.log('Updating cards in bulk...');
    await execPromise(`docker exec pokemon-catalog-db psql -U postgres -d pokemon_catalog -c "${bulkUpdateSql.replace(/\n/g, ' ')}"`);
    
    // Verify update
    const { stdout: count } = await execPromise(`docker exec pokemon-catalog-db psql -U postgres -d pokemon_catalog -t -c "SELECT COUNT(*) FROM \\"Card\\" WHERE hp IS NOT NULL AND rarity IS NOT NULL"`);
    console.log(`\nCards with complete data: ${count.trim()}`);
    
    const { stdout: sample } = await execPromise(`docker exec pokemon-catalog-db psql -U postgres -d pokemon_catalog -c "SELECT name, hp, rarity, types, artist FROM \\"Card\\" LIMIT 10"`);
    console.log('\nSample cards after update:');
    console.log(sample);
    
  } catch (err) {
    console.error('Update error:', err);
  }
}

quickUpdate();