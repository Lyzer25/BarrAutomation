/**
 * Webhook Logger Service
 * Tracks webhook calls, errors, and performance metrics
 */

export interface WebhookLog {
  id: string
  timestamp: Date
  endpoint: string
  leadId: string
  method: string
  headers: Record<string, string>
  body: any
  processingTime: number
  success: boolean
  error?: string
  errorStack?: string
  eventEmitted: boolean
  responseStatus: number
  responseBody?: any
  userAgent?: string
  sourceIP?: string
}

export interface HealthMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  lastActivity?: Date
  uptime: number
}

class WebhookLogger {
  private logs: WebhookLog[] = []
  private maxLogs = 100
  private startTime = Date.now()

  /**
   * Log a webhook request
   */
  logRequest(data: Omit<WebhookLog, 'id' | 'timestamp'>): WebhookLog {
    const log: WebhookLog = {
      id: `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...data,
    }

    this.logs.unshift(log)
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Log to console with emoji indicators
    const emoji = log.success ? '✅' : '❌'
    const duration = `${log.processingTime}ms`
    
    console.log(`${emoji} Webhook ${log.method} ${log.endpoint}`)
    console.log(`   📋 Lead ID: ${log.leadId}`)
    console.log(`   ⏱️  Duration: ${duration}`)
    console.log(`   📡 Event Emitted: ${log.eventEmitted ? 'Yes' : 'No'}`)
    console.log(`   📊 Status: ${log.responseStatus}`)
    
    if (!log.success && log.error) {
      console.log(`   ❌ Error: ${log.error}`)
    }

    return log
  }

  /**
   * Get recent webhook logs
   */
  getRecentLogs(limit = 50): WebhookLog[] {
    return this.logs.slice(0, limit)
  }

  /**
   * Get logs for a specific lead ID
   */
  getLogsByLeadId(leadId: string): WebhookLog[] {
    return this.logs.filter(log => log.leadId === leadId)
  }

  /**
   * Get health metrics
   */
  getHealthMetrics(): HealthMetrics {
    const totalRequests = this.logs.length
    const successfulRequests = this.logs.filter(log => log.success).length
    const failedRequests = totalRequests - successfulRequests
    
    const responseTimes = this.logs.map(log => log.processingTime)
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0

    const lastActivity = this.logs.length > 0 ? this.logs[0].timestamp : undefined
    const uptime = Date.now() - this.startTime

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime: Math.round(averageResponseTime),
      lastActivity,
      uptime,
    }
  }

  /**
   * Get system health status
   */
  getHealthStatus(): 'healthy' | 'degraded' | 'unhealthy' {
    const metrics = this.getHealthMetrics()
    
    if (metrics.totalRequests === 0) {
      return 'healthy' // No requests yet, assume healthy
    }

    const errorRate = metrics.failedRequests / metrics.totalRequests
    const avgResponseTime = metrics.averageResponseTime

    if (errorRate > 0.5 || avgResponseTime > 5000) {
      return 'unhealthy'
    } else if (errorRate > 0.2 || avgResponseTime > 2000) {
      return 'degraded'
    } else {
      return 'healthy'
    }
  }

  /**
   * Clear all logs (for testing)
   */
  clearLogs(): void {
    this.logs = []
    console.log('🧹 Webhook logs cleared')
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify({
      exportTime: new Date().toISOString(),
      totalLogs: this.logs.length,
      healthMetrics: this.getHealthMetrics(),
      logs: this.logs,
    }, null, 2)
  }

  /**
   * Get error summary
   */
  getErrorSummary(): { error: string; count: number; lastOccurrence: Date }[] {
    const errorCounts = new Map<string, { count: number; lastOccurrence: Date }>()
    
    this.logs
      .filter(log => !log.success && log.error)
      .forEach(log => {
        const error = log.error!
        const existing = errorCounts.get(error)
        
        if (existing) {
          existing.count++
          if (log.timestamp > existing.lastOccurrence) {
            existing.lastOccurrence = log.timestamp
          }
        } else {
          errorCounts.set(error, {
            count: 1,
            lastOccurrence: log.timestamp,
          })
        }
      })

    return Array.from(errorCounts.entries())
      .map(([error, data]) => ({ error, ...data }))
      .sort((a, b) => b.count - a.count)
  }
}

// Create singleton instance
export const webhookLogger = new WebhookLogger()

/**
 * Helper function to extract request metadata
 */
export function extractRequestMetadata(request: Request): {
  headers: Record<string, string>
  userAgent?: string
  sourceIP?: string
} {
  const headers: Record<string, string> = {}
  
  // Convert Headers to plain object
  request.headers.forEach((value, key) => {
    headers[key] = value
  })

  return {
    headers,
    userAgent: headers['user-agent'],
    sourceIP: headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown',
  }
}

/**
 * Helper function to measure execution time
 */
export function createTimer() {
  const start = Date.now()
  return () => Date.now() - start
}
