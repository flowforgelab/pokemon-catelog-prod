const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/graphql';

// You'll need a valid JWT token - get this from your browser after logging in
const AUTH_TOKEN = 'YOUR_JWT_TOKEN_HERE';

const testQueries = [
  {
    name: 'TC-001: Empty Deck Analysis',
    query: `
      mutation {
        analyzeDeck(id: "70ad357e-2c12-49a4-a26d-f026a5753b45") {
          strategy
          consistencyScore
          warnings
        }
      }
    `,
    validate: (data) => {
      const analysis = data.analyzeDeck;
      return {
        'Consistency = 0': analysis.consistencyScore === 0,
        'Has deck size warning': analysis.warnings.some(w => w.includes('60 cards'))
      };
    }
  },
  {
    name: 'TC-002: Aggro Detection',
    query: `
      mutation {
        analyzeDeck(id: "e907402d-a074-4453-acf1-ad1f303d4602") {
          strategy
          consistencyScore
          energyCurve
        }
      }
    `,
    validate: (data) => {
      const analysis = data.analyzeDeck;
      return {
        'Strategy is aggro': analysis.strategy === 'aggro',
        'Good consistency': analysis.consistencyScore > 60,
        'Low energy curve': analysis.energyCurve[0] + analysis.energyCurve[1] > analysis.energyCurve[4]
      };
    }
  },
  {
    name: 'TC-003: Control Detection',
    query: `
      mutation {
        analyzeDeck(id: "be45a5f4-2dea-4d8e-beb0-c8157d467365") {
          strategy
          energyCurve
        }
      }
    `,
    validate: (data) => {
      const analysis = data.analyzeDeck;
      return {
        'Strategy is control': analysis.strategy === 'control'
      };
    }
  },
  {
    name: 'TC-004: 4-Card Rule',
    query: `
      mutation {
        analyzeDeck(id: "e9940dd1-0486-47c9-873e-1bcf807b7532") {
          warnings
        }
      }
    `,
    validate: (data) => {
      const warnings = data.analyzeDeck.warnings;
      return {
        'Has 4-card warning': warnings.some(w => w.includes('Too many copies'))
      };
    }
  },
  {
    name: 'TC-005: Multi-Type Penalty',
    query: `
      mutation {
        analyzeDeck(id: "652d7a49-c5bd-4454-bffd-dbd5902658bc") {
          consistencyScore
          warnings
        }
      }
    `,
    validate: (data) => {
      const analysis = data.analyzeDeck;
      return {
        'Low consistency': analysis.consistencyScore < 50,
        'Has type warning': analysis.warnings.some(w => w.includes('energy types'))
      };
    }
  },
  {
    name: 'TC-006: Recommendations',
    query: `
      query {
        deckRecommendations(id: "e907402d-a074-4453-acf1-ad1f303d4602") {
          card {
            name
          }
          reasoning
          priority
        }
      }
    `,
    validate: (data) => {
      const recs = data.deckRecommendations;
      return {
        'Has recommendations': recs.length > 0,
        'All have reasoning': recs.every(r => r.reasoning),
        'All have priority': recs.every(r => r.priority)
      };
    }
  }
];

async function runTest(test) {
  console.log(`\n🧪 ${test.name}`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({ query: test.query })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ GraphQL Error:', result.errors[0].message);
      return false;
    }

    const validations = test.validate(result.data);
    let allPassed = true;

    for (const [check, passed] of Object.entries(validations)) {
      console.log(`  ${passed ? '✅' : '❌'} ${check}`);
      if (!passed) allPassed = false;
    }

    return allPassed;
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Phase 1 GraphQL Test Suite\n');
  console.log('⚠️  Make sure API server is running: cd apps/api && pnpm dev');
  console.log('⚠️  Update AUTH_TOKEN with a valid JWT\n');

  const results = {
    total: testQueries.length,
    passed: 0,
    failed: 0
  };

  for (const test of testQueries) {
    const passed = await runTest(test);
    if (passed) results.passed++;
    else results.failed++;
  }

  console.log('\n📊 Final Results:');
  console.log(`Total: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
}

// Instructions for getting auth token
console.log('📝 To get AUTH_TOKEN:');
console.log('1. Open browser DevTools (F12)');
console.log('2. Go to Network tab');
console.log('3. Login to the app');
console.log('4. Find a GraphQL request');
console.log('5. Copy the Authorization header value (after "Bearer ")');
console.log('6. Update AUTH_TOKEN in this file\n');

// Uncomment to run tests
// runAllTests();