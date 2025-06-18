#!/bin/bash

# Export data from local PostgreSQL to SQL file
echo "Exporting Pokemon card data from local database..."

docker exec pokemon-catalog-db pg_dump -U postgres -d pokemon_catalog \
  --data-only \
  --table='"Card"' \
  --no-owner \
  --no-privileges \
  > pokemon-cards-data.sql

echo "Data exported to pokemon-cards-data.sql"
echo "File size: $(du -h pokemon-cards-data.sql | cut -f1)"

# Count cards in export
CARD_COUNT=$(grep -c "INSERT INTO" pokemon-cards-data.sql)
echo "Cards exported: $CARD_COUNT"