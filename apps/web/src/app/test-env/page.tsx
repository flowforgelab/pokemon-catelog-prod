export default function TestEnvPage() {
  // Server component - this runs on the server
  const envCheck = {
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT SET',
    nodeEnv: process.env.NODE_ENV || 'NOT SET',
    vercelEnv: process.env.VERCEL_ENV || 'NOT SET',
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Check</h1>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <pre className="whitespace-pre-wrap text-sm">
{`{
  "hasNextAuthUrl": ${envCheck.hasNextAuthUrl},
  "nextAuthUrl": "${envCheck.nextAuthUrl}",
  "nodeEnv": "${envCheck.nodeEnv}",
  "vercelEnv": "${envCheck.vercelEnv}",
  "hasNextAuthSecret": ${envCheck.hasNextAuthSecret},
  "hasGoogleClientId": ${envCheck.hasGoogleClientId},
  "hasDatabaseUrl": ${envCheck.hasDatabaseUrl}
}`}
        </pre>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">
          {envCheck.hasNextAuthUrl ? '✅' : '❌'} NEXTAUTH_URL is {envCheck.hasNextAuthUrl ? 'set' : 'NOT SET'}
        </p>
        <p className="text-sm text-gray-600">
          {envCheck.hasNextAuthSecret ? '✅' : '❌'} NEXTAUTH_SECRET is {envCheck.hasNextAuthSecret ? 'set' : 'NOT SET'}
        </p>
        <p className="text-sm text-gray-600">
          {envCheck.hasDatabaseUrl ? '✅' : '❌'} DATABASE_URL is {envCheck.hasDatabaseUrl ? 'set' : 'NOT SET'}
        </p>
      </div>
      {!envCheck.hasNextAuthUrl && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded">
          <p className="text-red-800 dark:text-red-200 font-semibold">
            ⚠️ NEXTAUTH_URL is not set! This is why authentication isn't working.
          </p>
        </div>
      )}
    </div>
  )
}