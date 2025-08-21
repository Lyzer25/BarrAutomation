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
  const isCompleteRef = useRef(false)
  const maxReconnectAttempts = 5

  // Update the ref when isComplete changes
  useEffect(() => {
    isCompleteRef.current = isComplete
    console.log("🏁 isComplete state changed:", isComplete)
  }, [isComplete])

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
    setAnimationActive(false)
    reconnectAttempts.current = 0
    isCompleteRef.current = false
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

      console.log("🔄 Cascading completion check:", { newStatuses, workflowOrder })

      // Find the furthest completed step
      let furthestCompleteIndex = -1
      workflowOrder.forEach((stepId, index) => {
        if (newStatuses[stepId] === "complete") {
          furthestCompleteIndex = Math.max(furthestCompleteIndex, index)
        }
      })

      console.log("📊 Furthest complete index:", furthestCompleteIndex)

      // Auto-complete all steps before the furthest completed step
      if (furthestCompleteIndex > 0) {
        const cascadedStatuses = { ...newStatuses }
        let hasChanges = false

        for (let i = 0; i < furthestCompleteIndex; i++) {
          const stepId = workflowOrder[i]
          if (!cascadedStatuses[stepId] || cascadedStatuses[stepId] !== "complete") {
            cascadedStatuses[stepId] = "complete"
            hasChanges = true

            console.log("✅ Auto-completing step:", stepId)

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

        console.log("🎯 Cascaded statuses:", cascadedStatuses)
        return hasChanges ? cascadedStatuses : newStatuses
      }

      return newStatuses
    },
    [leadId],
  )

  // Check if workflow should be complete
  const checkWorkflowCompletion = useCallback((currentStatuses: Record<string, StatusUpdate["status"]>) => {
    const allSteps = [
      "lead-received",
      "data-processing",
      "ai-qualification",
      "email-sent",
      "crm-complete",
      "discord-sent",
      "dashboard-complete",
    ]

    const completedSteps = allSteps.filter((step) => currentStatuses[step] === "complete")
    const isWorkflowComplete = currentStatuses["dashboard-complete"] === "complete"

    console.log("🏁 Workflow completion check:", {
      completedSteps: completedSteps.length,
      totalSteps: allSteps.length,
      isWorkflowComplete,
      currentStatuses,
    })

    if (isWorkflowComplete && !isCompleteRef.current) {
      console.log("🎉 Setting workflow as complete!")
      setIsComplete(true)
    }

    return isWorkflowComplete
  }, [])

  const createEventSource = useCallback(() => {
    if (!leadId) return null

    // Prevent creating new connections if workflow is already complete
    if (isCompleteRef.current) {
      console.log("🛑 Workflow already complete, not creating new EventSource")
      return null
    }

    // Close existing connection if any
    if (eventSourceRef.current && eventSourceRef.current.readyState !== EventSource.CLOSED) {
      console.log("🔌 Closing existing EventSource connection")
      eventSourceRef.current.close()
    }

    console.log(`🔌 Creating EventSource for leadId: ${leadId}`)

    try {
      const eventSource = new EventSource(`/api/events/${leadId}`)
      eventSourceRef.current = eventSource

      eventSource.onopen = (event) => {
        console.log("✅ SSE connection opened successfully for leadId:", leadId)
        reconnectAttempts.current = 0
        setError(null)

        debugStore.logEvent("SSE_CONNECTION_OPENED", {
          leadId,
          timestamp: new Date().toISOString(),
          readyState: eventSource.readyState,
        })
      }

      eventSource.onmessage = (event) => {
        // Don't process messages if workflow is complete
        if (isCompleteRef.current) {
          console.log("🛑 Ignoring message - workflow already complete")
          return
        }

        const eventTime = Date.now()
        lastEventTimeRef.current = eventTime

        console.log("📨 SSE message received:", event.data)

        debugStore.logEvent("SSE_EVENT_RECEIVED", {
          leadId,
          eventData: event.data,
          timeSinceStart: eventTime - (startTimeRef.current || 0),
          timestamp: new Date().toISOString(),
        })

        try {
          const update = JSON.parse(event.data)
          console.log("🔄 Processing event type:", update.type, "for leadId:", leadId)

          if (update.type === "status-update") {
            const { step, status, message } = update.payload
            console.log(`📊 Status update - Step: ${step}, Status: ${status}`)

            // Filter out steps that aren't in our expected workflow
            const expectedSteps = [
              "lead-received",
              "data-processing",
              "ai-qualification",
              "email-sent",
              "crm-complete",
              "discord-sent",
              "dashboard-complete",
            ]

            if (!expectedSteps.includes(step)) {
              console.log(`⚠️ Ignoring unexpected step: ${step}`)
              return
            }

            debugStore.logEvent("STATUS_UPDATE_PROCESSED", {
              step,
              status,
              message,
              leadId,
            })

            // Update statuses with cascading completion
            setStatuses((prev: Record<string, StatusUpdate["status"]>) => {
              console.log("🔄 Previous statuses:", prev)
              const newStatuses = { ...prev, [step]: status }
              console.log("🆕 New statuses before cascade:", newStatuses)

              const cascadedStatuses = cascadeCompletion(newStatuses)
              console.log("✨ Final cascaded statuses:", cascadedStatuses)

              // Check for completion after state update
              setTimeout(() => {
                checkWorkflowCompletion(cascadedStatuses)
              }, 100)

              return cascadedStatuses
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
          } else if (update.type === "dashboard-update") {
            console.log("🎯 DASHBOARD UPDATE RECEIVED:", update.payload)

            debugStore.logEvent("DASHBOARD_UPDATE_PROCESSED", {
              dashboardData: update.payload,
              leadId,
            })

            setDashboardData(update.payload)

            // Ensure dashboard-complete status is set
            setStatuses((prev) => {
              const newStatuses = { ...prev, "dashboard-complete": "complete" }
              console.log("🏁 Setting dashboard-complete status:", newStatuses)

              // Check completion after setting dashboard status
              setTimeout(() => {
                checkWorkflowCompletion(newStatuses)
              }, 100)

              return newStatuses
            })

            const logEntry = {
              timestamp: new Date().toISOString(),
              step: "dashboard-complete",
              status: "complete" as StatusUpdate["status"],
              message: "Dashboard received. Workflow complete.",
            }
            setStatusLog((prev) => [...prev, logEntry])

            // Close the connection after dashboard update
            setTimeout(() => {
              if (eventSourceRef.current && eventSourceRef.current.readyState !== EventSource.CLOSED) {
                console.log("🔌 Closing EventSource after dashboard completion")
                eventSourceRef.current.close()
              }
            }, 1000)
          } else if (update.type === "error") {
            console.error("❌ Error event received:", update.payload.message)

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
            console.warn("⚠️ Unknown event type:", update.type, "for leadId:", leadId)
            debugStore.logEvent("UNKNOWN_EVENT_TYPE", {
              eventType: update.type,
              eventData: update,
              leadId,
            })
          }
        } catch (err) {
          console.error("❌ Failed to parse SSE event:", err, "Raw data:", event.data)
          debugStore.logEvent("SSE_PARSE_ERROR", {
            error: err instanceof Error ? err.message : "Unknown error",
            eventData: event.data,
            leadId,
          })
        }
      }

      eventSource.onerror = (event) => {
        console.log("❌ SSE error occurred, readyState:", eventSource.readyState)

        debugStore.logEvent("SSE_CONNECTION_ERROR", {
          readyState: eventSource.readyState,
          url: eventSource.url,
          leadId,
          timestamp: new Date().toISOString(),
          reconnectAttempts: reconnectAttempts.current,
        })

        if (eventSource.readyState === EventSource.CLOSED) {
          console.log("🔄 SSE connection closed")

          // Don't reconnect if workflow is complete
          if (isCompleteRef.current) {
            console.log("🛑 Workflow complete, not reconnecting")
            return
          }

          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++

            debugStore.logEvent("SSE_RECONNECT_ATTEMPT", {
              attempt: reconnectAttempts.current,
              maxAttempts: maxReconnectAttempts,
              leadId,
            })

            // Exponential backoff: 1s, 2s, 4s, 8s, 16s
            const delay = Math.pow(2, reconnectAttempts.current - 1) * 1000

            setTimeout(() => {
              if (!isCompleteRef.current) {
                console.log(`🔄 Reconnecting SSE (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})...`)
                createEventSource()
              }
            }, delay)
          } else {
            console.log("🛑 Max reconnection attempts reached")
            if (!isCompleteRef.current) {
              setError("Connection lost after multiple attempts. Please refresh the page.")
              debugStore.logEvent("SSE_CONNECTION_FAILED_FINAL", { leadId })
            }
          }
        } else if (eventSource.readyState === EventSource.CONNECTING) {
          console.log("🔄 SSE attempting to reconnect...")
          debugStore.logEvent("SSE_RECONNECTING", { leadId })
        }
      }

      return eventSource
    } catch (err) {
      console.error("❌ Failed to create EventSource:", err)
      debugStore.logEvent("SSE_CREATION_ERROR", {
        error: err instanceof Error ? err.message : "Unknown error",
        leadId,
      })
      setError("Failed to establish connection. Please try refreshing the page.")
      return null
    }
  }, [leadId, cascadeCompletion, checkWorkflowCompletion])

  // Main effect - only depends on leadId, not isComplete
  useEffect(() => {
    if (!leadId) {
      resetState()
      return
    }

    console.log("🚀 Starting automation for leadId:", leadId)
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
      console.log("🔧 Force dashboard triggered")
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
      console.log("🔧 Demo reset triggered")
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
        console.log("🔧 SSE Connection Test:", {
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
      console.log("🧹 Cleaning up automation for leadId:", leadId)
      if (eventSourceRef.current && eventSourceRef.current.readyState !== EventSource.CLOSED) {
        eventSourceRef.current.close()
        debugStore.logEvent("SSE_CONNECTION_CLOSED_CLEANUP", { leadId })
      }

      window.removeEventListener("force-dashboard", handleForceDashboard)
      window.removeEventListener("reset-demo", handleResetDemo)
      window.removeEventListener("test-sse-connection", handleTestSSE)
    }
  }, [leadId, resetState, createEventSource]) // Removed isComplete from dependencies

  // Debug effect to monitor statuses changes
  useEffect(() => {
    console.log("📊 Statuses changed:", statuses)
    const completedCount = Object.values(statuses).filter((status) => status === "complete").length
    console.log(`✅ Completed steps: ${completedCount}/7`)
  }, [statuses])

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
