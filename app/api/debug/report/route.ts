import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      server: 'healthy',
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      env: process.env.NODE_ENV,
      pid: process.pid
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to get server debug info',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const debugData = await request.json()
    
    // Log client debug data on server
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Client debug report received:', {
        sessionId: debugData.sessionId,
        totalEvents: debugData.summary?.totalEvents || 0,
        errorCount: debugData.summary?.errorCount || 0,
        timeoutCount: debugData.summary?.timeoutCount || 0,
        timestamp: new Date().toISOString()
      })
    }
    
    // In a real application, you might want to:
    // - Store this data in a database
    // - Send alerts for critical errors
    // - Aggregate metrics for monitoring
    
    return NextResponse.json({ 
      received: true,
      timestamp: new Date().toISOString(),
      processed: {
        sessionId: debugData.sessionId,
        eventCount: debugData.events?.length || 0,
        networkCallCount: debugData.networkCalls?.length || 0,
        stateChangeCount: debugData.stateHistory?.length || 0
      }
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to process client debug report:', error)
    }
    return NextResponse.json(
      { 
        error: 'Failed to process debug report',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  )
}
