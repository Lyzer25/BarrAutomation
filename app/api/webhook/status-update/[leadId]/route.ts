import { NextResponse } from "next/server"
import { leadEventEmitter } from "@/lib/events"
import { webhookLogger, extractRequestMetadata, createTimer } from "@/lib/webhook-logger"
import type { StatusUpdate } from "@/types/automation-types"

export async function POST(request: Request, { params }: { params: { leadId: string } }) {
  const timer = createTimer()
  const { headers, userAgent, sourceIP } = extractRequestMetadata(request)
  const leadId = params.leadId
  
  console.log('🔄 Status Update Webhook Called')
  console.log(`   📋 Lead ID: ${leadId}`)
  console.log(`   🌐 Source IP: ${sourceIP}`)
  console.log(`   🔧 User Agent: ${userAgent}`)

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

    console.log(`❌ Status Update Failed: ${errorMsg}`)
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
      console.log(`📤 Request Body:`, JSON.stringify(requestBody, null, 2))
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

      console.log(`❌ JSON Parse Error: ${errorMsg}`)
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

      console.log(`❌ Validation Error: ${errorMsg}`)
      console.log(`   📋 Received:`, requestBody)
      return NextResponse.json(responseBody, { status: responseStatus })
    }

    console.log(`✅ Validation Passed`)
    console.log(`   📝 Step: ${requestBody.step}`)
    console.log(`   📊 Status: ${requestBody.status}`)
    console.log(`   💬 Message: ${requestBody.message || 'none'}`)

    // Emit event to EventEmitter
    try {
      leadEventEmitter.emitUpdate(leadId, { type: "status-update", payload: requestBody })
      eventEmitted = true
      console.log(`📡 Event emitted successfully to EventEmitter`)
    } catch (emitError) {
      console.log(`❌ Failed to emit event:`, emitError)
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

    console.log(`✅ Status Update Completed Successfully`)
    console.log(`   ⏱️  Processing Time: ${processingTime}ms`)
    
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
      console.log(`❌ Failed to emit error event:`, emitError)
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

    console.log(`❌ Status Update Failed`)
    console.log(`   🚨 Error: ${errorMessage}`)
    console.log(`   ⏱️  Processing Time: ${processingTime}ms`)
    
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
