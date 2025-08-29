const RATE_MS = 10_000 // 10 seconds (more reasonable for testing)
const hits = new Map<string, number>()

export function checkRateLimit(ip: string): boolean {
  // Skip rate limiting in development mode
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  
  const now = Date.now()
  const last = hits.get(ip) || 0
  
  if (now - last < RATE_MS) {
    return false // Rate limited
  }
  
  hits.set(ip, now)
  return true // Allowed
}

export function cleanupOldHits() {
  const now = Date.now()
  for (const [ip, timestamp] of hits.entries()) {
    if (now - timestamp > RATE_MS) {
      hits.delete(ip)
    }
  }
}

// Clean up old entries every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupOldHits, 5 * 60 * 1000)
}
