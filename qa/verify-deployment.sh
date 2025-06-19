#!/bin/bash

echo "🚀 Phase 1 Deployment Verification"
echo "=================================="
echo ""
echo "⏳ Railway typically takes 3-5 minutes to deploy"
echo ""

# Check API health
echo "1. Checking API Health..."
curl -s https://pokemon-catelog-prod-production.up.railway.app/health | python3 -m json.tool

echo ""
echo "2. Testing Deck Analysis Schema..."
echo "   Run this query in browser at: https://pokemon-catelog-prod-production.up.railway.app/graphql"
echo ""
echo "mutation TestDeckAnalysis {"
echo '  analyzeDeck(id: "e907402d-a074-4453-acf1-ad1f303d4602") {'
echo "    id"
echo "    strategy" 
echo "    consistencyScore"
echo "    energyCurve"
echo "    recommendations"
echo "    warnings"
echo "  }"
echo "}"
echo ""
echo "3. Test Deck IDs Available:"
echo "   - Aggro: e907402d-a074-4453-acf1-ad1f303d4602"
echo "   - Control: be45a5f4-2dea-4d8e-beb0-c8157d467365"
echo "   - Empty: 70ad357e-2c12-49a4-a26d-f026a5753b45"
echo ""
echo "4. Check Railway Dashboard:"
echo "   https://railway.app/project/[your-project-id]/service/[api-service]"
echo ""
echo "5. Once deployed, test at:"
echo "   https://pokemon-catelog-prod.vercel.app/decks"