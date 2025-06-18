import { gql } from '@apollo/client'

export const GET_CARDS = gql`
  query SearchCards($input: SearchInput!) {
    searchCards(input: $input) {
      total
      cards {
        id
        name
        hp
        rarity
        types
        setName
        setSeries
        artist
        imageSmall
        imageLarge
        marketPrice
        tcgplayerUrl
      }
    }
  }
`

export const GET_CARD_BY_ID = gql`
  query GetCardById($id: String!) {
    card(id: $id) {
      id
      tcgId
      name
      supertype
      subtypes
      types
      hp
      retreatCost
      setName
      number
      artist
      rarity
      flavorText
      imageUrl
      imageUrlHiRes
      abilities
      attacks
      weaknesses
      resistances
      standardLegal
      expandedLegal
      marketPrice
      tcgplayerUrl
    }
  }
`

export const GET_MY_COLLECTIONS = gql`
  query GetMyCollections {
    myCollections {
      id
      name
      description
      isPublic
      createdAt
      updatedAt
    }
  }
`

export const GET_MY_DECKS = gql`
  query GetMyDecks {
    myDecks {
      id
      name
      format
      description
      isPublic
      createdAt
      updatedAt
    }
  }
`

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      image
      createdAt
      _count {
        collections
        decks
        following
        followers
      }
    }
  }
`