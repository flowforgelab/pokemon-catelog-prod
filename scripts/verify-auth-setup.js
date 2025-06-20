#!/usr/bin/env node

console.log('🔍 Verifying Better Auth Setup...\n');

// Check required environment variables
const requiredEnvVars = [
  'BETTER_AUTH_URL',
  'BETTER_AUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'DATABASE_URL'
];

const publicEnvVars = [
  'NEXT_PUBLIC_BETTER_AUTH_URL',
  'NEXT_PUBLIC_GRAPHQL_URL'
];

console.log('📋 Checking server environment variables:');
let hasErrors = false;

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Set`);
    if (varName === 'BETTER_AUTH_SECRET' && process.env[varName].length < 32) {
      console.log(`   ⚠️  Warning: ${varName} should be at least 32 characters`);
    }
  } else {
    console.log(`❌ ${varName}: Missing`);
    hasErrors = true;
  }
});

console.log('\n📋 Checking public environment variables:');
publicEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: ${process.env[varName]}`);
  } else {
    console.log(`❌ ${varName}: Missing`);
    hasErrors = true;
  }
});

// Verify URL consistency
if (process.env.BETTER_AUTH_URL && process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
  if (process.env.BETTER_AUTH_URL !== process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    console.log('\n⚠️  Warning: BETTER_AUTH_URL and NEXT_PUBLIC_BETTER_AUTH_URL do not match!');
    console.log(`   Server URL: ${process.env.BETTER_AUTH_URL}`);
    console.log(`   Client URL: ${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}`);
    hasErrors = true;
  }
}

// Check Google OAuth redirect URI
if (process.env.BETTER_AUTH_URL && process.env.GOOGLE_CLIENT_ID) {
  console.log('\n📌 Google OAuth Configuration:');
  console.log(`   Authorized redirect URI should be: ${process.env.BETTER_AUTH_URL}/api/auth/callback/google`);
  console.log('   Make sure this is added in Google Cloud Console');
}

console.log('\n' + (hasErrors ? '❌ Auth setup has issues!' : '✅ Auth setup looks good!'));

// Additional recommendations
console.log('\n💡 Deployment Checklist:');
console.log('1. Set all environment variables in Vercel dashboard');
console.log('2. Ensure BETTER_AUTH_SECRET is a secure random string (64+ characters)');
console.log('3. Add redirect URI to Google Cloud Console OAuth settings');
console.log('4. Rebuild and redeploy after changing environment variables');
console.log('5. Clear browser cookies/cache when testing auth changes');