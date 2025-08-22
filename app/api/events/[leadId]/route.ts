import { NextResponse } from "next/server";
import { leadEventEmitter } from "@/lib/events";
import { getSnapshot } from "@/lib/event-store";

export async function GET(request: Request, { params }: { params: { leadId: string } }) {
  const { leadId } = params;
  if (!leadId) {
    return new Response('Missing leadId', { status: 400 });
  }

  let controllerRef: ReadableStreamDefaultController<any> | undefined;
  return new Response(
    new ReadableStream({
      start(controller) {
        controllerRef = controller;
        if (!leadEventEmitter) {
          controller.error('leadEventEmitter not available');
          return;
        }
        console.log('SSE connected for leadId:', leadId);
        const handleUpdate = (update: any) => {
          controller.enqueue(`data: ${JSON.stringify(update)}\n\n`);
          console.log('Pushed event to SSE for leadId:', leadId, update);
        };
        leadEventEmitter.subscribe(leadId, handleUpdate);

        // Send current snapshot to the newly connected client so they start with the latest state
        try {
          const snapshot = getSnapshot(leadId);
          if (snapshot) {
            // Send status log entries first (most recent first)
            if (snapshot.statusLog && snapshot.statusLog.length) {
              snapshot.statusLog.forEach((entry) => {
                const evt = { type: "status-update", payload: { step: entry.step, status: entry.status, message: entry.message, timestamp: entry.timestamp } };
                controller.enqueue(`data: ${JSON.stringify(evt)}\n\n`);
              });
            } else if (snapshot.statuses) {
              // Fallback: send statuses if no log is available
              Object.entries(snapshot.statuses).forEach(([step, status]) => {
                const evt = { type: "status-update", payload: { step, status } };
                controller.enqueue(`data: ${JSON.stringify(evt)}\n\n`);
              });
            }

            // Send dashboard snapshot if available
            if (snapshot.dashboardData) {
              controller.enqueue(`data: ${JSON.stringify({ type: "dashboard-update", payload: snapshot.dashboardData })}\n\n`);
            }
          }
        } catch (snapshotErr) {
          console.warn("⚠️ Failed to send initial snapshot to SSE client:", snapshotErr);
        }

        // Keep-alive ping
        const ping = setInterval(() => controller.enqueue(':ping\n\n'), 30000);
        controller.enqueue(`event: open\ndata: "SSE connection established for ${leadId}"\n\n`);
        // Cleanup on abort
        request.signal?.addEventListener('abort', () => {
          leadEventEmitter.unsubscribe(leadId, handleUpdate);
          clearInterval(ping);
        });
      },
      cancel() {},
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        // Allow cross-origin EventSource connections (use more restrictive value in production if needed)
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        // Prevent caches and indicate a streaming response
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    }
  );
}
