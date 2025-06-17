export type PokemonType = 
  | 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Psychic' 
  | 'Ice' | 'Dragon' | 'Dark' | 'Fairy' | 'Normal' 
  | 'Fighting' | 'Flying' | 'Poison' | 'Ground' 
  | 'Rock' | 'Bug' | 'Ghost' | 'Steel' | 'Colorless'

export type CardSupertype = 'Pokemon' | 'Trainer' | 'Energy'

export type CardRarity = 
  | 'Common' | 'Uncommon' | 'Rare' | 'Rare Holo' 
  | 'Rare Ultra' | 'Rare Secret' | 'Rare Prime' 
  | 'Rare ACE' | 'Rare BREAK' | 'Rare Holo EX' 
  | 'Rare Holo GX' | 'Rare Holo V' | 'Rare Holo VMAX'
  | 'Rare Holo VSTAR' | 'Amazing Rare' | 'Promo'

export type CardCondition = 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'

export interface Attack {
  name: string
  cost: string[]
  damage: string
  text?: string
  convertedEnergyCost: number
}

export interface Ability {
  name: string
  text: string
  type: 'Ability' | 'Poke-Power' | 'Poke-Body'
}

export interface Weakness {
  type: PokemonType
  value: string
}

export interface Resistance {
  type: PokemonType
  value: string
}

export interface Card {
  id: string
  tcgId: string
  name: string
  supertype: CardSupertype
  subtypes: string[]
  types: PokemonType[]
  hp?: number
  retreatCost?: string[]
  number: string
  artist?: string
  rarity?: CardRarity
  flavorText?: string
  
  // Set information
  setId: string
  setName: string
  setLogo?: string
  setSeries: string
  setPrintedTotal: number
  setTotal: number
  setReleaseDate: Date
  
  // Images
  imageSmall: string
  imageLarge: string
  
  // Game data
  nationalPokedexNumbers?: number[]
  rules?: string[]
  ancientTrait?: any
  abilities?: Ability[]
  attacks?: Attack[]
  weaknesses?: Weakness[]
  resistances?: Resistance[]
  
  // Legalities
  standardLegal: boolean
  expandedLegal: boolean
  unlimitedLegal: boolean
  
  // Competitive data
  competitiveRating?: number
  competitiveNotes?: string
  
  // Market data
  tcgplayerUrl?: string
  cardmarketUrl?: string
}

export interface PriceData {
  source: 'tcgplayer' | 'cardmarket'
  condition: CardCondition
  marketPrice?: number
  lowPrice?: number
  midPrice?: number
  highPrice?: number
  directLow?: number
  updatedAt: Date
}