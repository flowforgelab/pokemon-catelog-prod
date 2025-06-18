'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Minus, Download, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/components/ui/use-toast'

const ADD_CARD = `
  mutation AddCardToDeck($deckId: String!, $cardId: String!, $quantity: Int) {
    addCardToDeck(deckId: $deckId, cardId: $cardId, quantity: $quantity) {
      id
    }
  }
`

const REMOVE_CARD = `
  mutation RemoveCardFromDeck($deckId: String!, $cardId: String!, $quantity: Int) {
    removeCardFromDeck(deckId: $deckId, cardId: $cardId, quantity: $quantity) {
      id
    }
  }
`

interface DeckBuilderProps {
  deck: any
  validation: any
}

export function DeckBuilder({ deck, validation }: DeckBuilderProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  const addMutation = useMutation({
    mutationFn: async ({ cardId, quantity }: any) => {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: ADD_CARD,
          variables: { deckId: deck.id, cardId, quantity }
        })
      })
      const data = await response.json()
      if (data.errors) throw new Error(data.errors[0].message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deck', deck.id] })
    },
    onError: (error) => {
      toast({
        title: 'Failed to add card',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  const removeMutation = useMutation({
    mutationFn: async ({ cardId, quantity }: any) => {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: REMOVE_CARD,
          variables: { deckId: deck.id, cardId, quantity }
        })
      })
      const data = await response.json()
      if (data.errors) throw new Error(data.errors[0].message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deck', deck.id] })
    }
  })

  const groupedCards = {
    pokemon: deck.cards.filter((dc: any) => dc.card.supertype === 'Pokémon'),
    trainer: deck.cards.filter((dc: any) => dc.card.supertype === 'Trainer'),
    energy: deck.cards.filter((dc: any) => dc.card.supertype === 'Energy')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Deck List</h2>
            <div className="flex gap-2">
              <Badge variant={validation.valid ? "default" : "destructive"}>
                {validation.stats.totalCards}/60 cards
              </Badge>
              <Badge variant="outline">{deck.format}</Badge>
            </div>
          </div>

          <ScrollArea className="h-[600px] pr-4">
            {['pokemon', 'trainer', 'energy'].map((type) => (
              <div key={type} className="mb-6">
                <h3 className="font-semibold capitalize mb-2">
                  {type} ({groupedCards[type as keyof typeof groupedCards].length})
                </h3>
                <div className="space-y-2">
                  {groupedCards[type as keyof typeof groupedCards].map((deckCard: any) => (
                    <div key={deckCard.id} className="flex items-center gap-3 p-2 rounded hover:bg-accent">
                      <div className="w-12 h-16 relative">
                        <Image
                          src={deckCard.card.imageUrl}
                          alt={deckCard.card.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{deckCard.card.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {deckCard.card.setName} • {deckCard.card.number}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeMutation.mutate({ 
                            cardId: deckCard.cardId, 
                            quantity: 1 
                          })}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {deckCard.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => addMutation.mutate({ 
                            cardId: deckCard.cardId, 
                            quantity: 1 
                          })}
                          disabled={deckCard.quantity >= 4 && deckCard.card.supertype !== 'Energy'}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Deck Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Pokémon</span>
              <span>{validation.stats.pokemonCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Trainers</span>
              <span>{validation.stats.trainerCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Energy</span>
              <span>{validation.stats.energyCount}</span>
            </div>
          </div>
        </Card>

        {!validation.valid && (
          <Card className="p-4 border-destructive">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <h3 className="font-semibold">Deck Issues</h3>
            </div>
            <ul className="text-sm space-y-1">
              {validation.issues.map((issue: string, i: number) => (
                <li key={i} className="text-destructive">• {issue}</li>
              ))}
            </ul>
          </Card>
        )}

        <Button className="w-full" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Deck
        </Button>
      </div>
    </div>
  )
}