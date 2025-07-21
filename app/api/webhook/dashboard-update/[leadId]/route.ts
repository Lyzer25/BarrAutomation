import { NextResponse } from "next/server"
import { leadEventEmitter } from "@/lib/events"
import type { DashboardData } from "@/types/automation-types"

export async function POST(request: Request, { params }: { params: { leadId: string } }) {
  const leadId = params.leadId
  if (!leadId) {
    return NextResponse.json({ error: "Missing leadId" }, { status: 400 })
  }

  try {
    const body = (await request.json()) as DashboardData
    console.log(`Received dashboard data for ${leadId}:`, body)

    // Basic validation
    if (!body.leadScore || !body.leadData) {
      return NextResponse.json({ error: "Invalid dashboard payload" }, { status: 400 })
    }

    // "Broadcast" the final dashboard data
    leadEventEmitter.emitUpdate(leadId, { type: "dashboard-update", payload: body })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in dashboard-update webhook for ${leadId}:`, error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    leadEventEmitter.emitUpdate(leadId, { type: "error", payload: { message: "Dashboard webhook failed." } })
    return NextResponse.json({ error: "Server error", details: errorMessage }, { status: 500 })
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
