import { NextResponse } from "next/server"
import { webhookLogger } from "@/lib/webhook-logger"
import { leadEventEmitter } from "@/lib/events"

export interface WebhookHealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  metrics: {
    totalRequests: number
    successfulRequests: number
    failedRequests: number
    successRate: number
    errorRate: number
    averageResponseTime: number
  }
  eventEmitter: {
    listenerCount: number
    maxListeners: number
  }
  recentActivity: {
    lastActivity?: string
    recentLogs: Array<{
      id: string
      timestamp: string
      endpoint: string
      leadId: string
      success: boolean
      processingTime: number
      error?: string
    }>
  }
  errorSummary: Array<{
    error: string
    count: number
    lastOccurrence: string
  }>
  system: {
    nodeVersion: string
    platform: string
    memoryUsage: any
  }
}

export async function GET() {
  try {
    const healthMetrics = webhookLogger.getHealthMetrics()
    const healthStatus = webhookLogger.getHealthStatus()
    const recentLogs = webhookLogger.getRecentLogs(10)
    const errorSummary = webhookLogger.getErrorSummary()

    // Get EventEmitter info (simplified)
    const eventEmitterInfo = {
      listenerCount: 0, // Simplified for now
      maxListeners: 10,
    }

    // Calculate rates
    const successRate = healthMetrics.totalRequests > 0 
      ? (healthMetrics.successfulRequests / healthMetrics.totalRequests) * 100 
      : 100
    const errorRate = healthMetrics.totalRequests > 0 
      ? (healthMetrics.failedRequests / healthMetrics.totalRequests) * 100 
      : 0

    // Format recent logs for response
    const formattedLogs = recentLogs.map(log => ({
      id: log.id,
      timestamp: log.timestamp.toISOString(),
      endpoint: log.endpoint,
      leadId: log.leadId,
      success: log.success,
      processingTime: log.processingTime,
      error: log.error,
    }))

    // Format error summary
    const formattedErrors = errorSummary.map(error => ({
      error: error.error,
      count: error.count,
      lastOccurrence: error.lastOccurrence.toISOString(),
    }))

    const response: WebhookHealthResponse = {
      status: healthStatus,
      timestamp: new Date().toISOString(),
      uptime: healthMetrics.uptime,
      metrics: {
        totalRequests: healthMetrics.totalRequests,
        successfulRequests: healthMetrics.successfulRequests,
        failedRequests: healthMetrics.failedRequests,
        successRate: Math.round(successRate * 100) / 100,
        errorRate: Math.round(errorRate * 100) / 100,
        averageResponseTime: healthMetrics.averageResponseTime,
      },
      eventEmitter: eventEmitterInfo,
      recentActivity: {
        lastActivity: healthMetrics.lastActivity?.toISOString(),
        recentLogs: formattedLogs,
      },
      errorSummary: formattedErrors,
      system: {
        nodeVersion: 'Node.js',
        platform: 'server',
        memoryUsage: { rss: 0, heapUsed: 0, heapTotal: 0, external: 0, arrayBuffers: 0 },
      },
    }

    // Log the health check request
    console.log('🏥 Webhook Health Check Requested')
    console.log(`   📊 Status: ${healthStatus}`)
    console.log(`   📈 Success Rate: ${successRate.toFixed(1)}%`)
    console.log(`   📉 Error Rate: ${errorRate.toFixed(1)}%`)
    console.log(`   ⏱️  Avg Response Time: ${healthMetrics.averageResponseTime}ms`)
    console.log(`   📡 Event Listeners: ${eventEmitterInfo.listenerCount}`)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })

  } catch (error) {
    console.error('❌ Health check failed:', error)
    
    const errorResponse = {
      status: 'unhealthy' as const,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Health check failed',
      uptime: 0,
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Handle different health check actions
    if (body.action === 'clear-logs') {
      webhookLogger.clearLogs()
      console.log('🧹 Webhook logs cleared via health endpoint')
      
      return NextResponse.json({
        success: true,
        action: 'clear-logs',
        message: 'Webhook logs cleared successfully',
        timestamp: new Date().toISOString(),
      })
    }

    if (body.action === 'export-logs') {
      const exportData = webhookLogger.exportLogs()
      
      return NextResponse.json({
        success: true,
        action: 'export-logs',
        data: JSON.parse(exportData),
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      error: 'Invalid action',
      availableActions: ['clear-logs', 'export-logs'],
    }, { status: 400 })

  } catch (error) {
    console.error('❌ Health check POST failed:', error)
    
    return NextResponse.json({
      error: 'Health check action failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
