"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { debugStore } from "@/lib/debug-store"
import type { StatusUpdate, DashboardData } from "@/types/automation-types"

export const useAutomationProgress = (leadId: string | null) => {
  const [statuses, setStatuses] = useState<Record<string, StatusUpdate["status"]>>({})
  const [statusLog, setStatusLog] = useState<
    Array<{
      timestamp: string
      step: string
      status: StatusUpdate["status"]
      message: string
    }>
  >([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [animationActive, setAnimationActive] = useState(false)

  // Refs for cleanup and debugging
  const eventSourceRef = useRef<EventSource | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const lastEventTimeRef = useRef<number | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const resetState = useCallback(() => {
    debugStore.logEvent("AUTOMATION_STATE_RESET", {
      leadId,
      timestamp: new Date().toISOString(),
    })

    setStatuses({})
    setStatusLog([])
    setDashboardData(null)
    setIsComplete(false)
    setError(null)
    reconnectAttempts.current = 0
  }, [leadId])

  // Cascading completion function
  const cascadeCompletion = useCallback(
    (newStatuses: Record<string, StatusUpdate["status"]>) => {
      const workflowOrder = [
        "lead-received",
        "data-processing",
        "ai-qualification",
        "email-sent",
        "crm-complete",
        "discord-sent",
        "dashboard-complete",
      ]

      // Find the furthest completed step
      let furthestCompleteIndex = -1
      workflowOrder.forEach((stepId, index) => {
        if (newStatuses[stepId] === "complete") {
          furthestCompleteIndex = Math.max(furthestCompleteIndex, index)
        }
      })

      // Auto-complete all steps before the furthest completed step
      if (furthestCompleteIndex > 0) {
        const cascadedStatuses = { ...newStatuses }
        let hasChanges = false

        for (let i = 0; i < furthestCompleteIndex; i++) {
          const stepId = workflowOrder[i]
          if (!cascadedStatuses[stepId] || cascadedStatuses[stepId] !== "complete") {
            cascadedStatuses[stepId] = "complete"
            hasChanges = true

            // Add cascaded completion to status log
            setStatusLog((prev) => [
              ...prev,
              {
                timestamp: new Date().toISOString(),
                step: stepId,
                status: "complete",
                message: `Auto-completed (cascaded from ${workflowOrder[furthestCompleteIndex]})`,
              },
            ])

            debugStore.logEvent("AUTO_COMPLETED_STEP", {
              stepId,
              triggeredBy: workflowOrder[furthestCompleteIndex],
              leadId,
              timestamp: new Date().toISOString(),
            })
          }
        }

        if (hasChanges) {
          return cascadedStatuses
        }
      }

      return newStatuses
    },
    [leadId],
  )

  const createEventSource = useCallback(() => {
    if (!leadId) return null

    console.log(`Creating EventSource for leadId: ${leadId}`)

    try {
      const eventSource = new EventSource(`/api/events/${leadId}`)
      eventSourceRef.current = eventSource

      eventSource.onopen = (event) => {
        console.log("SSE connection opened successfully for leadId:", leadId)
        reconnectAttempts.current = 0
        setError(null) // Clear any previous errors

        debugStore.logEvent("SSE_CONNECTION_OPENED", {
          leadId,
          timestamp: new Date().toISOString(),
          readyState: eventSource.readyState,
        })
      }

      eventSource.onmessage = (event) => {
        const eventTime = Date.now()
        lastEventTimeRef.current = eventTime

        console.log("SSE message received:", event.data)

        debugStore.logEvent("SSE_EVENT_RECEIVED", {
          leadId,
          eventData: event.data,
          timeSinceStart: eventTime - (startTimeRef.current || 0),
          timestamp: new Date().toISOString(),
        })

        try {
          const update = JSON.parse(event.data)
          console.log("Processing event type:", update.type, "for leadId:", leadId)

          if (update.type === "status-update") {
            const { step, status, message } = update.payload
            console.log(`Status update - Step: ${step}, Status: ${status}`)

            debugStore.logEvent("STATUS_UPDATE_PROCESSED", {
              step,
              status,
              message,
              leadId,
            })

            // Update statuses with cascading completion
            setStatuses((prev: Record<string, StatusUpdate["status"]>) => {
              const newStatuses = { ...prev, [step]: status }
              return cascadeCompletion(newStatuses)
            })

            // Add to status log with proper timestamp
            const logEntry = {
              timestamp: new Date().toISOString(),
              step,
              status,
              message: message || `${step} ${status}`,
            }
            setStatusLog((prev) => [...prev, logEntry])

            // Animation for Lead Capture
            if (step === "lead-received") {
              setAnimationActive(true)
            }

            // Check if workflow is complete
            if (step === "dashboard-complete" && status === "complete") {
              setIsComplete(true)
            }
          } else if (update.type === "dashboard-update") {
            console.log("🎯 DASHBOARD UPDATE RECEIVED:", update.payload)

            debugStore.logEvent("DASHBOARD_UPDATE_PROCESSED", {
              dashboardData: update.payload,
              leadId,
            })

            setDashboardData(update.payload)
            setIsComplete(true)

            const logEntry = {
              timestamp: new Date().toISOString(),
              step: "dashboard-complete",
              status: "complete" as StatusUpdate["status"],
              message: "Dashboard received. Workflow complete.",
            }
            setStatusLog((prev) => [...prev, logEntry])
          } else if (update.type === "error") {
            debugStore.logEvent("ERROR_EVENT_RECEIVED", {
              error: update.payload.message,
              leadId,
            })

            setError(update.payload.message)

            const logEntry = {
              timestamp: new Date().toISOString(),
              step: "error",
              status: "error" as StatusUpdate["status"],
              message: `ERROR - ${update.payload.message}`,
            }
            setStatusLog((prev) => [...prev, logEntry])
          } else {
            console.warn("Unknown event type:", update.type, "for leadId:", leadId)
            debugStore.logEvent("UNKNOWN_EVENT_TYPE", {
              eventType: update.type,
              eventData: update,
              leadId,
            })
          }
        } catch (err) {
          console.error("Failed to parse SSE event:", err, "Raw data:", event.data)
          debugStore.logEvent("SSE_PARSE_ERROR", {
            error: err instanceof Error ? err.message : "Unknown error",
            eventData: event.data,
            leadId,
          })
        }
      }

      eventSource.onerror = (event) => {
        console.log("SSE error occurred, readyState:", eventSource.readyState)

        debugStore.logEvent("SSE_CONNECTION_ERROR", {
          readyState: eventSource.readyState,
          url: eventSource.url,
          leadId,
          timestamp: new Date().toISOString(),
          reconnectAttempts: reconnectAttempts.current,
        })

        if (eventSource.readyState === EventSource.CLOSED) {
          console.log("SSE connection closed, attempting reconnect...")

          if (reconnectAttempts.current < maxReconnectAttempts && !isComplete) {
            reconnectAttempts.current++

            debugStore.logEvent("SSE_RECONNECT_ATTEMPT", {
              attempt: reconnectAttempts.current,
              maxAttempts: maxReconnectAttempts,
              leadId,
            })

            // Exponential backoff: 1s, 2s, 4s, 8s, 16s
            const delay = Math.pow(2, reconnectAttempts.current - 1) * 1000

            setTimeout(() => {
              if (!isComplete) {
                console.log(`Reconnecting SSE (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})...`)
                createEventSource()
              }
            }, delay)
          } else {
            console.log("Max reconnection attempts reached or workflow complete")
            if (!isComplete) {
              setError("Connection lost after multiple attempts. Please refresh the page.")
              debugStore.logEvent("SSE_CONNECTION_FAILED_FINAL", { leadId })
            }
          }
        } else if (eventSource.readyState === EventSource.CONNECTING) {
          console.log("SSE attempting to reconnect...")
          debugStore.logEvent("SSE_RECONNECTING", { leadId })
        }
      }

      return eventSource
    } catch (err) {
      console.error("Failed to create EventSource:", err)
      debugStore.logEvent("SSE_CREATION_ERROR", {
        error: err instanceof Error ? err.message : "Unknown error",
        leadId,
      })
      setError("Failed to establish connection. Please try refreshing the page.")
      return null
    }
  }, [leadId, cascadeCompletion, isComplete])

  useEffect(() => {
    if (!leadId) {
      resetState()
      return
    }

    resetState()
    startTimeRef.current = Date.now()
    lastEventTimeRef.current = Date.now()

    debugStore.logEvent("AUTOMATION_STARTED", {
      leadId,
      startTime: startTimeRef.current,
      timestamp: new Date().toISOString(),
    })

    const initialLogEntry = {
      timestamp: new Date().toISOString(),
      step: "workflow-started",
      status: "processing" as StatusUpdate["status"],
      message: `Workflow started for lead: ${leadId}`,
    }
    setStatusLog([initialLogEntry])

    // Create the initial EventSource connection
    const eventSource = createEventSource()

    // Listen for debug commands
    const handleForceDashboard = () => {
      debugStore.logEvent("FORCE_DASHBOARD_RECOVERY", { leadId })
      setError(null)
      setIsComplete(true)
      setDashboardData({
        leadScore: 85,
        category: "High Priority",
        leadData: { name: "Test Lead", email: "test@example.com", phone: "", message: "Forced dashboard test" },
        metrics: { responseTime: "2.3s", conversionProbability: "78%" },
        processingTime: "45s",
        emailContent: { subject: "Test Email", body: "Test content" },
        discordMessage: { title: "Test Alert", description: "Test notification", fields: [] },
        integrations: ["OpenAI", "Gmail", "Discord"],
      })
    }

    const handleResetDemo = () => {
      debugStore.logEvent("DEMO_RESET_TRIGGERED", { leadId })
      if (eventSourceRef.current && eventSourceRef.current.readyState !== EventSource.CLOSED) {
        eventSourceRef.current.close()
      }
      resetState()
    }

    const handleTestSSE = () => {
      if (eventSourceRef.current) {
        debugStore.logEvent("SSE_CONNECTION_TEST", {
          readyState: eventSourceRef.current.readyState,
          url: eventSourceRef.current.url,
          leadId,
        })
        console.log("SSE Connection Test:", {
          readyState: eventSourceRef.current.readyState,
          url: eventSourceRef.current.url,
          leadId,
        })
      }
    }

    window.addEventListener("force-dashboard", handleForceDashboard)
    window.addEventListener("reset-demo", handleResetDemo)
    window.addEventListener("test-sse-connection", handleTestSSE)

    return () => {
      if (eventSourceRef.current && eventSourceRef.current.readyState !== EventSource.CLOSED) {
        eventSourceRef.current.close()
        debugStore.logEvent("SSE_CONNECTION_CLOSED_CLEANUP", { leadId })
      }

      window.removeEventListener("force-dashboard", handleForceDashboard)
      window.removeEventListener("reset-demo", handleResetDemo)
      window.removeEventListener("test-sse-connection", handleTestSSE)
    }
  }, [leadId, resetState, createEventSource])

  return {
    statuses,
    statusLog,
    dashboardData,
    isComplete,
    error,
    animationActive,
    debugInfo: {
      startTime: startTimeRef.current,
      lastEventTime: lastEventTimeRef.current,
      sseReadyState: eventSourceRef.current?.readyState,
      timeSinceStart: startTimeRef.current ? Date.now() - startTimeRef.current : 0,
      timeSinceLastEvent: lastEventTimeRef.current ? Date.now() - lastEventTimeRef.current : 0,
      reconnectAttempts: reconnectAttempts.current,
    },
  }
}
