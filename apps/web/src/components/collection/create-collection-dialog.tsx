'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

const CREATE_COLLECTION = `
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
      name
      description
    }
  }
`

export function CreateCollectionDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: CREATE_COLLECTION,
          variables: { input: { name, description } }
        })
      })
      const data = await response.json()
      if (data.errors) throw new Error(data.errors[0].message)
      return data.data.createCollection
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      toast({ title: 'Collection created successfully' })
      setOpen(false)
      setName('')
      setDescription('')
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to create collection', 
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
          New Collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Pokemon Collection"
            />
          </div>
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your collection..."
              rows={3}
            />
          </div>
          <Button 
            onClick={() => mutation.mutate()} 
            disabled={!name || mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? 'Creating...' : 'Create Collection'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}