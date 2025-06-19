import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pokemon-catelog-prod-production.up.railway.app/graphql',
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
})

export default client