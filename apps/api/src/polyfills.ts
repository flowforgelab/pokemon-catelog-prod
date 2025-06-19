// Polyfill for crypto.randomUUID if not available
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('crypto').webcrypto as any;
}

// Alternative approach if webcrypto is not available
if (!globalThis.crypto?.randomUUID) {
  const crypto = require('crypto');
  globalThis.crypto = {
    ...globalThis.crypto,
    randomUUID: () => crypto.randomUUID(),
  } as any;
}