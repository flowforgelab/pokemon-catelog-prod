'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useQuery, useMutation } from '@apollo/client'
import { GET_MY_COLLECTIONS } from '@/lib/graphql/queries'
import { CREATE_COLLECTION } from '@/lib/graphql/mutations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Folder, Lock, Globe, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function CollectionsPage() {
  const [newCollectionName, setNewCollectionName] = useState('')
  
  const { data, loading, refetch } = useQuery(GET_MY_COLLECTIONS, {
    errorPolicy: 'all'
  })
  
  const [createCollection] = useMutation(CREATE_COLLECTION, {
    onCompleted: () => {
      setNewCollectionName('')
      refetch()
    }
  })

  const collections = data?.myCollections || []

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return
    
    await createCollection({
      variables: {
        input: {
          name: newCollectionName,
          description: ''
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
            <h1 className="text-3xl font-bold">My Collections</h1>
            <p className="text-muted-foreground">Organize and track your Pokemon cards</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
                <DialogDescription>
                  Give your collection a name to get started
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Collection Name</Label>
                  <Input
                    id="name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="e.g., Rare Holos"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Collection</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collections.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))
          ) : collections.length === 0 ? (
            // Empty state
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No collections yet</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Create Your First Collection</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Collection</DialogTitle>
                      <DialogDescription>
                        Give your collection a name to get started
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Collection Name</Label>
                        <Input
                          id="name"
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                          placeholder="e.g., Main Collection"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Collection</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            // Collection items
            collections.map((collection: any) => (
            <Card key={collection.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="h-5 w-5" />
                      {collection.name}
                    </CardTitle>
                    <CardDescription>
                      Created {new Date(collection.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {collection.isPublic ? (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collection.description && (
                    <p className="text-sm text-muted-foreground">{collection.description}</p>
                  )}
                  <Button className="w-full" variant="secondary" asChild>
                    <Link href={`/collections/${collection.id}`}>
                      View Collection
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))
          )}

          {/* Add Collection Card */}
          {collections.length > 0 && (
            <Dialog>
            <DialogTrigger asChild>
              <Card className="border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[250px]">
                  <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Create New Collection</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Collection</DialogTitle>
                <DialogDescription>
                  Give your collection a name to get started
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Collection Name</Label>
                  <Input
                    id="name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="e.g., Main Collection"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateCollection}>Create Collection</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          )}
        </div>
      </div>
      </div>
    </ProtectedRoute>
  )
}