import { gql } from '@apollo/client'

export const ANALYZE_DECK = gql`
  mutation AnalyzeDeck($id: String!) {
    analyzeDeck(id: $id) {
      id
      strategy
      consistencyScore
      energyCurve
      recommendations
      warnings
      createdAt
    }
  }
`

export const GET_DECK_ANALYSIS = gql`
  query GetDeckAnalysis($id: String!) {
    deckAnalysis(id: $id) {
      id
      strategy
      consistencyScore
      energyCurve
      recommendations
      warnings
      createdAt
    }
  }
`

export const GET_DECK_RECOMMENDATIONS = gql`
  query GetDeckRecommendations($id: String!) {
    deckRecommendations(id: $id) {
      card {
        id
        name
        imageSmall
        types
        rarity
        marketPrice
      }
      reasoning
      priority
      replacementFor {
        id
        name
      }
      synergies
    }
  }
`