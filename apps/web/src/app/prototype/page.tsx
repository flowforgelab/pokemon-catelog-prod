'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { PokemonGrid } from '@/components/pokemon/pokemon-grid'
import { ArrowRight, Search } from 'lucide-react'

// Mock data
const mockResults = [
  { id: 'base1-4', name: 'Charizard', types: ['fire', 'flying'], hp: 120, rarity: 'Rare', price: 399.99 },
  { id: 'base1-6', name: 'Gyarados', types: ['water', 'flying'], hp: 100, rarity: 'Rare', price: 45.00 },
  { id: 'base1-9', name: 'Magneton', types: ['electric'], hp: 60, rarity: 'Rare', price: 12.50 },
]

export default function PrototypePage() {
  const [flow, setFlow] = useState<'home' | 'search' | 'results' | 'detail' | 'added'>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()

  const handleSearch = () => {
    if (searchQuery) {
      setFlow('results')
      toast({
        title: "Search performed",
        description: `Found 3 results for "${searchQuery}"`,
      })
    }
  }

  const handleCardClick = () => {
    setFlow('detail')
  }

  const handleAddToCollection = () => {
    setFlow('added')
    toast({
      title: "Success!",
      description: "Charizard added to your collection",
    })
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Interactive UX Prototype</CardTitle>
          <p className="text-muted-foreground">
            Experience the key user flow: Search → Select → Add to Collection
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center ${flow !== 'home' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${flow !== 'home' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                1
              </div>
              <span className="ml-2 text-sm">Search</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center ${flow === 'results' || flow === 'detail' || flow === 'added' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${flow === 'results' || flow === 'detail' || flow === 'added' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                2
              </div>
              <span className="ml-2 text-sm">Select</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center ${flow === 'added' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${flow === 'added' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span className="ml-2 text-sm">Collect</span>
            </div>
          </div>

          {/* Flow states */}
          {flow === 'home' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Welcome! Search for a Pokemon card</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Try searching for 'Charizard'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={!searchQuery}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          )}

          {flow === 'results' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Search Results for "{searchQuery}"</h2>
              <PokemonGrid cards={mockResults} onCardClick={handleCardClick} />
              <Button variant="outline" onClick={() => setFlow('home')}>
                New Search
              </Button>
            </div>
          )}

          {flow === 'detail' && (
            <div className="space-y-4">
              <Button variant="ghost" onClick={() => setFlow('results')}>
                ← Back to results
              </Button>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Card Image</span>
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Charizard</h2>
                  <p className="text-muted-foreground">Base Set • 4/102 • Rare Holo</p>
                  <div className="text-2xl font-bold">$399.99</div>
                  <Button onClick={handleAddToCollection} className="w-full">
                    Add to Collection
                  </Button>
                  <div className="pt-4 space-y-2 text-sm">
                    <p><strong>HP:</strong> 120</p>
                    <p><strong>Types:</strong> Fire, Flying</p>
                    <p><strong>Rarity:</strong> Rare Holo</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {flow === 'added' && (
            <div className="text-center space-y-4 py-8">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold">Successfully Added!</h2>
              <p className="text-muted-foreground">
                Charizard has been added to your collection
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setFlow('home')}>Search Again</Button>
                <Button variant="outline">View Collection</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* UX Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>UX Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Search-first approach reduces time to value</li>
            <li>• Visual progress indicator shows user where they are</li>
            <li>• Clear CTAs guide users through the flow</li>
            <li>• Success state provides next action options</li>
            <li>• Back navigation maintains context</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}