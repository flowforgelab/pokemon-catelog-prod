export default function TestEnvPage() {
  // Server component - this runs on the server
  const envCheck = {
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Check</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(envCheck, null, 2)}
      </pre>
      <p className="mt-4 text-sm text-gray-600">
        If NEXTAUTH_URL shows "NOT SET", that's why authentication isn't working.
      </p>
    </div>
  )
}