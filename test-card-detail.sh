#!/bin/bash

curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetCardById($id: String!) { card(id: $id) { id name supertype hp types marketPrice setName artist } }",
    "variables": {
      "id": "ex3-1"
    }
  }' | jq