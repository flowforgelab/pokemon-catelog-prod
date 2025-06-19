'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Star, Zap, Shield } from 'lucide-react'
import Image from 'next/image'

interface CardRecommendation {
  card: {
    id: string
    name: string
    imageSmall: string
    types: string[]
    rarity: string
    marketPrice?: number
  }
  reasoning: string
  priority: 'high' | 'medium' | 'low'
  replacementFor?: {
    id: string
    name: string
  }
  synergies: string[]
}

interface CardRecommendationsProps {
  recommendations: CardRecommendation[]
  onAddCard?: (cardId: string) => void
}

const priorityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
}

const priorityIcons = {
  high: Star,
  medium: Zap,
  low: Shield
}

export function CardRecommendations({ recommendations, onAddCard }: CardRecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Card Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No recommendations available. Try analyzing your deck first.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const PriorityIcon = priorityIcons[rec.priority]
            
            return (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {/* Card Image */}
                  <div className="w-16 h-22 relative rounded overflow-hidden bg-muted flex-shrink-0">
                    {rec.card.imageSmall ? (
                      <Image
                        src={rec.card.imageSmall}
                        alt={rec.card.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{rec.card.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={priorityColors[rec.priority]}>
                            <PriorityIcon className="h-3 w-3 mr-1" />
                            {rec.priority}
                          </Badge>
                          {rec.card.marketPrice && (
                            <span className="text-sm text-muted-foreground">
                              ${rec.card.marketPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {onAddCard && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onAddCard(rec.card.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>

                    {/* Reasoning */}
                    <p className="text-sm text-muted-foreground mb-2">
                      {rec.reasoning}
                    </p>

                    {/* Replacement Info */}
                    {rec.replacementFor && (
                      <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-2">
                        Consider replacing: {rec.replacementFor.name}
                      </div>
                    )}

                    {/* Synergies */}
                    {rec.synergies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rec.synergies.map((synergy, synergyIndex) => (
                          <Badge 
                            key={synergyIndex} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {synergy}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}