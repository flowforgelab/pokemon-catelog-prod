const fetch = require('node-fetch');

const PRODUCTION_API = 'https://pokemon-catelog-prod-production.up.railway.app/graphql';
const PRODUCTION_WEB = 'https://pokemon-catelog-prod.vercel.app';

// Test deck IDs created in production database
const TEST_DECKS = {
  empty: '70ad357e-2c12-49a4-a26d-f026a5753b45',
  aggro: 'e907402d-a074-4453-acf1-ad1f303d4602',
  control: 'be45a5f4-2dea-4d8e-beb0-c8157d467365',
  fourCard: 'e9940dd1-0486-47c9-873e-1bcf807b7532',
  multiType: '652d7a49-c5bd-4454-bffd-dbd5902658bc'
};

async function testHealthEndpoint() {
  console.log('🏥 Testing API Health...');
  try {
    const response = await fetch('https://pokemon-catelog-prod-production.up.railway.app/health');
    const data = await response.json();
    console.log('✅ API Status:', data.status);
    console.log('✅ Cards in DB:', data.database.cards);
    return true;
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
}

async function testPublicQuery() {
  console.log('\n🔍 Testing Public GraphQL Query...');
  const query = `
    query TestCards {
      searchCards(input: { page: 1, limit: 5 }) {
        total
        cards {
          id
          name
          marketPrice
        }
      }
    }
  `;

  try {
    const response = await fetch(PRODUCTION_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });

    const result = await response.json();
    
    if (result.data?.searchCards) {
      console.log('✅ Total cards available:', result.data.searchCards.total);
      console.log('✅ Sample card:', result.data.searchCards.cards[0]?.name);
      return true;
    } else {
      console.log('❌ No data returned:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Query failed:', error.message);
    return false;
  }
}

async function testFrontendConnection() {
  console.log('\n🌐 Testing Frontend-API Connection...');
  try {
    const response = await fetch(PRODUCTION_WEB);
    if (response.ok) {
      console.log('✅ Frontend is accessible');
      return true;
    } else {
      console.log('❌ Frontend returned:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Frontend check failed:', error.message);
    return false;
  }
}

async function testDeckAnalysisDeployment() {
  console.log('\n🧪 Testing Deck Analysis (Requires Auth)...');
  console.log('ℹ️  Deck analysis requires authentication');
  console.log('ℹ️  To test manually:');
  console.log('1. Go to', PRODUCTION_WEB);
  console.log('2. Login with Google/GitHub');
  console.log('3. Navigate to Decks page');
  console.log('4. Use one of these test deck IDs:');
  Object.entries(TEST_DECKS).forEach(([type, id]) => {
    console.log(`   - ${type}: ${id}`);
  });
}

async function generateProductionReport() {
  console.log('\n📊 Phase 1 Production Deployment Report\n');
  console.log('='.repeat(50));
  
  const healthOk = await testHealthEndpoint();
  const queryOk = await testPublicQuery();
  const frontendOk = await testFrontendConnection();
  
  console.log('\n📋 Deployment Checklist:');
  console.log(`${healthOk ? '✅' : '❌'} API Health Check`);
  console.log(`${queryOk ? '✅' : '❌'} GraphQL Public Queries`);
  console.log(`${frontendOk ? '✅' : '❌'} Frontend Accessibility`);
  console.log('⏳ Authenticated Mutations (Manual Test Required)');
  
  console.log('\n🔐 To Test Authenticated Features:');
  console.log('1. Visit:', PRODUCTION_WEB);
  console.log('2. Login and get JWT from DevTools Network tab');
  console.log('3. Test these mutations in GraphQL playground:\n');
  
  console.log('mutation TestAnalysis {');
  console.log(`  analyzeDeck(id: "${TEST_DECKS.aggro}") {`);
  console.log('    strategy');
  console.log('    consistencyScore');
  console.log('    warnings');
  console.log('  }');
  console.log('}\n');
  
  console.log('query TestRecommendations {');
  console.log(`  deckRecommendations(id: "${TEST_DECKS.aggro}") {`);
  console.log('    card { name }');
  console.log('    reasoning');
  console.log('    priority');
  console.log('  }');
  console.log('}');
  
  await testDeckAnalysisDeployment();
  
  console.log('\n✨ Production Status:');
  if (healthOk && queryOk && frontendOk) {
    console.log('✅ Phase 1 backend is deployed and operational');
    console.log('⏳ Deck analysis features need deployment verification');
  } else {
    console.log('❌ Production deployment has issues - check Railway logs');
  }
}

// Run production tests
generateProductionReport();