const crypto = require('crypto');
const { webcrypto } = crypto;

if (
  typeof globalThis.crypto === 'undefined' ||
  typeof globalThis.crypto.getRandomValues !== 'function'
) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
  });
}

if (typeof crypto.getRandomValues !== 'function') {
  crypto.getRandomValues = (array) => {
    if (webcrypto && typeof webcrypto.getRandomValues === 'function') {
      return webcrypto.getRandomValues(array);
    }
    return crypto.randomFillSync(array);
  };
}
