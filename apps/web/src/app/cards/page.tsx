'use client'

import { useState, useEffect, Suspense } from 'react'
import { useQuery } from '@apollo/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { PokemonGrid } from '@/components/pokemon/pokemon-grid'
import { Search, Filter } from 'lucide-react'
import { GET_CARDS } from '@/lib/graphql/queries'

const pokemonTypes = [
  'fire', 'water', 'grass', 'electric', 'psychic', 'ice',
  'dragon', 'dark', 'fairy', 'normal', 'fighting', 'flying',
  'poison', 'ground', 'rock', 'bug', 'ghost', 'steel'
]

const animeEras = [
  'Horizons Era (2023-present)',
  'Journeys Era (2019-2023)',
  'Sun & Moon Era (2016-2019)',
  'XY Era (2013-2016)',
  'Black & White Era (2010-2013)',
  'Diamond & Pearl Era (2007-2011)',
  'Advanced Generation Era (2002-2007)',
  'Johto Era (1999-2002)',
  'Indigo League Era (1998-2000)'
]

const getSortOrder = (sortBy: string) => {
  // For name and series, we want ascending order by default
  if (sortBy === 'name' || sortBy === 'series' || sortBy === 'set' || sortBy === 'number') {
    return 'asc'
  }
  // For price, HP, rarity, and release date, we want descending (high to low, newest first)
  return 'desc'
}

function CardsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedAnimeEras, setSelectedAnimeEras] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [previousPage, setPreviousPage] = useState(1) // Store previous page before search
  const cardsPerPage = 20

  const { data, loading, error, refetch } = useQuery(GET_CARDS, {
    variables: {
      input: {
        query: searchQuery || '',
        page: currentPage,
        limit: cardsPerPage,
        sortBy: sortBy,
        sortOrder: getSortOrder(sortBy),
        animeEras: selectedAnimeEras.length > 0 ? selectedAnimeEras : undefined
      }
    },
    errorPolicy: 'all'
  })

  // Update search when URL params change
  useEffect(() => {
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    setSearchQuery(search)
    setCurrentPage(page)
  }, [searchParams])

  // Refetch when sort or filters change
  useEffect(() => {
    refetch()
  }, [sortBy, selectedAnimeEras, refetch])

  // Update URL when search or page changes
  const updateURL = (newSearch: string, newPage: number) => {
    const params = new URLSearchParams()
    if (newSearch) {
      params.set('search', newSearch)
    }
    if (newPage > 1) {
      params.set('page', newPage.toString())
    }
    
    const newURL = params.toString() ? `/cards?${params.toString()}` : '/cards'
    router.replace(newURL)
  }

  // Transform cards for PokemonGrid (no client-side sorting needed - done on backend)
  const transformedCards = data?.searchCards?.cards?.map((card: any) => ({
    id: card.id,
    name: card.name,
    types: card.types || [],
    hp: card.hp,
    rarity: card.rarity,
    price: card.marketPrice || 0,
    image: card.imageSmall,
    tcgplayerUrl: card.tcgplayerUrl
  })) || []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Reset to page 1 when starting a new search
    const newPage = 1
    setCurrentPage(newPage)
    updateURL(searchQuery, newPage)
  }

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value)
    
    // If user starts typing and we're not on page 1, reset to page 1
    if (value && currentPage > 1) {
      const newPage = 1
      setCurrentPage(newPage)
      updateURL(value, newPage)
    }
    // If user clears search completely, restore previous page (if reasonable)
    else if (!value && searchQuery && previousPage > 1) {
      const newPage = previousPage
      setCurrentPage(newPage)
      updateURL(value, newPage)
    }
    // Otherwise just update the search query in URL
    else {
      updateURL(value, currentPage)
    }
  }

  const handlePageChange = (newPage: number) => {
    // Store current page as previous page before changing
    if (!searchQuery) {
      setPreviousPage(currentPage)
    }
    setCurrentPage(newPage)
    updateURL(searchQuery, newPage)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Browse Cards</h1>
          <p className="text-muted-foreground">
            Explore our collection of {data?.searchCards?.total || 0} Pokemon cards
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </form>

          {/* Collapsible Filters */}
          {showFilters && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sort */}
                <div>
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="price-high">💰 Price: High to Low</SelectItem>
                      <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                      <SelectItem value="release-date">🆕 Newest Sets First</SelectItem>
                      <SelectItem value="series">📚 Series (Base, EX, etc.)</SelectItem>
                      <SelectItem value="set">📦 Set Name</SelectItem>
                      <SelectItem value="rarity">✨ Rarity (Rare First)</SelectItem>
                      <SelectItem value="hp">❤️ HP (High to Low)</SelectItem>
                      <SelectItem value="number">🔢 Card Number</SelectItem>
                      <SelectItem value="release-date">📺 Anime Era (Newest)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div>
                  <Label>Pokemon Type</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                    {pokemonTypes.slice(0, 6).map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTypes([...selectedTypes, type])
                            } else {
                              setSelectedTypes(selectedTypes.filter(t => t !== type))
                            }
                          }}
                        />
                        <Label htmlFor={type} className="text-sm capitalize">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Anime Era Filter */}
                <div>
                  <Label>📺 Anime Era</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                    {animeEras.map(era => (
                      <div key={era} className="flex items-center space-x-2">
                        <Checkbox
                          id={era}
                          checked={selectedAnimeEras.includes(era)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAnimeEras([...selectedAnimeEras, era])
                            } else {
                              setSelectedAnimeEras(selectedAnimeEras.filter(e => e !== era))
                            }
                          }}
                        />
                        <Label htmlFor={era} className="text-sm">
                          {era.replace(' Era', '').replace(' (', ' (')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTypes([])
                    setSelectedAnimeEras([])
                    setSortBy('name')
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        <div>
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">
              <p className="font-semibold">Unable to load cards</p>
              <p className="text-sm mt-1">There was an error connecting to the server. Please try again later.</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground mb-4">
            Showing {transformedCards.length} of {data?.searchCards?.total || 0} cards
          </p>
          <PokemonGrid 
            cards={transformedCards} 
            loading={loading}
            onCardClick={(cardId) => {
              // Preserve current search and page state in URL when navigating to card detail
              const currentParams = new URLSearchParams()
              if (searchQuery) currentParams.set('search', searchQuery)
              if (currentPage > 1) currentParams.set('page', currentPage.toString())
              
              const returnURL = currentParams.toString() ? `/cards?${currentParams.toString()}` : '/cards'
              router.push(`/cards/${cardId}?return=${encodeURIComponent(returnURL)}`)
            }}
          />
          
          {/* Pagination */}
          {data?.searchCards?.total > cardsPerPage && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm px-4">
                Page {currentPage} of {Math.ceil(data.searchCards.total / cardsPerPage)}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.min(Math.ceil(data.searchCards.total / cardsPerPage), currentPage + 1))}
                disabled={currentPage >= Math.ceil(data.searchCards.total / cardsPerPage)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CardsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardsContent />
    </Suspense>
  )
}