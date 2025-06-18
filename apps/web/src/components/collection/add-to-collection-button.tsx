'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

const GET_COLLECTIONS = `
  query MyCollections {
    myCollections {
      id
      name
    }
  }
`

const ADD_CARD = `
  mutation AddCardToCollection($input: AddCardInput!) {
    addCardToCollection(input: $input) {
      id
    }
  }
`

interface AddToCollectionButtonProps {
  cardId: string
  cardName: string
}

export function AddToCollectionButton({ cardId, cardName }: AddToCollectionButtonProps) {
  const [open, setOpen] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [condition, setCondition] = useState('NM')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: collections, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: GET_COLLECTIONS })
      })
      const data = await response.json()
      return data.data?.myCollections || []
    }
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: ADD_CARD,
          variables: {
            input: {
              collectionId: selectedCollection,
              cardId,
              quantity: parseInt(quantity),
              condition
            }
          }
        })
      })
      const data = await response.json()
      if (data.errors) throw new Error(data.errors[0].message)
      return data.data.addCardToCollection
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection', selectedCollection] })
      toast({ title: `Added ${cardName} to collection` })
      setOpen(false)
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to add card', 
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" variant="outline">
        <Plus className="w-4 h-4 mr-1" />
        Collection
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Collection</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : collections?.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              You don't have any collections yet. Create one first!
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="collection">Collection</Label>
                <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections?.map((collection: any) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NM">Near Mint</SelectItem>
                      <SelectItem value="LP">Lightly Played</SelectItem>
                      <SelectItem value="MP">Moderately Played</SelectItem>
                      <SelectItem value="HP">Heavily Played</SelectItem>
                      <SelectItem value="DMG">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={() => mutation.mutate()} 
                disabled={!selectedCollection || mutation.isPending}
                className="w-full"
              >
                {mutation.isPending ? 'Adding...' : 'Add to Collection'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}