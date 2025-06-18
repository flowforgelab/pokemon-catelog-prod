'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Plus } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

const CREATE_DECK = `
  mutation CreateDeck($input: CreateDeckInput!) {
    createDeck(input: $input) {
      id
      name
      format
    }
  }
`

export function CreateDeckDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [format, setFormat] = useState('standard')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: CREATE_DECK,
          variables: { input: { name, description, format } }
        })
      })
      const data = await response.json()
      if (data.errors) throw new Error(data.errors[0].message)
      return data.data.createDeck
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['decks'] })
      toast({ title: 'Deck created successfully' })
      setOpen(false)
      setName('')
      setDescription('')
      setFormat('standard')
      // Navigate to deck builder
      window.location.href = `/decks/${data.id}`
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to create deck', 
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Deck
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Deck</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Deck"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deck strategy and notes..."
              rows={3}
            />
          </div>
          
          <div>
            <Label>Format</Label>
            <RadioGroup value={format} onValueChange={setFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard">Standard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expanded" id="expanded" />
                <Label htmlFor="expanded">Expanded</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unlimited" id="unlimited" />
                <Label htmlFor="unlimited">Unlimited</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button 
            onClick={() => mutation.mutate()} 
            disabled={!name || mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? 'Creating...' : 'Create Deck'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}