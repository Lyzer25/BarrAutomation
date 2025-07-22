"use client"

import { debugStore } from './debug-store'

// Store original fetch for restoration
let originalFetch: typeof fetch | null = null

export function initializeNetworkMonitoring() {
  if (typeof window === 'undefined' || originalFetch) return

  // Store original fetch
  originalFetch = window.fetch

  // Intercept all fetch calls for debugging
  window.fetch = async (url: RequestInfo | URL, options?: RequestInit) => {
    const startTime = Date.now()
    const urlString = url.toString()
    
    debugStore.logEvent('NETWORK_REQUEST_START', { 
      url: urlString, 
      method: options?.method || 'GET',
      headers: options?.headers,
      hasBody: !!options?.body
    })
    
    try {
      const response = await originalFetch!(url, options)
      const duration = Date.now() - startTime
      
      // Clone response to read body without consuming it
      const responseClone = response.clone()
      let responseBody = null
      
      try {
        // Try to read response body for logging (only for debugging)
        if (debugStore.isDebugEnabled() && response.headers.get('content-type')?.includes('application/json')) {
          responseBody = await responseClone.json()
        }
      } catch (e) {
        // Ignore body reading errors
      }
      
      debugStore.logNetworkCall(urlString, options, response, duration)
      debugStore.logEvent('NETWORK_REQUEST_SUCCESS', { 
        url: urlString, 
        status: response.status,
        statusText: response.statusText,
        duration,
        responseSize: response.headers.get('content-length'),
        contentType: response.headers.get('content-type'),
        responseBody: responseBody ? JSON.stringify(responseBody).substring(0, 500) : null // Truncate for logging
      })
      
      return response
    } catch (error) {
      const duration = Date.now() - startTime
      debugStore.logEvent('NETWORK_REQUEST_ERROR', { 
        url: urlString, 
        error: error instanceof Error ? error.message : 'Unknown error', 
        duration,
        stack: error instanceof Error ? error.stack : undefined
      })
      throw error
    }
  }

  debugStore.logEvent('NETWORK_MONITORING_INITIALIZED', { 
    originalFetchExists: !!originalFetch 
  })
}

export function restoreOriginalFetch() {
  if (typeof window === 'undefined' || !originalFetch) return

  window.fetch = originalFetch
  originalFetch = null
  
  debugStore.logEvent('NETWORK_MONITORING_DISABLED', {})
}

// Auto-initialize when debug mode is enabled
if (typeof window !== 'undefined') {
  // Check for debug mode on load
  const checkDebugMode = () => {
    if (debugStore.isDebugEnabled() && !originalFetch) {
      initializeNetworkMonitoring()
    }
  }

  // Check periodically for debug mode activation
  setInterval(checkDebugMode, 1000)
}
