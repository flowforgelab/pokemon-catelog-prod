import { gql } from '@apollo/client'

export const CREATE_COLLECTION = gql`
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
      name
      description
      isPublic
      createdAt
      updatedAt
    }
  }
`

export const CREATE_DECK = gql`
  mutation CreateDeck($input: CreateDeckInput!) {
    createDeck(input: $input) {
      id
      name
      description
      format
      isPublic
      createdAt
      updatedAt
    }
  }
`

export const DELETE_COLLECTION = gql`
  mutation DeleteCollection($id: String!) {
    deleteCollection(id: $id) {
      id
    }
  }
`

export const DELETE_DECK = gql`
  mutation DeleteDeck($id: String!) {
    deleteDeck(id: $id) {
      id
    }
  }
`