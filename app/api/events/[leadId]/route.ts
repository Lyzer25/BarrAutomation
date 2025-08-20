import { NextResponse } from "next/server";
import { leadEventEmitter } from "@/lib/events";

export async function GET(request, { params }) {
  const { leadId } = params;
  if (!leadId) {
    return new Response('Missing leadId', { status: 400 });
  }

  let controllerRef;
  return new Response(
    new ReadableStream({
      start(controller) {
        controllerRef = controller;
        if (!leadEventEmitter) {
          controller.error('leadEventEmitter not available');
          return;
        }
        console.log('SSE connected for leadId:', leadId);
        const handleUpdate = (update) => {
          controller.enqueue(`data: ${JSON.stringify(update)}\n\n`);
          console.log('Pushed event to SSE for leadId:', leadId, update);
        };
        leadEventEmitter.subscribe(leadId, handleUpdate);
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
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    }
  );
}
