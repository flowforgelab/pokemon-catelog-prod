#!/bin/bash

set -e

ENVIRONMENT=${1:-staging}

echo "🚀 Deploying to $ENVIRONMENT..."

# Load environment variables
if [ "$ENVIRONMENT" = "production" ]; then
    ENV_FILE=".env.production"
    COMPOSE_FILE="docker-compose.prod.yml"
else
    ENV_FILE=".env.staging"
    COMPOSE_FILE="docker-compose.prod.yml"
fi

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Environment file $ENV_FILE not found"
    exit 1
fi

# Export environment variables
export $(cat $ENV_FILE | grep -v '^#' | xargs)

# Build and deploy with Docker Compose
echo "📦 Building containers..."
docker-compose -f $COMPOSE_FILE build

echo "🔄 Updating services..."
docker-compose -f $COMPOSE_FILE up -d

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f $COMPOSE_FILE exec api npm run db:migrate

# Health check
echo "🩺 Performing health check..."
sleep 10

if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "✅ Deployment successful!"
else
    echo "❌ Health check failed"
    exit 1
fi

echo "🎉 $ENVIRONMENT deployment complete!"