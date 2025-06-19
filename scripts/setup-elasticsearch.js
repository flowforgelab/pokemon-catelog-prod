const { Client } = require('pg');
const { Client: ElasticClient } = require('@elastic/elasticsearch');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres.zgzvwrhoprhdvdnwofiq:tesfa5-peHbuv-sojnuz@aws-0-us-east-1.pooler.supabase.com:6543/postgres";

// For Railway deployment, Elasticsearch might be available locally or needs to be configured
const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

async function setupElasticsearch() {
  const elasticClient = new ElasticClient({ node: ELASTICSEARCH_URL });
  const dbClient = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Elasticsearch...');
    
    // Check if Elasticsearch is available
    try {
      await elasticClient.ping();
      console.log('✅ Elasticsearch connected');
    } catch (error) {
      console.log('⚠️  Elasticsearch not available - search will use database fallback');
      return;
    }

    // Create index if it doesn't exist
    const indexExists = await elasticClient.indices.exists({ index: 'pokemon-cards' });
    
    if (!indexExists) {
      console.log('Creating Elasticsearch index...');
      await elasticClient.indices.create({
        index: 'pokemon-cards',
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              name: { type: 'text', analyzer: 'standard' },
              supertype: { type: 'keyword' },
              subtypes: { type: 'keyword' },
              types: { type: 'keyword' },
              hp: { type: 'integer' },
              rarity: { type: 'keyword' },
              setName: { type: 'text' },
              setSeries: { type: 'keyword' },
              artist: { type: 'text' },
              text: { type: 'text', analyzer: 'standard' },
            },
          },
        },
      });
      console.log('✅ Index created');
    } else {
      console.log('Index already exists');
    }

    // Populate index with cards from database
    console.log('Connecting to database...');
    await dbClient.connect();
    
    const result = await dbClient.query('SELECT COUNT(*) FROM "Card"');
    const totalCards = parseInt(result.rows[0].count);
    console.log(`Found ${totalCards} cards in database`);

    let offset = 0;
    const batchSize = 1000;
    let indexed = 0;

    while (offset < totalCards) {
      const cardsResult = await dbClient.query(`
        SELECT id, "tcgId", name, supertype, subtypes, types, hp, rarity, 
               "setName", "setSeries", artist, "flavorText"
        FROM "Card" 
        ORDER BY "createdAt" 
        LIMIT $1 OFFSET $2
      `, [batchSize, offset]);

      if (cardsResult.rows.length === 0) break;

      // Prepare bulk index operation
      const body = [];
      for (const card of cardsResult.rows) {
        body.push({ index: { _index: 'pokemon-cards', _id: card.tcgId } });
        body.push({
          id: card.id,
          name: card.name,
          supertype: card.supertype,
          subtypes: card.subtypes,
          types: card.types,
          hp: card.hp,
          rarity: card.rarity,
          setName: card.setName,
          setSeries: card.setSeries,
          artist: card.artist,
          text: card.flavorText || ''
        });
      }

      await elasticClient.bulk({ body });
      indexed += cardsResult.rows.length;
      offset += batchSize;
      
      console.log(`Indexed ${indexed}/${totalCards} cards...`);
    }

    console.log(`✅ Elasticsearch setup completed! Indexed ${indexed} cards`);

  } catch (error) {
    console.error('Setup failed:', error.message);
  } finally {
    if (dbClient) await dbClient.end();
  }
}

setupElasticsearch();