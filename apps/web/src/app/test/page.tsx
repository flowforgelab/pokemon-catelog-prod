'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
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
              }
            }
          }
        `,
        variables: {
          input: {
            query: '',
            page: 1,
            limit: 3
          }
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      setResult(data)
      setLoading(false)
    })
    .catch(err => {
      setError(err.message)
      setLoading(false)
    })
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">GraphQL Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Status:</h2>
          {loading && <p>Loading...</p>}
          {!loading && !error && <p className="text-green-600">Success!</p>}
          {error && <p className="text-red-600">Error: {error}</p>}
        </div>

        <div>
          <h2 className="font-semibold">API URL:</h2>
          <p className="font-mono">http://localhost:3001/graphql</p>
        </div>

        {result && (
          <div>
            <h2 className="font-semibold">Result:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}