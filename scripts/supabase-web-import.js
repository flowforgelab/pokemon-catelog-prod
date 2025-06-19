// Web-based import script for smaller batches
// Run this in browser console on Supabase SQL Editor page

const BATCH_SIZE = 100;
const sampleCards = [
  {
    tcgId: "xy1-1",
    name: "Venusaur-EX",
    supertype: "Pokémon",
    subtypes: ["Basic", "EX"],
    types: ["Grass"],
    hp: 180,
    number: "1",
    artist: "Eske Yoshinob",
    rarity: "Rare Holo EX",
    setId: "xy1",
    setName: "XY",
    setSeries: "XY",
    setReleaseDate: "2014-02-05",
    imageSmall: "https://images.pokemontcg.io/xy1/1.png",
    imageLarge: "https://images.pokemontcg.io/xy1/1_hires.png",
    marketPrice: 12.50,
    animeEra: "XY",
    standardLegal: false,
    expandedLegal: true,
    unlimitedLegal: true
  }
  // Add more sample cards here
];

function generateInsertSQL(cards) {
  const values = cards.map(card => `(
    '${card.tcgId}',
    '${card.name.replace(/'/g, "''")}',
    '${card.supertype}',
    ARRAY[${card.subtypes ? card.subtypes.map(s => `'${s}'`).join(',') : ''}],
    ARRAY[${card.types ? card.types.map(t => `'${t}'`).join(',') : ''}],
    ${card.hp || 'NULL'},
    ARRAY[]::TEXT[],
    '${card.number}',
    '${card.artist || ''}',
    '${card.rarity || ''}',
    NULL,
    '${card.setId}',
    '${card.setName}',
    NULL,
    '${card.setSeries}',
    0,
    0,
    '${card.setReleaseDate}T00:00:00.000Z',
    '${card.imageSmall}',
    '${card.imageLarge}',
    ARRAY[]::INTEGER[],
    ARRAY[]::TEXT[],
    NULL,
    ARRAY[]::JSONB[],
    ARRAY[]::JSONB[],
    ARRAY[]::JSONB[],
    ARRAY[]::JSONB[],
    ${card.standardLegal},
    ${card.expandedLegal},
    ${card.unlimitedLegal},
    NULL,
    NULL,
    NULL,
    NULL,
    ${card.marketPrice || 'NULL'},
    '${card.animeEra || ''}',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )`).join(',\n');

  return `
INSERT INTO "Card" (
  "tcgId", "name", "supertype", "subtypes", "types", "hp", "retreatCost",
  "number", "artist", "rarity", "flavorText", "setId", "setName", "setLogo",
  "setSeries", "setPrintedTotal", "setTotal", "setReleaseDate", "imageSmall",
  "imageLarge", "nationalPokedexNumbers", "rules", "ancientTrait", "abilities",
  "attacks", "weaknesses", "resistances", "standardLegal", "expandedLegal",
  "unlimitedLegal", "competitiveRating", "competitiveNotes", "tcgplayerUrl",
  "cardmarketUrl", "marketPrice", "animeEra", "createdAt", "updatedAt"
) VALUES ${values}
ON CONFLICT ("tcgId") DO NOTHING;
`;
}

console.log("Copy this SQL and paste into Supabase SQL Editor:");
console.log(generateInsertSQL(sampleCards));