import { NextResponse } from "next/server";
import { leadEventEmitter } from "@/lib/events";

export async function GET(request, { params }) {
  const { leadId } = params;
  if (!leadId) {
    return new Response('Missing leadId', { status: 400 });
  }

  return new Response(
    new ReadableStream({
      start(controller) {
        const send = (update) => {
          controller.enqueue(`data: ${JSON.stringify(update)}\n\n`);
        };
        leadEventEmitter.subscribe(leadId, send);
        // Send a ping every 30s to keep connection alive
        const ping = setInterval(() => controller.enqueue(':ping\n\n'), 30000);
        controller.enqueue(`event: open\ndata: "SSE connection established for ${leadId}"\n\n`);
        // Clean up on close
        controller.closed.then(() => {
          leadEventEmitter.unsubscribe(leadId, send);
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