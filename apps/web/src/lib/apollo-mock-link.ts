import { ApolloLink, Operation, FetchResult, Observable } from '@apollo/client'
import { searchMockCards } from './mock-data'

export const mockLink = new ApolloLink((operation: Operation, forward) => {
  // Extract the query name and variables
  const definition = operation.query.definitions[0]
  const queryName = definition && 'name' in definition && definition.name ? definition.name.value : undefined
  const variables = operation.variables

  // Create a mock response for searchCards query
  if (queryName === 'SearchCards') {
    return new Observable<FetchResult>((observer) => {
      const { query = '', limit = 20 } = variables.input || {}
      const mockResult = searchMockCards(query, limit)

      // Simulate async response
      setTimeout(() => {
        observer.next({
          data: {
            searchCards: mockResult
          }
        })
        observer.complete()
      }, 300)
    })
  }

  // For other queries, just use mock data
  return new Observable<FetchResult>((observer) => {
    if (queryName === 'GetMe') {
      setTimeout(() => {
        observer.next({
          data: {
            me: {
              id: 'mock-user',
              email: 'user@example.com',
              name: 'Demo User',
              image: null,
              createdAt: new Date().toISOString(),
              _count: {
                collections: 0,
                decks: 0,
                following: 0,
                followers: 0
              }
            }
          }
        })
        observer.complete()
      }, 100)
    } else {
      // Pass through to the real endpoint
      forward(operation).subscribe({
        next: (result) => observer.next(result),
        error: (error) => observer.error(error),
        complete: () => observer.complete()
      })
    }
  })
})