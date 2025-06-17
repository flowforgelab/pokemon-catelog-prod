#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Pokemon Catalog Production Setup...\n');

const tests = [
  {
    name: 'Check pnpm installation',
    command: 'pnpm --version',
    expected: 'pnpm version installed'
  },
  {
    name: 'Check Node.js version',
    command: 'node --version',
    expected: 'Node.js v20+ recommended'
  },
  {
    name: 'Check TypeScript compilation',
    command: 'pnpm tsc --version',
    expected: 'TypeScript installed'
  },
  {
    name: 'Check Turbo installation',
    command: 'pnpm turbo --version',
    expected: 'Turbo installed'
  },
  {
    name: 'Check Docker installation',
    command: 'docker --version',
    expected: 'Docker installed'
  },
  {
    name: 'Check Docker Compose',
    command: 'docker compose version',
    expected: 'Docker Compose installed'
  }
];

let passed = 0;
let failed = 0;

// Run basic checks
tests.forEach(test => {
  try {
    const result = execSync(test.command, { encoding: 'utf8' }).trim();
    console.log(`✅ ${test.name}: ${result}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${test.name}: Failed - ${test.expected}`);
    failed++;
  }
});

// Check file structure
console.log('\n📁 Checking project structure...');
const requiredPaths = [
  'apps/web/package.json',
  'apps/api/package.json',
  'packages/database/package.json',
  'packages/shared/package.json',
  'docker-compose.yml',
  'turbo.json',
  'pnpm-workspace.yaml'
];

requiredPaths.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${filePath} exists`);
    passed++;
  } else {
    console.log(`❌ ${filePath} missing`);
    failed++;
  }
});

// Check Prisma schema
console.log('\n🗄️ Checking Prisma schema...');
try {
  const schemaPath = path.join(process.cwd(), 'packages/database/prisma/schema.prisma');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const models = ['User', 'Card', 'Collection', 'Deck', 'Trade'];
  
  models.forEach(model => {
    if (schema.includes(`model ${model}`)) {
      console.log(`✅ Model ${model} found`);
      passed++;
    } else {
      console.log(`❌ Model ${model} missing`);
      failed++;
    }
  });
} catch (error) {
  console.log('❌ Could not read Prisma schema');
  failed++;
}

// Summary
console.log('\n📊 Test Summary:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Your setup is ready.');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please fix the issues above.');
  process.exit(1);
}