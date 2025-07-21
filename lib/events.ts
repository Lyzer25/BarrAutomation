import { EventEmitter } from "events"

// This is a simple in-memory event bus to simulate WebSocket broadcasting in the Next.js environment.
// In a real production environment, this would be replaced by a WebSocket server (e.g., using ws, socket.io)
// or a service like Pusher, Ably, or Vercel's Serverless Functions with WebSocket support.

class LeadEventEmitter extends EventEmitter {
  constructor() {
    super()
    this.setMaxListeners(100) // Increase listener limit for concurrent demos
  }

  emitUpdate(leadId: string, event: any) {
    this.emit(leadId, event)
  }

  subscribe(leadId: string, callback: (event: any) => void) {
    this.on(leadId, callback)
  }

  unsubscribe(leadId: string, callback: (event: any) => void) {
    this.removeListener(leadId, callback)
  }
}

export const leadEventEmitter = new LeadEventEmitter()
