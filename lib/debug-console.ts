"use client"

import { debugStore } from './debug-store'
import { initializeNetworkMonitoring, restoreOriginalFetch } from './debug-fetch'

// Global debug commands for console access
if (typeof window !== 'undefined') {
  // Enable debug mode
  (window as any).enableDebug = () => {
    debugStore.enable()
    initializeNetworkMonitoring()
    console.log('🐛 Debug mode enabled')
    console.log('Available commands:')
    console.log('- debugStore.getFullReport() - Get complete debug report')
    console.log('- debugStore.exportReport() - Download debug report')
    console.log('- showDebugPanel() - Show debug panel')
    console.log('- disableDebug() - Disable debug mode')
    console.log('- clearDebugData() - Clear all debug data')
    console.log('- searchDebugData("query") - Search debug events')
    console.log('- getTimeoutEvents() - Get timeout-related events')
    console.log('- getSSEEvents() - Get SSE-related events')
    console.log('- getNetworkErrors() - Get network error events')
  }

  // Disable debug mode
  (window as any).disableDebug = () => {
    debugStore.disable()
    restoreOriginalFetch()
    console.log('🐛 Debug mode disabled')
  }

  // Show debug panel
  (window as any).showDebugPanel = () => {
    const event = new CustomEvent('show-debug-panel')
    window.dispatchEvent(event)
    console.log('🔍 Debug panel shown')
  }

  // Hide debug panel
  (window as any).hideDebugPanel = () => {
    const event = new CustomEvent('hide-debug-panel')
    window.dispatchEvent(event)
    console.log('🔍 Debug panel hidden')
  }

  // Export debug report
  (window as any).exportDebugReport = () => {
    debugStore.exportReport()
    console.log('📊 Debug report exported')
  }

  // Clear debug data
  (window as any).clearDebugData = () => {
    debugStore.clear()
    console.log('🗑️ Debug data cleared')
  }

  // Search debug data
  (window as any).searchDebugData = (query: string) => {
    const results = debugStore.search(query)
    console.log(`🔍 Search results for "${query}":`, results)
    return results
  }

  // Get timeout-related events
  (window as any).getTimeoutEvents = () => {
    const events = debugStore.getEvents('timeout')
    console.log('⏰ Timeout events:', events)
    return events
  }

  // Get SSE-related events
  (window as any).getSSEEvents = () => {
    const events = debugStore.getEvents('sse')
    console.log('📡 SSE events:', events)
    return events
  }

  // Get network errors
  (window as any).getNetworkErrors = () => {
    const events = debugStore.getEvents('network').filter(e => e.type.includes('ERROR'))
    console.log('🌐 Network errors:', events)
    return events
  }

  // Get automation state events
  (window as any).getAutomationEvents = () => {
    const events = debugStore.getEvents().filter(e => 
      e.type.includes('AUTOMATION') || 
      e.type.includes('STATUS') || 
      e.type.includes('DASHBOARD')
    )
    console.log('🤖 Automation events:', events)
    return events
  }

  // Get performance metrics
  (window as any).getPerformanceMetrics = () => {
    const metrics = debugStore.getPerformanceMetrics()
    console.log('⚡ Performance metrics:', metrics)
    return metrics
  }

  // Force timeout for testing
  (window as any).forceTimeout = () => {
    debugStore.logEvent('FORCE_TIMEOUT_TRIGGERED', { 
      source: 'console_command',
      timestamp: new Date().toISOString()
    })
    const event = new CustomEvent('force-timeout')
    window.dispatchEvent(event)
    console.log('⏰ Timeout forced for testing')
  }

  // Force dashboard data for testing
  (window as any).forceDashboard = () => {
    debugStore.logEvent('FORCE_DASHBOARD_TRIGGERED', { 
      source: 'console_command',
      timestamp: new Date().toISOString()
    })
    const event = new CustomEvent('force-dashboard')
    window.dispatchEvent(event)
    console.log('📊 Dashboard forced for testing')
  }

  // Reset demo state
  (window as any).resetDemo = () => {
    debugStore.logEvent('RESET_DEMO_TRIGGERED', { 
      source: 'console_command',
      timestamp: new Date().toISOString()
    })
    const event = new CustomEvent('reset-demo')
    window.dispatchEvent(event)
    console.log('🔄 Demo reset triggered')
  }

  // Test SSE connection
  (window as any).testSSEConnection = () => {
    debugStore.logEvent('TEST_SSE_TRIGGERED', { 
      source: 'console_command',
      timestamp: new Date().toISOString()
    })
    const event = new CustomEvent('test-sse-connection')
    window.dispatchEvent(event)
    console.log('📡 SSE connection test triggered')
  }

  // Get debug summary
  (window as any).getDebugSummary = () => {
    const report = debugStore.getFullReport()
    const summary = {
      sessionId: report.sessionId,
      totalEvents: report.summary.totalEvents,
      errorCount: report.summary.errorCount,
      timeoutCount: report.summary.timeoutCount,
      networkCalls: report.summary.totalNetworkCalls,
      stateChanges: report.summary.totalStateChanges,
      lastEvent: report.events[report.events.length - 1],
      recentErrors: report.events.filter(e => e.type.includes('ERROR')).slice(-5)
    }
    console.log('📋 Debug summary:', summary)
    return summary
  }

  // Monitor automation progress
  (window as any).monitorAutomation = () => {
    const automationEvents = debugStore.getEvents().filter(e => 
      e.type.includes('AUTOMATION') || 
      e.type.includes('SSE') || 
      e.type.includes('TIMEOUT') ||
      e.type.includes('DASHBOARD')
    )
    
    console.log('🔍 Automation monitoring:')
    console.log('Recent automation events:', automationEvents.slice(-10))
    
    const networkCalls = debugStore.getNetworkCalls().filter(call => 
      call.url.includes('/api/events/') || 
      call.url.includes('/api/webhook/')
    )
    console.log('Recent automation network calls:', networkCalls.slice(-5))
    
    return { events: automationEvents, networkCalls }
  }

  // Debug help
  (window as any).debugHelp = () => {
    console.log('🐛 Debug Console Commands:')
    console.log('')
    console.log('🔧 Basic Commands:')
    console.log('  enableDebug() - Enable debug mode')
    console.log('  disableDebug() - Disable debug mode')
    console.log('  showDebugPanel() - Show debug panel')
    console.log('  hideDebugPanel() - Hide debug panel')
    console.log('')
    console.log('📊 Data Commands:')
    console.log('  debugStore.getFullReport() - Complete debug report')
    console.log('  exportDebugReport() - Download debug report')
    console.log('  clearDebugData() - Clear all debug data')
    console.log('  getDebugSummary() - Quick summary')
    console.log('')
    console.log('🔍 Search Commands:')
    console.log('  searchDebugData("query") - Search all debug data')
    console.log('  getTimeoutEvents() - Get timeout events')
    console.log('  getSSEEvents() - Get SSE events')
    console.log('  getNetworkErrors() - Get network errors')
    console.log('  getAutomationEvents() - Get automation events')
    console.log('')
    console.log('🧪 Testing Commands:')
    console.log('  forceTimeout() - Force timeout for testing')
    console.log('  forceDashboard() - Force dashboard for testing')
    console.log('  resetDemo() - Reset demo state')
    console.log('  testSSEConnection() - Test SSE connection')
    console.log('')
    console.log('📈 Monitoring Commands:')
    console.log('  monitorAutomation() - Monitor automation progress')
    console.log('  getPerformanceMetrics() - Get performance data')
    console.log('')
    console.log('⌨️ Keyboard Shortcuts:')
    console.log('  Ctrl+Shift+Alt+D - Enable debug mode')
    console.log('  Ctrl+Shift+Alt+E - Export debug report')
    console.log('  Ctrl+Shift+Alt+R - Reset debug data')
    console.log('  Ctrl+Shift+Alt+P - Show/hide debug panel')
  }

  // Show help on load if debug is enabled
  if (debugStore.isDebugEnabled()) {
    console.log('🐛 Debug mode is active. Type debugHelp() for available commands.')
  }
}

