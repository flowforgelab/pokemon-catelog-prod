#!/bin/bash

# Simple monitoring script
# In production, use proper monitoring tools like Datadog, New Relic, etc.

FRONTEND_URL="http://localhost:3000"
API_URL="http://localhost:3001"

check_service() {
    local url=$1
    local name=$2
    
    if curl -f $url/api/health >/dev/null 2>&1; then
        echo "✅ $name is healthy"
        return 0
    else
        echo "❌ $name is down"
        return 1
    fi
}

echo "🔍 Checking service health..."

check_service $FRONTEND_URL "Frontend"
frontend_status=$?

check_service $API_URL "API"
api_status=$?

if [ $frontend_status -eq 0 ] && [ $api_status -eq 0 ]; then
    echo "🎉 All services healthy"
    exit 0
else
    echo "🚨 Some services are down"
    exit 1
fi