'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useQuery, useMutation } from '@apollo/client'
import { GET_MY_DECKS } from '@/lib/graphql/queries'
import { CREATE_DECK } from '@/lib/graphql/mutations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Copy, Share2, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

// Transform deck data from GraphQL to component format
const transformDeck = (deck: any) => ({
  id: deck.id,
  name: deck.name,
  format: deck.format,
  pokemon: 0, // TODO: Calculate from cards
  trainers: 0, // TODO: Calculate from cards  
  energy: 0, // TODO: Calculate from cards
  isValid: true, // TODO: Use deck validation
  wins: 0, // TODO: Add win/loss tracking
  losses: 0,
  lastModified: new Date(deck.updatedAt).toLocaleDateString()
})

export default function DecksPage() {
  const { data, loading, refetch } = useQuery(GET_MY_DECKS, {
    errorPolicy: 'all'
  })
  
  const [createDeck] = useMutation(CREATE_DECK, {
    onCompleted: () => {
      setNewDeckName('')
      refetch()
    }
  })
  
  const rawDecks = data?.myDecks || []
  const decks = rawDecks.map(transformDeck)
  const [newDeckName, setNewDeckName] = useState('')
  const [newDeckFormat, setNewDeckFormat] = useState('standard')
  const [activeTab, setActiveTab] = useState('all')

  const filteredDecks = activeTab === 'all' 
    ? decks 
    : decks.filter((deck: any) => deck.format.toLowerCase() === activeTab)

  const handleCreateDeck = async () => {
    if (!newDeckName.trim()) return
    
    await createDeck({
      variables: {
        input: {
          name: newDeckName,
          format: newDeckFormat.toUpperCase()
        }
      }
    })
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Decks</h1>
            <p className="text-muted-foreground">Build and manage your competitive decks</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Deck
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Deck</DialogTitle>
                <DialogDescription>
                  Start building a new deck for competitive play
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="deck-name">Deck Name</Label>
                  <Input
                    id="deck-name"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    placeholder="e.g., Lightning Strike"
                  />
                </div>
                <div>
                  <Label htmlFor="format">Format</Label>
                  <Select value={newDeckFormat} onValueChange={setNewDeckFormat}>
                    <SelectTrigger id="format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="expanded">Expanded</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateDeck}>Create Deck</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Format Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Decks</TabsTrigger>
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="expanded">Expanded</TabsTrigger>
            <TabsTrigger value="unlimited">Unlimited</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDecks.map((deck: any) => (
                <Card key={deck.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{deck.name}</CardTitle>
                        <CardDescription>
                          Modified {deck.lastModified}
                        </CardDescription>
                      </div>
                      <Badge variant={deck.format === 'Standard' ? 'default' : 'secondary'}>
                        {deck.format}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Deck Composition */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pokemon</span>
                        <span>{deck.pokemon}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trainers</span>
                        <span>{deck.trainers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Energy</span>
                        <span>{deck.energy}</span>
                      </div>
                    </div>

                    {/* Validation Status */}
                    <div className={`flex items-center gap-2 text-sm ${deck.isValid ? 'text-green-600' : 'text-destructive'}`}>
                      {deck.isValid ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Legal for {deck.format}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          <span>Not enough cards (55/60)</span>
                        </>
                      )}
                    </div>

                    {/* Win/Loss Record */}
                    {deck.wins + deck.losses > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Record: {deck.wins}W - {deck.losses}L
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button className="flex-1" variant="secondary" asChild>
                        <Link href={`/decks/${deck.id}`}>
                          Edit Deck
                        </Link>
                      </Button>
                      <Button size="icon" variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Create Deck Card */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px]">
                      <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Create New Deck</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </ProtectedRoute>
  )
}