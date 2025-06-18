#!/bin/bash

curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query SearchCards($input: SearchInput!) { searchCards(input: $input) { total cards { id name hp rarity types } } }",
    "variables": {
      "input": {
        "query": "Pikachu",
        "page": 1,
        "limit": 5
      }
    }
  }' | jq