// Temporary mock data until Elasticsearch issue is resolved
export const mockCards = [
  {
    id: 'xy1-1',
    name: 'Pikachu',
    hp: '60',
    rarity: 'Common',
    types: ['Lightning'],
    setName: 'XY Base Set',
    setSeries: 'XY',
    artist: 'Ken Sugimori'
  },
  {
    id: 'base1-4',
    name: 'Charizard',
    hp: '120',
    rarity: 'Rare Holo',
    types: ['Fire'],
    setName: 'Base Set',
    setSeries: 'Base',
    artist: 'Mitsuhiro Arita'
  },
  {
    id: 'base1-15',
    name: 'Venusaur',
    hp: '100',
    rarity: 'Rare Holo',
    types: ['Grass'],
    setName: 'Base Set',
    setSeries: 'Base',
    artist: 'Mitsuhiro Arita'
  },
  {
    id: 'base1-2',
    name: 'Blastoise',
    hp: '100',
    rarity: 'Rare Holo',
    types: ['Water'],
    setName: 'Base Set',
    setSeries: 'Base',
    artist: 'Mitsuhiro Arita'
  },
  {
    id: 'sm1-35',
    name: 'Solgaleo',
    hp: '170',
    rarity: 'Rare Holo',
    types: ['Metal'],
    setName: 'Sun & Moon',
    setSeries: 'Sun & Moon',
    artist: '5ban Graphics'
  },
  {
    id: 'sm1-39',
    name: 'Lunala',
    hp: '160',
    rarity: 'Rare Holo',
    types: ['Psychic'],
    setName: 'Sun & Moon',
    setSeries: 'Sun & Moon',
    artist: '5ban Graphics'
  }
]

// Function to simulate search results
export function searchMockCards(query: string = '', limit: number = 20) {
  const filtered = query 
    ? mockCards.filter(card => 
        card.name.toLowerCase().includes(query.toLowerCase()) ||
        card.types.some(type => type.toLowerCase().includes(query.toLowerCase()))
      )
    : mockCards

  return {
    total: filtered.length,
    cards: filtered.slice(0, limit)
  }
}