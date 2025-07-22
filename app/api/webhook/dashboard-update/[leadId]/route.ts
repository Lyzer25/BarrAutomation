import { NextResponse } from "next/server"
import { leadEventEmitter } from "@/lib/events"
import { webhookLogger, extractRequestMetadata, createTimer } from "@/lib/webhook-logger"
import type { DashboardData } from "@/types/automation-types"

export async function POST(request: Request, { params }: { params: { leadId: string } }) {
  const timer = createTimer()
  const { headers, userAgent, sourceIP } = extractRequestMetadata(request)
  const leadId = params.leadId
  
  console.log('🎯 Dashboard Update Webhook Called')
  console.log(`   📋 Lead ID: ${leadId}`)
  console.log(`   🌐 Source IP: ${sourceIP}`)
  console.log(`   🔧 User Agent: ${userAgent}`)

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

    console.log(`❌ Dashboard Update Failed: ${errorMsg}`)
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
      console.log(`📤 Raw Request Body:`, JSON.stringify(requestBody, null, 2))
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

      console.log(`❌ JSON Parse Error: ${errorMsg}`)
      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }

    // Handle nested dashboard structure
    let dashboardData = requestBody
    if (requestBody.dashboard) {
      dashboardData = requestBody.dashboard
      console.log(`📦 Extracted nested dashboard data`)
    }

    console.log(`📊 Processing Dashboard Data:`, JSON.stringify(dashboardData, null, 2))

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

        console.log(`❌ Lead Score Validation Error: ${errorMsg}`)
        return NextResponse.json(responseBody, { status: responseStatus })
      }
      
      console.log(`✅ Lead Score processed: ${originalScore} → ${dashboardData.leadScore}`)
    }

    // Ensure leadData exists with fallback
    if (!dashboardData.leadData) {
      dashboardData.leadData = { 
        name: 'Demo Lead', 
        email: '', 
        phone: '', 
        message: '' 
      }
      console.log(`📝 Applied default leadData fallback`)
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

      console.log(`❌ Dashboard Validation Errors:`)
      validationErrors.forEach(error => console.log(`   • ${error}`))
      return NextResponse.json(responseBody, { status: responseStatus })
    }

    console.log(`✅ Dashboard Validation Passed`)
    console.log(`   📊 Lead Score: ${dashboardData.leadScore}`)
    console.log(`   👤 Lead Name: ${dashboardData.leadData?.name || 'Unknown'}`)
    console.log(`   📧 Lead Email: ${dashboardData.leadData?.email || 'Unknown'}`)

    // Emit event to EventEmitter
    try {
      leadEventEmitter.emitUpdate(leadId, { type: "dashboard-update", payload: dashboardData })
      eventEmitted = true
      console.log(`📡 Dashboard event emitted successfully to EventEmitter`)
    } catch (emitError) {
      console.log(`❌ Failed to emit dashboard event:`, emitError)
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

    console.log(`✅ Dashboard Update Completed Successfully`)
    console.log(`   ⏱️  Processing Time: ${processingTime}ms`)
    console.log(`   📊 Final Dashboard Data Keys: ${Object.keys(dashboardData).join(', ')}`)
    
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
      console.log(`❌ Failed to emit error event:`, emitError)
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

    console.log(`❌ Dashboard Update Failed`)
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
