import { NextResponse } from "next/server"
import { leadEventEmitter } from "@/lib/events"
import type { DashboardData } from "@/types/automation-types"

export async function POST(request: Request, { params }: { params: { leadId: string } }) {
  console.log('Route hit with leadId:', params.leadId);
  const urlLeadId = params.leadId;
  if (!urlLeadId) {
    return NextResponse.json({ error: "Missing leadId in URL" }, { status: 400 });
  }

  try {
    let body = await request.json();
    console.log('Body before validation:', JSON.stringify(body));
    // Accept both flat and nested dashboard
    if (body.dashboard) body = body.dashboard;
    // Accept leadId from params
    const leadId = params.leadId;
    // Coerce leadScore to number and fallback for leadData
    body.leadScore = Number(body.leadScore);
    if (isNaN(body.leadScore)) {
      return NextResponse.json({ error: "Invalid dashboard payload: leadScore must be a number" }, { status: 400 });
    }
    body.leadData = body.leadData || { name: 'Demo Lead', email: '', phone: '', message: '' };
    // Basic validation for dashboard fields
    if (!body.leadScore || !body.leadData) {
      return NextResponse.json({ error: "Invalid dashboard payload: missing leadScore or leadData" }, { status: 400 });
    }
    console.log('Validation passed for leadId:', leadId);
    // Log received data
    console.log(`Received dashboard data for ${leadId}:`, body);
    // "Broadcast" the final dashboard data
    leadEventEmitter.emitUpdate(leadId, { type: "dashboard-update", payload: body });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in dashboard-update webhook for ${params.leadId}:`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    leadEventEmitter.emitUpdate(urlLeadId, { type: "error", payload: { message: "Dashboard webhook failed." } });
    return NextResponse.json({ error: "Server error", details: errorMessage }, { status: 500 });
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