// Initialize keyboard shortcuts
export function initializeKeyboardShortcuts() {
  if (typeof window === 'undefined') return

  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+Shift+Alt+D = Enable debug mode
    if (e.ctrlKey && e.shiftKey && e.altKey && e.key === 'D') {
      e.preventDefault()
      if (!debugStore.isDebugEnabled()) {
        debugStore.enable()
        initializeNetworkMonitoring()
        const event = new CustomEvent('show-debug-panel')
        window.dispatchEvent(event)
        console.log('🐛 Debug mode enabled via keyboard shortcut')
      }
    }
    
    // Ctrl+Shift+Alt+E = Export debug report
    if (e.ctrlKey && e.shiftKey && e.altKey && e.key === 'E') {
      e.preventDefault()
      if (debugStore.isDebugEnabled()) {
        debugStore.exportReport()
        console.log('📊 Debug report exported via keyboard shortcut')
      }
    }
    
    // Ctrl+Shift+Alt+R = Reset debug data
    if (e.ctrlKey && e.shiftKey && e.altKey && e.key === 'R') {
      e.preventDefault()
      if (debugStore.isDebugEnabled()) {
        debugStore.clear()
        console.log('🗑️ Debug data cleared via keyboard shortcut')
      }
    }

    // Ctrl+Shift+Alt+P = Show/hide debug panel
    if (e.ctrlKey && e.shiftKey && e.altKey && e.key === 'P') {
      e.preventDefault()
      if (debugStore.isDebugEnabled()) {
        const event = new CustomEvent('toggle-debug-panel')
        window.dispatchEvent(event)
        console.log('🔍 Debug panel toggled via keyboard shortcut')
      }
    }

    // Ctrl+Shift+Alt+H = Show debug help
    if (e.ctrlKey && e.shiftKey && e.altKey && e.key === 'H') {
      e.preventDefault()
      ;(window as any).debugHelp()
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  
  debugStore.logEvent('KEYBOARD_SHORTCUTS_INITIALIZED', {})
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown)
  }
}

// URL parameter debug access
export function initializeURLDebugAccess() {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  
  // Enable debug mode via URL: ?debug=true&key=debug2025
  if (params.get('debug') === 'true' && params.get('key') === 'debug2025') {
    debugStore.enable()
    initializeNetworkMonitoring()
    console.log('🐛 Debug mode enabled via URL parameters')
    console.log('🔑 Debug key validated successfully')
    
    // Auto-show debug panel if requested
    if (params.get('panel') === 'true') {
      setTimeout(() => {
        const event = new CustomEvent('show-debug-panel')
        window.dispatchEvent(event)
      }, 1000)
    }
  }
}
