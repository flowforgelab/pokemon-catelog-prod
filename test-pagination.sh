#!/bin/bash

echo "Testing pagination with page 2..."
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query SearchCards($input: SearchInput!) { searchCards(input: $input) { total cards { id name } } }",
    "variables": {
      "input": {
        "query": "",
        "page": 2,
        "limit": 5
      }
    }
  }' | jq '.data.searchCards | {total: .total, cardCount: (.cards | length), firstCard: .cards[0].name}'