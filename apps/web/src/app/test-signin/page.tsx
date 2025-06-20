"use client";

export default function TestSignIn() {
  const handleDirectSignIn = () => {
    // Direct URL approach
    window.location.href = '/api/auth/signin/google';
  };

  const handleClientSignIn = async () => {
    // Using Better Auth client
    try {
      const { signIn } = await import('@/lib/auth-client');
      await signIn.social({ provider: 'google' });
    } catch (error) {
      console.error('Client sign-in error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">OAuth Test Page</h1>
      
      <div className="space-y-4">
        <button
          onClick={handleDirectSignIn}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Direct Sign In (URL redirect)
        </button>
        
        <button
          onClick={handleClientSignIn}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Client Sign In (Better Auth React)
        </button>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Expected flow:</strong></p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Click button to initiate OAuth</li>
          <li>Redirect to Google OAuth consent</li>
          <li>User selects Google account</li>
          <li>Google redirects to /api/auth/callback/google</li>
          <li>Better Auth processes callback and creates session</li>
          <li>Redirect to home page with user logged in</li>
        </ol>
      </div>
      
      <div className="mt-4 text-sm">
        <p><strong>Debug URLs:</strong></p>
        <ul className="mt-2 space-y-1">
          <li><a href="/api/debug-auth-complete" className="text-blue-500 hover:underline">Auth Config Debug</a></li>
          <li><a href="/api/test-oauth-flow" className="text-blue-500 hover:underline">OAuth Flow Test</a></li>
          <li><a href="/api/debug-callback" className="text-blue-500 hover:underline">Callback Debug</a></li>
        </ul>
      </div>
    </div>
  );
}