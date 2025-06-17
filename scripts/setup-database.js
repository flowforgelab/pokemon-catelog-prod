#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🗄️  Setting up Pokemon Catalog database...\n');

try {
  // Test database connection
  console.log('Testing database connection...');
  execSync('docker exec pokemon-catalog-db psql -U postgres -d pokemon_catalog -c "SELECT 1;"', {
    stdio: 'inherit'
  });
  console.log('✅ Database connection successful!\n');

  // Run Prisma generate
  console.log('Generating Prisma client...');
  execSync('cd packages/database && pnpm prisma generate', {
    stdio: 'inherit'
  });
  console.log('✅ Prisma client generated!\n');

  // Run migrations
  console.log('Running database migrations...');
  process.env.DATABASE_URL = 'postgresql://postgres:postgres123@localhost:5432/pokemon_catalog';
  
  // Try db push first (simpler for development)
  try {
    execSync('cd packages/database && DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/pokemon_catalog" npx prisma db push --accept-data-loss', {
      stdio: 'inherit'
    });
    console.log('✅ Database schema created successfully!\n');
  } catch (error) {
    console.error('❌ Failed to create database schema:', error.message);
    process.exit(1);
  }

  console.log('🎉 Database setup complete!');
  console.log('\nYou can now:');
  console.log('- Run `pnpm dev` to start the development servers');
  console.log('- Run `pnpm db:studio` to open Prisma Studio');
  
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}