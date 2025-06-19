'use client'

import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight, Search, TrendingUp, Users, Sparkles } from 'lucide-react'
import { GET_CARDS } from '@/lib/graphql/queries'

export default function HomePage() {
  const { data, loading, error } = useQuery(GET_CARDS, {
    variables: { 
      input: { 
        query: '', 
        page: 1, 
        limit: 3 
      } 
    },
    errorPolicy: 'all'
  })

  const stats = [
    { label: 'Total Cards', value: data?.searchCards?.total || '0', icon: Sparkles },
    { label: 'Active Users', value: '2,451', icon: Users },
    { label: 'Cards Traded', value: '45.2K', icon: TrendingUp },
  ]

  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold">
          Your Ultimate <span className="text-primary">Pokemon TCG</span> Companion
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Track collections, build decks, and discover the value of your cards with real-time pricing.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" asChild>
            <Link href="/cards">Browse Cards</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Quick Search */}
      <section className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <form className="flex gap-2" action="/cards">
              <Input 
                name="search"
                placeholder="Search for any Pokemon card..." 
                className="flex-1"
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Stats */}
      <section className="grid md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Featured Cards */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Featured Cards</h2>
          <Button variant="ghost" asChild>
            <Link href="/cards">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            <p className="font-semibold">Unable to load featured cards</p>
            <p className="text-sm mt-1">Cards are currently unavailable. The search functionality may be temporarily disabled.</p>
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Skeleton className="aspect-[3/4] rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Real cards
            data?.searchCards?.cards?.map((card: any) => (
              <Card key={card.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-[3/4] bg-muted rounded-lg mb-4 overflow-hidden">
                    {card.imageSmall ? (
                      <img 
                        src={card.imageSmall} 
                        alt={card.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">{card.name}</span>
                      </div>
                    )}
                  </div>
                  <CardTitle>{card.name}</CardTitle>
                  <CardDescription>
                    {card.setName} • {card.rarity}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg text-muted-foreground">
                        HP {card.hp || 'N/A'}
                      </span>
                      <div className="flex gap-1">
                        {card.types?.map((type: string) => (
                          <Badge key={type} variant="secondary" className="capitalize">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Market Price</span>
                      {card.marketPrice ? (
                        <span className="text-lg font-semibold text-green-600">
                          ${card.marketPrice.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          No Price Available
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 space-y-4">
        <h2 className="text-3xl font-bold">Ready to start collecting?</h2>
        <p className="text-muted-foreground">
          Join thousands of trainers managing their Pokemon TCG collections.
        </p>
        <Button size="lg" asChild>
          <Link href="/register">Create Free Account</Link>
        </Button>
      </section>
    </div>
  )
}