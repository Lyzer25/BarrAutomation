"use client"

interface DebugEvent {
  id: string
  timestamp: string
  type: string
  data: any
  url: string
  userAgent: string
  sessionId: string
}

interface NetworkCall {
  timestamp: string
  url: string
  method: string
  status?: number
  duration: number
  success?: boolean
  headers?: any
  body?: any
}

interface StateSnapshot {
  timestamp: string
  component: string
  oldState: any
  newState: any
  reason: string
  stackTrace?: string
}

interface PerformanceMetrics {
  memoryUsage?: any[]
  longTasks?: any[]
  renderTimes?: any[]
}

class DebugStore {
  private events: DebugEvent[] = []
  private networkCalls: NetworkCall[] = []
  private stateHistory: StateSnapshot[] = []
  private performance: PerformanceMetrics = {
    memoryUsage: [],
    longTasks: [],
    renderTimes: []
  }
  private isEnabled: boolean = false
  private sessionId: string = ''

  constructor() {
    if (typeof window !== 'undefined') {
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  enable() { 
    this.isEnabled = true
    this.logEvent('DEBUG_ENABLED', { sessionId: this.sessionId })
    console.log('🐛 Debug mode enabled - Session:', this.sessionId)
  }

  disable() { 
    this.logEvent('DEBUG_DISABLED', {})
    this.isEnabled = false
    console.log('🐛 Debug mode disabled')
  }

  isDebugEnabled() {
    return this.isEnabled
  }

  private getSessionId() {
    return this.sessionId
  }

  logEvent(type: string, data: any) {
    if (!this.isEnabled || typeof window === 'undefined') return

    const event: DebugEvent = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type,
      data: JSON.parse(JSON.stringify(data)), // Deep clone to prevent mutations
      url: window.location.pathname,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId
    }

    this.events.push(event)

    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000)
    }

    // Auto-export critical errors
    if (type.includes('ERROR') || type.includes('TIMEOUT') || type.includes('CRITICAL')) {
      this.exportCriticalEvent(event)
    }

    // Log to console for immediate visibility
    if (type.includes('ERROR') || type.includes('TIMEOUT')) {
      console.error(`🚨 [${type}]`, data)
    } else if (type.includes('WARNING')) {
      console.warn(`⚠️ [${type}]`, data)
    } else {
      console.log(`📝 [${type}]`, data)
    }
  }

  logNetworkCall(url: string, options: any, response: any, duration: number) {
    if (!this.isEnabled) return

    const networkCall: NetworkCall = {
      timestamp: new Date().toISOString(),
      url,
      method: options?.method || 'GET',
      status: response?.status,
      duration,
      success: response?.ok,
      headers: options?.headers,
      body: options?.body
    }

    this.networkCalls.push(networkCall)

    // Keep only last 500 network calls
    if (this.networkCalls.length > 500) {
      this.networkCalls = this.networkCalls.slice(-500)
    }

    this.logEvent('NETWORK_CALL_LOGGED', {
      url,
      method: networkCall.method,
      status: networkCall.status,
      duration,
      success: networkCall.success
    })
  }

  logStateChange(component: string, oldState: any, newState: any, reason: string) {
    if (!this.isEnabled) return

    const stateSnapshot: StateSnapshot = {
      timestamp: new Date().toISOString(),
      component,
      oldState: JSON.parse(JSON.stringify(oldState)),
      newState: JSON.parse(JSON.stringify(newState)),
      reason,
      stackTrace: new Error().stack
    }

    this.stateHistory.push(stateSnapshot)

    // Keep only last 200 state changes
    if (this.stateHistory.length > 200) {
      this.stateHistory = this.stateHistory.slice(-200)
    }

    this.logEvent('STATE_CHANGE', {
      component,
      reason,
      hasChanges: JSON.stringify(oldState) !== JSON.stringify(newState)
    })
  }

  logPerformanceMetric(type: 'memory' | 'longTask' | 'render', data: any) {
    if (!this.isEnabled) return

    switch (type) {
      case 'memory':
        this.performance.memoryUsage?.push({
          timestamp: new Date().toISOString(),
          ...data
        })
        if (this.performance.memoryUsage && this.performance.memoryUsage.length > 100) {
          this.performance.memoryUsage = this.performance.memoryUsage.slice(-100)
        }
        break
      case 'longTask':
        this.performance.longTasks?.push({
          timestamp: new Date().toISOString(),
          ...data
        })
        break
      case 'render':
        this.performance.renderTimes?.push({
          timestamp: new Date().toISOString(),
          ...data
        })
        break
    }
  }

  getEvents(filter?: string) {
    if (filter) {
      return this.events.filter(event => 
        event.type.toLowerCase().includes(filter.toLowerCase()) ||
        JSON.stringify(event.data).toLowerCase().includes(filter.toLowerCase())
      )
    }
    return this.events
  }

  getNetworkCalls() {
    return this.networkCalls
  }

  getStateHistory() {
    return this.stateHistory
  }

  getPerformanceMetrics() {
    return this.performance
  }

  getFullReport() {
    return {
      sessionId: this.sessionId,
      events: this.events,
      networkCalls: this.networkCalls,
      stateHistory: this.stateHistory,
      performance: this.performance,
      browser: typeof window !== 'undefined' ? {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      } : null,
      summary: {
        totalEvents: this.events.length,
        totalNetworkCalls: this.networkCalls.length,
        totalStateChanges: this.stateHistory.length,
        errorCount: this.events.filter(e => e.type.includes('ERROR')).length,
        timeoutCount: this.events.filter(e => e.type.includes('TIMEOUT')).length
      }
    }
  }

  exportReport() {
    if (typeof window === 'undefined') return

    const report = this.getFullReport()
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `debug-report-${this.sessionId}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    this.logEvent('DEBUG_REPORT_EXPORTED', { filename: a.download })
  }

  private exportCriticalEvent(event: DebugEvent) {
    if (typeof window === 'undefined') return

    const criticalReport = {
      criticalEvent: event,
      recentEvents: this.events.slice(-20),
      recentNetworkCalls: this.networkCalls.slice(-10),
      recentStateChanges: this.stateHistory.slice(-10),
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    }

    console.error('🚨 CRITICAL EVENT DETECTED:', event.type, criticalReport)

    // Auto-export critical events
    const blob = new Blob([JSON.stringify(criticalReport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `critical-${event.type}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  clear() {
    this.events = []
    this.networkCalls = []
    this.stateHistory = []
    this.performance = {
      memoryUsage: [],
      longTasks: [],
      renderTimes: []
    }
    this.logEvent('DEBUG_DATA_CLEARED', {})
  }

  // Search functionality
  search(query: string) {
    const lowerQuery = query.toLowerCase()
    return {
      events: this.events.filter(event => 
        event.type.toLowerCase().includes(lowerQuery) ||
        JSON.stringify(event.data).toLowerCase().includes(lowerQuery)
      ),
      networkCalls: this.networkCalls.filter(call =>
        call.url.toLowerCase().includes(lowerQuery) ||
        call.method.toLowerCase().includes(lowerQuery)
      ),
      stateHistory: this.stateHistory.filter(state =>
        state.component.toLowerCase().includes(lowerQuery) ||
        state.reason.toLowerCase().includes(lowerQuery)
      )
    }
  }
}

export const debugStore = new DebugStore()

// Global access for console debugging
if (typeof window !== 'undefined') {
  (window as any).debugStore = debugStore
}
