'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Globe } from 'lucide-react'

interface CollectionCardProps {
  collection: {
    id: string
    name: string
    description?: string
    isPublic: boolean
    _count: {
      cards: number
    }
    updatedAt: string
  }
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{collection.name}</CardTitle>
            <Badge variant={collection.isPublic ? "default" : "secondary"}>
              {collection.isPublic ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
              {collection.isPublic ? 'Public' : 'Private'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {collection.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <div className="flex justify-between w-full">
            <span>{collection._count.cards} cards</span>
            <span>Updated {formatDistanceToNow(new Date(collection.updatedAt))} ago</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}