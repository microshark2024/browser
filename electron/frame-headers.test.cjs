const assert = require('node:assert/strict')
const test = require('node:test')
const { removeEmbeddingHeaders } = require('./frame-headers.cjs')

test('removes embedding restrictions regardless of header casing without altering other headers', () => {
  const original = {
    'X-Frame-Options': ['SAMEORIGIN'],
    'content-security-policy': ["frame-ancestors 'self'; default-src 'self'"],
    'Content-Type': ['text/html'],
    'Set-Cookie': ['example=value; Secure'],
  }

  assert.deepEqual(removeEmbeddingHeaders(original), {
    'Content-Type': ['text/html'],
    'Set-Cookie': ['example=value; Secure'],
  })
  assert.equal(original['X-Frame-Options'][0], 'SAMEORIGIN')
})
