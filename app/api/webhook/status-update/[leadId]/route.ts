import { NextResponse } from "next/server"
import { leadEventEmitter } from "@/lib/events"
import { webhookLogger, extractRequestMetadata, createTimer } from "@/lib/webhook-logger"
import type { StatusUpdate } from "@/types/automation-types"
import { addStatusUpdate } from "@/lib/event-store"

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

  devLog('🔄 Status Update Webhook Called')
  devLog(`   📋 Lead ID: ${leadId}`)
  devLog(`   🌐 Source IP: ${sourceIP}`)
  devLog(`   🔧 User Agent: ${userAgent}`)

  // Validate leadId
  if (!leadId) {
    const processingTime = timer()
    const errorMsg = "Missing leadId in URL parameters"
    
    webhookLogger.logRequest({
      endpoint: '/api/webhook/status-update/[missing]',
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

    devLog(`❌ Status Update Failed: ${errorMsg}`)
    return NextResponse.json({ error: errorMsg }, { status: 400 })
  }

  let requestBody: any = null
  let eventEmitted = false
  let responseBody: any = null
  let responseStatus = 200

  try {
    // Parse request body
    try {
      requestBody = await request.json() as StatusUpdate
      devLog(`📤 Request Body:`, JSON.stringify(requestBody, null, 2))
    } catch (parseError) {
      const errorMsg = "Invalid JSON in request body"
      const processingTime = timer()
      
      webhookLogger.logRequest({
        endpoint: '/api/webhook/status-update/[leadId]',
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

    // Validate required fields
    if (!requestBody.step || !requestBody.status) {
      const errorMsg = "Missing required fields: 'step' and 'status' are required"
      const processingTime = timer()
      responseStatus = 400
      responseBody = { error: errorMsg, received: requestBody }
      
      webhookLogger.logRequest({
        endpoint: '/api/webhook/status-update/[leadId]',
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

      devLog(`❌ Validation Error: ${errorMsg}`)
      devLog(`   📋 Received:`, requestBody)
      return NextResponse.json(responseBody, { status: responseStatus })
    }

    devLog(`✅ Validation Passed`)
    devLog(`   📝 Step: ${requestBody.step}`)
    devLog(`   📊 Status: ${requestBody.status}`)
    devLog(`   💬 Message: ${requestBody.message || 'none'}`)

    // Normalize incoming step aliases (map common n8n / upstream variants to canonical client step IDs),
    // then emit event and persist snapshot for new subscribers
    try {
      // Map of known aliases -> canonical step ids expected by the frontend
      const stepAliasMap: Record<string, string> = {
        "ai-complete": "ai-qualification",
        "ai_done": "ai-qualification",
        "ai_result": "ai-qualification",
        "ai-analysis-complete": "ai-qualification",
        "dashboard-ready": "dashboard-complete",
        "dashboard_ready": "dashboard-complete",
        // add more aliases here if upstream uses different names
      }

      const incomingStep = requestBody.step
      const canonicalStep = stepAliasMap[incomingStep] || incomingStep

      if (canonicalStep !== incomingStep) {
        devLog(`🔁 Normalizing step id: ${incomingStep} -> ${canonicalStep}`)
      }

      const payloadWithCanonical = { ...requestBody, step: canonicalStep }

      // Emit normalized event
      leadEventEmitter.emitUpdate(leadId, { type: "status-update", payload: payloadWithCanonical })

      // Persist snapshot so newly connected SSE clients receive the current state (use canonical step)
      try {
        addStatusUpdate(leadId, {
          step: canonicalStep,
          status: payloadWithCanonical.status,
          message: payloadWithCanonical.message,
          timestamp: new Date().toISOString(),
        })
      } catch (persistErr) {
        devWarn("⚠️ Failed to persist status update to event store:", persistErr)
      }

      eventEmitted = true
      devLog(`📡 Event emitted successfully to EventEmitter (canonical step: ${canonicalStep})`)
    } catch (emitError) {
      devLog(`❌ Failed to emit event:`, emitError)
      // Continue processing even if event emission fails
    }

    // Prepare success response
    responseBody = { 
      success: true, 
      leadId,
      step: requestBody.step,
      status: requestBody.status,
      timestamp: new Date().toISOString()
    }

    const processingTime = timer()
    
    // Log successful request
    webhookLogger.logRequest({
      endpoint: '/api/webhook/status-update/[leadId]',
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

    devLog(`✅ Status Update Completed Successfully`)
    devLog(`   ⏱️  Processing Time: ${processingTime}ms`)
    
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
        payload: { message: "Status update webhook processing failed." } 
      })
      eventEmitted = true
    } catch (emitError) {
      devLog(`❌ Failed to emit error event:`, emitError)
    }

    // Log failed request
    webhookLogger.logRequest({
      endpoint: '/api/webhook/status-update/[leadId]',
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

    devLog(`❌ Status Update Failed`)
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
