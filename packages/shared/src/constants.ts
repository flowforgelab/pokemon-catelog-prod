export const POKEMON_TYPES = [
  'Fire', 'Water', 'Grass', 'Electric', 'Psychic',
  'Ice', 'Dragon', 'Dark', 'Fairy', 'Normal',
  'Fighting', 'Flying', 'Poison', 'Ground',
  'Rock', 'Bug', 'Ghost', 'Steel', 'Colorless'
] as const

export const CARD_CONDITIONS = {
  NM: 'Near Mint',
  LP: 'Lightly Played',
  MP: 'Moderately Played',
  HP: 'Heavily Played',
  DMG: 'Damaged'
} as const

export const DECK_FORMATS = {
  standard: 'Standard',
  expanded: 'Expanded',
  unlimited: 'Unlimited'
} as const

export const MAX_DECK_SIZE = 60
export const MAX_COPIES_PER_CARD = 4
export const MAX_COPIES_BASIC_ENERGY = 59

export const TYPE_COLORS = {
  Fire: '#F08030',
  Water: '#6890F0',
  Grass: '#78C850',
  Electric: '#F8D030',
  Psychic: '#F85888',
  Ice: '#98D8D8',
  Dragon: '#7038F8',
  Dark: '#705848',
  Fairy: '#EE99AC',
  Normal: '#A8A878',
  Fighting: '#C03028',
  Flying: '#A890F0',
  Poison: '#A040A0',
  Ground: '#E0C068',
  Rock: '#B8A038',
  Bug: '#A8B820',
  Ghost: '#705898',
  Steel: '#B8B8D0',
  Colorless: '#A8A878'
} as const

export const RARITY_COLORS = {
  Common: '#000000',
  Uncommon: '#4B5563',
  Rare: '#EAB308',
  'Rare Holo': '#3B82F6',
  'Rare Ultra': '#8B5CF6',
  'Rare Secret': '#EC4899'
} as const