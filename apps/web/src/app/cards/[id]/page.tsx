'use client'

import { use, Suspense } from 'react'
import { useQuery } from '@apollo/client'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Heart, Plus, TrendingUp, TrendingDown, ExternalLink, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { GET_CARD_BY_ID } from '@/lib/graphql/queries'
import { Skeleton } from '@/components/ui/skeleton'

function CardDetailContent({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const returnURL = searchParams.get('return') || '/cards'
  
  // Fetch individual card data
  const { data, loading, error } = useQuery(GET_CARD_BY_ID, {
    variables: { id },
    errorPolicy: 'all'
  })

  const card = data?.card

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid lg:grid-cols-[400px,1fr] gap-8">
          <Skeleton className="aspect-[3/4] rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/cards">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cards
          </Link>
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Card not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Back button */}
      <Button variant="ghost" className="mb-6" asChild>
        <Link href={returnURL}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cards
        </Link>
      </Button>

      <div className="grid lg:grid-cols-[400px,1fr] gap-8">
        {/* Card Image */}
        <div>
          <div className="aspect-[3/4] bg-muted rounded-lg sticky top-4 overflow-hidden">
            {card.imageUrlHiRes || card.imageUrl ? (
              <img 
                src={card.imageUrlHiRes || card.imageUrl} 
                alt={card.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground text-2xl">{card.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-4xl font-bold">{card.name}</h1>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-muted-foreground">
              {card.setName} • {card.rarity} • {card.supertype}
            </p>
            <div className="flex gap-2 mt-3">
              {card.types?.map((type: string) => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type}
                </Badge>
              ))}
              {card.subtypes?.map((subtype: string) => (
                <Badge key={subtype} variant="outline" className="capitalize">
                  {subtype}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Section */}
          <Card>
            <CardHeader>
              <CardTitle>Market Price</CardTitle>
            </CardHeader>
            <CardContent>
              {card.marketPrice ? (
                <div className="space-y-2">
                  <div className="text-2xl font-bold">${card.marketPrice.toFixed(2)}</div>
                  <p className="text-sm text-muted-foreground">Current market price</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Price data not available</p>
              )}
              <div className="space-y-3 mt-4">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Collection
                </Button>
                {card.tcgplayerUrl ? (
                  <Button 
                    variant="default" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                    onClick={() => window.open(card.tcgplayerUrl, '_blank')}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy on TCGPlayer
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Not Available for Purchase
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="prices">Price History</TabsTrigger>
              <TabsTrigger value="similar">Similar Cards</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    {/* Show HP only for Pokemon cards */}
                    {card.supertype === 'Pokémon' && card.hp && (
                      <div>
                        <dt className="font-medium text-muted-foreground">HP</dt>
                        <dd className="font-semibold">{card.hp}</dd>
                      </div>
                    )}
                    {/* Show retreat cost only for Pokemon cards */}
                    {card.supertype === 'Pokémon' && card.retreatCost && card.retreatCost.length > 0 && (
                      <div>
                        <dt className="font-medium text-muted-foreground">Retreat Cost</dt>
                        <dd className="font-semibold">{card.retreatCost.join(', ')}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-medium text-muted-foreground">Artist</dt>
                      <dd className="font-semibold">{card.artist || 'Unknown'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-muted-foreground">Set</dt>
                      <dd className="font-semibold">{card.setName}</dd>
                    </div>
                    {card.number && (
                      <div>
                        <dt className="font-medium text-muted-foreground">Number</dt>
                        <dd className="font-semibold">{card.number}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-medium text-muted-foreground">Legality</dt>
                      <dd className="font-semibold">
                        {card.standardLegal && 'Standard'} {card.expandedLegal && 'Expanded'}
                        {!card.standardLegal && !card.expandedLegal && 'None'}
                      </dd>
                    </div>
                  </dl>
                  
                  {/* Show flavor text if available */}
                  {card.flavorText && (
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Flavor Text</h4>
                      <p className="text-sm italic">{card.flavorText}</p>
                    </div>
                  )}
                  
                  {/* Show abilities for Pokemon cards */}
                  {card.supertype === 'Pokémon' && card.abilities && card.abilities.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Abilities</h4>
                      {card.abilities.map((ability: any, index: number) => (
                        <div key={index} className="mb-3">
                          <h5 className="font-semibold text-sm">{ability.name}</h5>
                          <p className="text-sm text-muted-foreground">{ability.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Show attacks for Pokemon cards */}
                  {card.supertype === 'Pokémon' && card.attacks && card.attacks.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Attacks</h4>
                      {card.attacks.map((attack: any, index: number) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between items-start">
                            <h5 className="font-semibold text-sm">{attack.name}</h5>
                            {attack.damage && <span className="font-bold text-sm">{attack.damage}</span>}
                          </div>
                          {attack.cost && attack.cost.length > 0 && (
                            <p className="text-xs text-muted-foreground">Cost: {attack.cost.join(', ')}</p>
                          )}
                          {attack.text && <p className="text-sm text-muted-foreground mt-1">{attack.text}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="prices">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Price history data is not available for this card.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="similar">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Similar cards from the same set would appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardDetailContent id={id} />
    </Suspense>
  )
}