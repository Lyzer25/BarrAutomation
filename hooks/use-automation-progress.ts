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

  // Start automation
  const startAutomation = useCallback(
    async (leadId: string) => {
      try {
        console.log("🚀 Starting automation for leadId:", leadId)
        activeLeadIdRef.current = leadId
        initializeStatuses()

        // Close existing connection
        if (eventSourceRef.current) {
          eventSourceRef.current.close()
        }

        // Start SSE connection
        const eventSource = new EventSource(`/api/events/${leadId}`)
        eventSourceRef.current = eventSource
        startTimeRef.current = Date.now()
        lastEventTimeRef.current = Date.now()

        eventSource.onopen = () => {
          console.log("📡 SSE connection opened")
          setError(null)
          setDebugInfo((prev) => ({ ...prev, sseReadyState: eventSource.readyState }))
        }

        eventSource.onmessage = (event) => {
          try {
            lastEventTimeRef.current = Date.now()
            const data = JSON.parse(event.data)
            console.log("📨 SSE message received:", data)

            // Normalize incoming payload shape so the client can handle both:
            // 1) { type: 'status-update', payload: { step, status, message } }
            // 2) { type: 'dashboard-update', payload: { ... } }
            // 3) legacy or direct shapes where step/status are at the top level
            const eventType = data.type || (data.payload && data.payload.type) || "unknown"
            const payload = data.payload ?? data

            setDebugInfo((prev) => ({
              ...prev,
              sseReadyState: eventSource.readyState,
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
              // Accept payload directly (dashboard webhook sends payload)
              console.log("📊 Dashboard data received:", payload)
              setDashboardData(payload as any)
            } else {
              // Unknown event type; log for debugging
              console.log("ℹ️ Unhandled SSE event type:", eventType, "payload:", payload)
            }
          } catch (err) {
            console.error("❌ Error parsing SSE message:", err)
          }
        }

        eventSource.onerror = (err) => {
          console.error("❌ SSE connection error:", err)
          setError("Connection lost. Please try again.")
          setDebugInfo((prev) => ({ ...prev, sseReadyState: eventSource.readyState }))
        }
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
