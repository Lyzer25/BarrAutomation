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
    const body = await request.json();
    console.log('Body before validation:', JSON.stringify(body));
    // Expecting: { leadId, status, dashboard }
    const { leadId: bodyLeadId, status, dashboard } = body;
    if (bodyLeadId && bodyLeadId !== urlLeadId) {
      return NextResponse.json({ error: "leadId in URL and body do not match" }, { status: 400 });
    }
    if (!dashboard || typeof dashboard !== 'object') {
      return NextResponse.json({ error: "Missing or invalid dashboard object" }, { status: 400 });
    }

    // Coerce leadScore to number and fallback for leadData
    dashboard.leadScore = Number(dashboard.leadScore);
    if (isNaN(dashboard.leadScore)) {
      return NextResponse.json({ error: "Invalid dashboard payload: leadScore must be a number" }, { status: 400 });
    }
    dashboard.leadData = dashboard.leadData || { name: '', email: '', phone: '', message: '' };

    // Basic validation for dashboard fields
    if (!dashboard.leadScore || !dashboard.leadData) {
      return NextResponse.json({ error: "Invalid dashboard payload: missing leadScore or leadData" }, { status: 400 });
    }

    // Log received data
    console.log(`Received dashboard data for ${urlLeadId}:`, dashboard);

    // "Broadcast" the final dashboard data
    leadEventEmitter.emitUpdate(urlLeadId, { type: "dashboard-update", payload: dashboard });

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
