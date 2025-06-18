'use client'

import { Button } from '@/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { TypeBadge } from '@/components/pokemon/type-badge'
import { PokemonCard } from '@/components/pokemon/pokemon-card'
import { PokemonGrid } from '@/components/pokemon/pokemon-grid'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'

const pokemonTypes = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const

const samplePokemon = [
  {
    id: 'base1-1',
    name: 'Alakazam',
    image: '/api/placeholder/300/400',
    types: ['psychic'],
    hp: 80,
    rarity: 'Rare Holo',
    price: 45.99
  },
  {
    id: 'base1-4',
    name: 'Charizard',
    image: '/api/placeholder/300/400',
    types: ['fire', 'flying'],
    hp: 120,
    rarity: 'Rare Holo',
    price: 399.99
  },
  {
    id: 'base1-15',
    name: 'Venusaur',
    image: '/api/placeholder/300/400',
    types: ['grass', 'poison'],
    hp: 100,
    rarity: 'Rare Holo',
    price: 89.99
  }
]

export default function DesignSystemPage() {
  const { toast } = useToast()
  
  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold">Pokemon Catalog Design System</h1>
        <p className="text-xl text-muted-foreground">
          A comprehensive design system for the Pokemon Card Catalog application
        </p>
      </div>

      {/* Typography */}
      <Card className="p-8">
        <h2 className="text-3xl font-bold mb-6">Typography</h2>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">text-5xl</p>
            <h1 className="text-5xl">The quick brown fox jumps over the lazy dog</h1>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">text-4xl</p>
            <h2 className="text-4xl">The quick brown fox jumps over the lazy dog</h2>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">text-3xl</p>
            <h3 className="text-3xl">The quick brown fox jumps over the lazy dog</h3>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">text-2xl</p>
            <h4 className="text-2xl">The quick brown fox jumps over the lazy dog</h4>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">text-xl</p>
            <h5 className="text-xl">The quick brown fox jumps over the lazy dog</h5>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">text-lg</p>
            <p className="text-lg">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">text-base</p>
            <p className="text-base">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">text-sm</p>
            <p className="text-sm">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">text-xs</p>
            <p className="text-xs">The quick brown fox jumps over the lazy dog</p>
          </div>
        </div>
      </Card>

      {/* Colors */}
      <Card className="p-8">
        <h2 className="text-3xl font-bold mb-6">Colors</h2>
        
        {/* Brand Colors */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Brand Colors</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-primary rounded-lg" />
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">Pokemon Yellow</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-secondary rounded-lg" />
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">Neutral Gray</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-accent rounded-lg" />
              <p className="text-sm font-medium">Accent</p>
              <p className="text-xs text-muted-foreground">Light Gray</p>
            </div>
          </div>
        </div>

        {/* Pokemon Type Colors */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Pokemon Type Colors</h3>
          <div className="grid grid-cols-6 gap-4">
            {pokemonTypes.map((type) => (
              <div key={type} className="space-y-2">
                <div className={`h-20 bg-pokemon-${type} rounded-lg`} />
                <p className="text-sm font-medium capitalize">{type}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Spacing */}
      <Card className="p-8">
        <h2 className="text-3xl font-bold mb-6">Spacing System</h2>
        <p className="text-muted-foreground mb-6">Based on 4px unit</p>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32].map((space) => (
            <div key={space} className="flex items-center gap-4">
              <p className="text-sm font-mono w-16">space-{space}</p>
              <div className={`h-4 bg-primary rounded w-${space}`} />
              <p className="text-sm text-muted-foreground">{space * 4}px</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Buttons */}
      <Card className="p-8">
        <h2 className="text-3xl font-bold mb-6">Buttons</h2>
        
        {/* Button Variants */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Variants</h3>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="pokemon">Pokemon</Button>
          </div>
        </div>

        {/* Button Sizes */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Sizes</h3>
          <div className="flex items-center gap-4">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🎮</Button>
          </div>
        </div>
      </Card>

      {/* Type Badges */}
      <Card className="p-8">
        <h2 className="text-3xl font-bold mb-6">Pokemon Type Badges</h2>
        <div className="grid grid-cols-6 gap-4">
          {pokemonTypes.map((type) => (
            <TypeBadge key={type} type={type as any} />
          ))}
        </div>
      </Card>

      {/* Shadows */}
      <Card className="p-8">
        <h2 className="text-3xl font-bold mb-6">Shadows</h2>
        <div className="grid grid-cols-3 gap-8">
          {['xs', 'sm', 'default', 'md', 'lg', 'xl'].map((shadow) => (
            <div key={shadow} className="space-y-2">
              <div 
                className={`h-20 bg-background rounded-lg shadow-${shadow === 'default' ? '' : shadow}`}
                style={{
                  boxShadow: `var(--shadow-${shadow === 'default' ? 'default' : shadow})`
                }}
              />
              <p className="text-sm font-medium">shadow-{shadow}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Animations */}
      <Card className="p-8">
        <h2 className="text-3xl font-bold mb-6">Animations</h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="h-20 bg-primary rounded-lg animate-fade-in" />
            <p className="text-sm font-medium">fade-in</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-primary rounded-lg animate-slide-up" />
            <p className="text-sm font-medium">slide-up</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-primary rounded-lg animate-scale-in" />
            <p className="text-sm font-medium">scale-in</p>
          </div>
        </div>
      </Card>

      {/* Form Components */}
      <Card className="p-8">
        <h2 className="text-3xl font-bold mb-6">Form Components</h2>
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="ash@pokemon.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer">Trainer Name</Label>
              <Input id="trainer" placeholder="Ash Ketchum" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Tell us about your Pokemon journey..." />
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label>Favorite Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {pokemonTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <span className="capitalize">{type}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <Label>Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" />
                  <Label htmlFor="newsletter" className="font-normal">
                    Send me Pokemon news
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications" className="font-normal">
                    Enable notifications
                  </Label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Team</Label>
            <RadioGroup defaultValue="valor">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="valor" id="valor" />
                <Label htmlFor="valor" className="font-normal">Team Valor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mystic" id="mystic" />
                <Label htmlFor="mystic" className="font-normal">Team Mystic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instinct" id="instinct" />
                <Label htmlFor="instinct" className="font-normal">Team Instinct</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* Pokemon Cards */}
      <Card className="p-8">
        <h2 className="text-3xl font-bold mb-6">Pokemon Cards</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Single Card</h3>
            <div className="max-w-xs">
              <PokemonCard {...samplePokemon[1]} />
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Card Grid</h3>
            <PokemonGrid 
              cards={samplePokemon} 
              onCardClick={(id) => {
                toast({
                  title: "Card Clicked",
                  description: `You clicked on card ${id}`,
                })
              }}
            />
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Loading States</h3>
            <div className="grid grid-cols-3 gap-4">
              <PokemonCard id="" name="" loading />
              <Skeleton className="h-32 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}