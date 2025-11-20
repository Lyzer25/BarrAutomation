import { NextResponse } from "next/server"
import { leadEventEmitter } from "@/lib/events"
import { webhookLogger, extractRequestMetadata, createTimer } from "@/lib/webhook-logger"
import type { DashboardData } from "@/types/automation-types"
import { addStatusUpdate, setDashboardData } from "@/lib/event-store"

// Helper for development-only logging
const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    devLog(...args)
  }
}

const devWarn = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    devWarn(...args)
  }
}

export async function POST(request: Request, { params }: { params: { leadId: string } }) {
  const timer = createTimer()
  const { headers, userAgent, sourceIP } = extractRequestMetadata(request)
  const leadId = params.leadId

  devLog('🎯 Dashboard Update Webhook Called')
  devLog(`   📋 Lead ID: ${leadId}`)
  devLog(`   🌐 Source IP: ${sourceIP}`)
  devLog(`   🔧 User Agent: ${userAgent}`)

  // Validate leadId
  if (!leadId) {
    const processingTime = timer()
    const errorMsg = "Missing leadId in URL parameters"
    
    webhookLogger.logRequest({
      endpoint: '/api/webhook/dashboard-update/[missing]',
      leadId: 'unknown',
      method: 'POST',
      headers,
      body: null,
      processingTime,
      success: false,
      error: errorMsg,
      eventEmitted: false,
      responseStatus: 400,
      responseBody: { error: errorMsg },
      userAgent,
      sourceIP,
    })

    devLog(`❌ Dashboard Update Failed: ${errorMsg}`)
    return NextResponse.json({ error: errorMsg }, { status: 400 })
  }

  let requestBody: any = null
  let eventEmitted = false
  let responseBody: any = null
  let responseStatus = 200

  try {
    // Parse request body
    try {
      requestBody = await request.json()
      devLog(`📤 Raw Request Body:`, JSON.stringify(requestBody, null, 2))
    } catch (parseError) {
      const errorMsg = "Invalid JSON in request body"
      const processingTime = timer()
      
      webhookLogger.logRequest({
        endpoint: '/api/webhook/dashboard-update/[leadId]',
        leadId,
        method: 'POST',
        headers,
        body: null,
        processingTime,
        success: false,
        error: errorMsg,
        errorStack: parseError instanceof Error ? parseError.stack : undefined,
        eventEmitted: false,
        responseStatus: 400,
        responseBody: { error: errorMsg },
        userAgent,
        sourceIP,
      })

      devLog(`❌ JSON Parse Error: ${errorMsg}`)
      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }

    // Handle nested dashboard structure
    let dashboardData = requestBody
    if (requestBody.dashboard) {
      dashboardData = requestBody.dashboard
      devLog(`📦 Extracted nested dashboard data`)
    }

    devLog(`📊 Processing Dashboard Data:`, JSON.stringify(dashboardData, null, 2))

    // Validate and process leadScore
    if (dashboardData.leadScore !== undefined) {
      const originalScore = dashboardData.leadScore
      dashboardData.leadScore = Number(dashboardData.leadScore)
      
      if (isNaN(dashboardData.leadScore)) {
        const errorMsg = `Invalid leadScore: "${originalScore}" cannot be converted to number`
        const processingTime = timer()
        responseStatus = 400
        responseBody = { 
          error: errorMsg, 
          received: { leadScore: originalScore },
          leadId 
        }
        
        webhookLogger.logRequest({
          endpoint: '/api/webhook/dashboard-update/[leadId]',
          leadId,
          method: 'POST',
          headers,
          body: requestBody,
          processingTime,
          success: false,
          error: errorMsg,
          eventEmitted: false,
          responseStatus,
          responseBody,
          userAgent,
          sourceIP,
        })

        devLog(`❌ Lead Score Validation Error: ${errorMsg}`)
        return NextResponse.json(responseBody, { status: responseStatus })
      }
      
      devLog(`✅ Lead Score processed: ${originalScore} → ${dashboardData.leadScore}`)
    }

    // Ensure leadData exists with fallback
    if (!dashboardData.leadData) {
      dashboardData.leadData = { 
        name: 'Demo Lead', 
        email: '', 
        phone: '', 
        message: '' 
      }
      devLog(`📝 Applied default leadData fallback`)
    }

    // Validate required dashboard fields
    const validationErrors: string[] = []
    
    if (dashboardData.leadScore === undefined || dashboardData.leadScore === null) {
      validationErrors.push('leadScore is required')
    }
    
    if (!dashboardData.leadData || typeof dashboardData.leadData !== 'object') {
      validationErrors.push('leadData must be an object')
    }

    if (validationErrors.length > 0) {
      const errorMsg = `Dashboard validation failed: ${validationErrors.join(', ')}`
      const processingTime = timer()
      responseStatus = 400
      responseBody = { 
        error: errorMsg, 
        validationErrors,
        received: dashboardData,
        leadId 
      }
      
      webhookLogger.logRequest({
        endpoint: '/api/webhook/dashboard-update/[leadId]',
        leadId,
        method: 'POST',
        headers,
        body: requestBody,
        processingTime,
        success: false,
        error: errorMsg,
        eventEmitted: false,
        responseStatus,
        responseBody,
        userAgent,
        sourceIP,
      })

      devLog(`❌ Dashboard Validation Errors:`)
      validationErrors.forEach(error => devLog(`   • ${error}`))
      return NextResponse.json(responseBody, { status: responseStatus })
    }

    devLog(`✅ Dashboard Validation Passed`)
    devLog(`   📊 Lead Score: ${dashboardData.leadScore}`)
    devLog(`   👤 Lead Name: ${dashboardData.leadData?.name || 'Unknown'}`)
    devLog(`   📧 Lead Email: ${dashboardData.leadData?.email || 'Unknown'}`)

    // Emit event to EventEmitter, persist dashboard snapshot, and emit canonical dashboard-complete status
    try {
      // Emit raw dashboard payload for clients that listen for dashboard-update
      leadEventEmitter.emitUpdate(leadId, { type: "dashboard-update", payload: dashboardData })

      // Persist dashboard snapshot for new SSE subscribers
      try {
        setDashboardData(leadId, dashboardData)
      } catch (persistErr) {
        devWarn("⚠️ Failed to persist dashboard data to event store:", persistErr)
      }

      // Also emit a status-update event using the canonical step id expected by the UI
      try {
        const statusPayload = { step: "dashboard-complete", status: "complete", message: "Dashboard ready" }
        leadEventEmitter.emitUpdate(leadId, { type: "status-update", payload: statusPayload })
        // Persist the status update to the event store as well
        try {
          addStatusUpdate(leadId, { step: statusPayload.step, status: statusPayload.status, message: statusPayload.message, timestamp: new Date().toISOString() })
        } catch (persistStatusErr) {
          devWarn("⚠️ Failed to persist dashboard status to event store:", persistStatusErr)
        }
      } catch (statusEmitErr) {
        devWarn("⚠️ Failed to emit dashboard-complete status update:", statusEmitErr)
      }

      eventEmitted = true
      devLog(`📡 Dashboard event emitted successfully to EventEmitter`)
    } catch (emitError) {
      devLog(`❌ Failed to emit dashboard event:`, emitError)
      // Continue processing even if event emission fails
    }

    // Prepare success response
    responseBody = { 
      success: true, 
      leadId,
      dashboardProcessed: true,
      leadScore: dashboardData.leadScore,
      leadName: dashboardData.leadData?.name,
      timestamp: new Date().toISOString()
    }

    const processingTime = timer()
    
    // Log successful request
    webhookLogger.logRequest({
      endpoint: '/api/webhook/dashboard-update/[leadId]',
      leadId,
      method: 'POST',
      headers,
      body: requestBody,
      processingTime,
      success: true,
      eventEmitted,
      responseStatus,
      responseBody,
      userAgent,
      sourceIP,
    })

    devLog(`✅ Dashboard Update Completed Successfully`)
    devLog(`   ⏱️  Processing Time: ${processingTime}ms`)
    devLog(`   📊 Final Dashboard Data Keys: ${Object.keys(dashboardData).join(', ')}`)
    
    return NextResponse.json(responseBody, { status: responseStatus })

  } catch (error) {
    const processingTime = timer()
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    const errorStack = error instanceof Error ? error.stack : undefined
    
    responseStatus = 500
    responseBody = { 
      error: "Server error", 
      details: errorMessage,
      leadId,
      timestamp: new Date().toISOString()
    }

    // Try to emit error event
    try {
      leadEventEmitter.emitUpdate(leadId, { 
        type: "error", 
        payload: { message: "Dashboard webhook processing failed." } 
      })
      eventEmitted = true
    } catch (emitError) {
      devLog(`❌ Failed to emit error event:`, emitError)
    }

    // Log failed request
    webhookLogger.logRequest({
      endpoint: '/api/webhook/dashboard-update/[leadId]',
      leadId,
      method: 'POST',
      headers,
      body: requestBody,
      processingTime,
      success: false,
      error: errorMessage,
      errorStack,
      eventEmitted,
      responseStatus,
      responseBody,
      userAgent,
      sourceIP,
    })

    devLog(`❌ Dashboard Update Failed`)
    devLog(`   🚨 Error: ${errorMessage}`)
    devLog(`   ⏱️  Processing Time: ${processingTime}ms`)
    
    return NextResponse.json(responseBody, { status: responseStatus })
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  )
}
