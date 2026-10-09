const embeddingHeaders = new Set(['x-frame-options', 'content-security-policy'])

function removeEmbeddingHeaders(responseHeaders) {
  return Object.fromEntries(
    Object.entries(responseHeaders).filter(([name]) => !embeddingHeaders.has(name.toLowerCase())),
  )
}

module.exports = { removeEmbeddingHeaders }
