const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.zgzvwrhoprhdvdnwofiq:tesfa5-peHbuv-sojnuz@aws-0-us-east-1.pooler.supabase.com:6543/postgres";

const sampleCards = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    tcgId: 'base1-1',
    name: 'Alakazam',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    types: ['Psychic'],
    hp: 80,
    retreatCost: ['Colorless', 'Colorless', 'Colorless'],
    number: '1',
    artist: 'Ken Sugimori',
    rarity: 'Rare Holo',
    flavorText: 'Its brain can outperform a supercomputer.',
    setId: 'base1',
    setName: 'Base',
    setSeries: 'Base',
    setPrintedTotal: 102,
    setTotal: 102,
    setReleaseDate: '1999-01-09',
    imageSmall: 'https://images.pokemontcg.io/base1/1.png',
    imageLarge: 'https://images.pokemontcg.io/base1/1_hires.png',
    nationalPokedexNumbers: [65],
    rules: [],
    abilities: [],
    attacks: [],
    weaknesses: [],
    resistances: [],
    marketPrice: 45.99
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    tcgId: 'base1-4',
    name: 'Charizard',
    supertype: 'Pokémon',
    subtypes: ['Stage 2'],
    types: ['Fire'],
    hp: 120,
    retreatCost: ['Colorless', 'Colorless', 'Colorless'],
    number: '4',
    artist: 'Mitsuhiro Arita',
    rarity: 'Rare Holo',
    flavorText: 'Spits fire that is hot enough to melt boulders.',
    setId: 'base1',
    setName: 'Base',
    setSeries: 'Base',
    setPrintedTotal: 102,
    setTotal: 102,
    setReleaseDate: '1999-01-09',
    imageSmall: 'https://images.pokemontcg.io/base1/4.png',
    imageLarge: 'https://images.pokemontcg.io/base1/4_hires.png',
    nationalPokedexNumbers: [6],
    rules: [],
    abilities: [],
    attacks: [],
    weaknesses: [],
    resistances: [],
    marketPrice: 89.99
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    tcgId: 'base1-25',
    name: 'Pikachu',
    supertype: 'Pokémon',
    subtypes: ['Basic'],
    types: ['Lightning'],
    hp: 40,
    retreatCost: ['Colorless'],
    number: '25',
    artist: 'Mitsuhiro Arita',
    rarity: 'Common',
    flavorText: 'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
    setId: 'base1',
    setName: 'Base',
    setSeries: 'Base',
    setPrintedTotal: 102,
    setTotal: 102,
    setReleaseDate: '1999-01-09',
    imageSmall: 'https://images.pokemontcg.io/base1/25.png',
    imageLarge: 'https://images.pokemontcg.io/base1/25_hires.png',
    nationalPokedexNumbers: [25],
    rules: [],
    abilities: [],
    attacks: [],
    weaknesses: [],
    resistances: [],
    marketPrice: 12.99
  }
];

async function importMinimalCards() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    for (const card of sampleCards) {
      const query = `
        INSERT INTO "Card" (
          id, "tcgId", name, supertype, subtypes, types, hp, "retreatCost",
          number, artist, rarity, "flavorText", "setId", "setName", "setSeries",
          "setPrintedTotal", "setTotal", "setReleaseDate", "imageSmall", "imageLarge",
          "nationalPokedexNumbers", rules, abilities, attacks, weaknesses, resistances,
          "marketPrice", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, NOW(), NOW()
        ) ON CONFLICT ("tcgId") DO NOTHING
      `;
      
      await client.query(query, [
        card.id, card.tcgId, card.name, card.supertype, card.subtypes,
        card.types, card.hp, card.retreatCost, card.number, card.artist,
        card.rarity, card.flavorText, card.setId, card.setName, card.setSeries,
        card.setPrintedTotal, card.setTotal, card.setReleaseDate, card.imageSmall, card.imageLarge,
        card.nationalPokedexNumbers, card.rules, card.abilities, card.attacks, card.weaknesses, card.resistances,
        card.marketPrice
      ]);
      
      console.log(`Imported: ${card.name}`);
    }

    const result = await client.query('SELECT COUNT(*) FROM "Card"');
    console.log(`Total cards in database: ${result.rows[0].count}`);

  } catch (err) {
    console.error('Import error:', err.message);
  } finally {
    await client.end();
  }
}

importMinimalCards();