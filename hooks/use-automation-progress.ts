"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { DashboardData } from "@/types/automation-types"

interface StatusUpdate {
  step: string
  status: string
  message: string
  timestamp: string
}

interface DebugInfo {
  sseReadyState: number
  timeSinceLastEvent: number
  timeSinceStart: number
  eventCount: number
  lastEventType: string
}

export function useAutomationProgress() {
  const [statuses, setStatuses] = useState<Record<string, string>>({})
  const [statusLog, setStatusLog] = useState<StatusUpdate[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    sseReadyState: 0,
    timeSinceLastEvent: 0,
    timeSinceStart: 0,
    eventCount: 0,
    lastEventType: "",
  })

  const eventSourceRef = useRef<EventSource | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const lastEventTimeRef = useRef<number>(Date.now())
  const activeLeadIdRef = useRef<string | null>(null)

  // Reconnect/backoff refs
  const reconnectAttemptsRef = useRef<number>(0)
  const reconnectTimerRef = useRef<number | null>(null)
  const isManuallyStoppedRef = useRef<boolean>(false)

  // Initialize default statuses
  const initializeStatuses = useCallback(() => {
    const defaultStatuses = {
      "lead-received": "pending",
      "data-processing": "pending",
      "ai-qualification": "pending",
      "email-sent": "pending",
      "crm-complete": "pending",
      "discord-sent": "pending",
      "dashboard-complete": "pending",
    }
    setStatuses(defaultStatuses)
    setIsComplete(false)
    setError(null)
    setStatusLog([])
    setDashboardData(null)
  }, [])

  // Check completion status
  const checkCompletion = useCallback((currentStatuses: Record<string, string>) => {
    const requiredSteps = [
      "lead-received",
      "data-processing",
      "ai-qualification",
      "email-sent",
      "crm-complete",
      "discord-sent",
      "dashboard-complete",
    ]

    const completedSteps = requiredSteps.filter((step) => currentStatuses[step] === "complete")
    const isWorkflowComplete = completedSteps.length === requiredSteps.length

    console.log("🏁 isComplete state changed:", isWorkflowComplete)
    console.log("📊 Statuses changed:", currentStatuses)
    console.log("✅ Completed steps:", completedSteps.length + "/" + requiredSteps.length)

    setIsComplete(isWorkflowComplete)
    return isWorkflowComplete
  }, [])

  // Start automation with reconnect/backoff
  const startAutomation = useCallback(
    async (leadId: string) => {
      try {
        console.log("🚀 Starting automation for leadId:", leadId)
        activeLeadIdRef.current = leadId
        initializeStatuses()

        // Reset manual stop and reconnect attempts
        isManuallyStoppedRef.current = false
        reconnectAttemptsRef.current = 0
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current)
          reconnectTimerRef.current = null
        }

        // Close existing connection if present
        if (eventSourceRef.current) {
          try {
            eventSourceRef.current.close()
          } catch (e) {
            /* ignore */
          }
        }

        // Helper to create and manage EventSource with reconnect/backoff
        const createConnection = () => {
          const url = `/api/events/${leadId}`
          console.log("🔌 Creating EventSource to:", url)

          // Ensure old connection closed
          if (eventSourceRef.current) {
            try {
              eventSourceRef.current.close()
            } catch (e) {
              /* ignore */
            }
          }

          const es = new EventSource(url)
          eventSourceRef.current = es
          startTimeRef.current = Date.now()
          lastEventTimeRef.current = Date.now()

          es.onopen = () => {
            console.log("📡 SSE connection opened")
            setError(null)
            reconnectAttemptsRef.current = 0
            if (reconnectTimerRef.current) {
              clearTimeout(reconnectTimerRef.current)
              reconnectTimerRef.current = null
            }
            setDebugInfo((prev) => ({ ...prev, sseReadyState: es.readyState }))
          }

          es.onmessage = (event) => {
            try {
              lastEventTimeRef.current = Date.now()
              const data = JSON.parse(event.data)
              console.log("📨 SSE message received:", data)

              const eventType = data.type || (data.payload && data.payload.type) || "unknown"
              const payload = data.payload ?? data

              setDebugInfo((prev) => ({
                ...prev,
                sseReadyState: es.readyState,
                timeSinceLastEvent: 0,
                eventCount: prev.eventCount + 1,
                lastEventType: eventType || "unknown",
              }))

              if (eventType === "status-update") {
                const { step, status, message } = payload as any

                if (!step || !status) {
                  console.warn("⚠️ Received status-update without step/status:", payload)
                  return
                }

                setStatuses((prevStatuses) => {
                  const newStatuses = { ...prevStatuses, [step]: status }
                  checkCompletion(newStatuses)
                  return newStatuses
                })

                setStatusLog((prev) => [
                  ...prev,
                  {
                    step,
                    status,
                    message: message || `${step} ${status}`,
                    timestamp: new Date().toISOString(),
                  },
                ])
              } else if (eventType === "dashboard-update" || eventType === "dashboard-data") {
                console.log("📊 Dashboard data received:", payload)
                setDashboardData(payload as any)
                // also mark dashboard step complete if not already set
                setStatuses((prev) => {
                  if (prev["dashboard-complete"] !== "complete") {
                    const newStatuses = { ...prev, ["dashboard-complete"]: "complete" }
                    checkCompletion(newStatuses)
                    return newStatuses
                  }
                  return prev
                })
              } else {
                console.log("ℹ️ Unhandled SSE event type:", eventType, "payload:", payload)
              }
            } catch (err) {
              console.error("❌ Error parsing SSE message:", err)
            }
          }

          es.onerror = (err) => {
            console.error("❌ SSE connection error:", err)
            setError("Connection lost. Attempting to reconnect...")

            // Avoid reconnecting if user requested stop
            if (isManuallyStoppedRef.current) return

            // Exponential backoff with jitter
            const attempt = reconnectAttemptsRef.current + 1
            reconnectAttemptsRef.current = attempt
            const base = Math.min(30000, Math.pow(2, attempt) * 1000)
            const jitter = Math.floor(Math.random() * 1000)
            const delay = Math.min(30000, base + jitter)
            console.log(`⏱️ Reconnect attempt ${attempt} scheduled in ${delay}ms`)

            if (reconnectTimerRef.current) {
              clearTimeout(reconnectTimerRef.current)
            }
            reconnectTimerRef.current = window.setTimeout(() => {
              createConnection()
            }, delay)

            setDebugInfo((prev) => ({ ...prev, sseReadyState: es.readyState }))
          }
        }

        // Start the initial connection
        createConnection()
      } catch (err) {
        console.error("❌ Error starting automation:", err)
        setError("Failed to start automation. Please try again.")
      }
    },
    [initializeStatuses, checkCompletion],
  )

  // Update debug info periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (eventSourceRef.current) {
        setDebugInfo((prev) => ({
          ...prev,
          sseReadyState: eventSourceRef.current?.readyState || 0,
          timeSinceLastEvent: Date.now() - lastEventTimeRef.current,
          timeSinceStart: Date.now() - startTimeRef.current,
        }))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  return {
    statuses,
    statusLog,
    dashboardData,
    isComplete,
    error,
    debugInfo,
    startAutomation,
  }
}
