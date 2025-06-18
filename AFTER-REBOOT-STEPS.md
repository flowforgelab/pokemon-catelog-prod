# Steps After Reboot

## Quick Start Commands

1. **Start Docker services first:**
```bash
cd /Users/greg/new-better-app/pokemon-catalog-production
docker compose up -d
```

2. **Start the API server:**
```bash
cd /Users/greg/new-better-app/pokemon-catalog-production/apps/api
PORT=4000 pnpm dev
```

3. **Start the web server:**
```bash
cd /Users/greg/new-better-app/pokemon-catalog-production/apps/web
pnpm dev
```

## Expected Results
- API should be available at: http://localhost:4000/graphql
- Web should be available at: http://localhost:3000

## If localhost still doesn't work after reboot:
1. Check for security software in System Settings
2. Check if any VPN software is installed
3. Try Safe Mode boot (hold Shift during startup)
4. Check Console.app for network errors

## Test Commands
```bash
# Test if localhost works with basic Node.js
node -e "require('http').createServer((req,res)=>res.end('test')).listen(8080,'localhost',()=>console.log('Listening on :8080'))"

# Then in another terminal:
curl http://localhost:8080
```

Good luck with the reboot!