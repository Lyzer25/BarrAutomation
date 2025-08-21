"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { AutomationStatus, StatusLogEntry } from "@/types/automation-types"

interface DebugInfo {
  sseReadyState: number
  timeSinceLastEvent: number
  timeSinceStart: number
  eventCount: number
  lastEventType: string
}

interface UseAutomationProgressReturn {
  statuses: Record<string, AutomationStatus>
  statusLog: StatusLogEntry[]
  dashboardData: any
  isComplete: boolean
  error: string | null
  debugInfo: DebugInfo
}

const workflowOrder = [
  "lead-received",
  "data-processing",
  "ai-qualification",
  "email-sent",
  "crm-complete",
  "discord-sent",
  "dashboard-complete",
]

// Step mapping for webhook events to UI steps
const stepMapping: Record<string, string> = {
  "ai-complete": "ai-qualification", // Map ai-complete webhook to ai-qualification UI step
}

export function useAutomationProgress(leadId: string | null): UseAutomationProgressReturn {
  const [statuses, setStatuses] = useState<Record<string, AutomationStatus>>({})
  const [statusLog, setStatusLog] = useState<StatusLogEntry[]>([])
  const [dashboardData, setDashboardData] = useState<any>(null)
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
  const isCompleteRef = useRef(false)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  // Cascading completion logic
  const applyCascadingCompletion = useCallback((newStatuses: Record<string, AutomationStatus>) => {
    console.log("🔄 Cascading completion check:", { newStatuses, workflowOrder })

    const cascadedStatuses = { ...newStatuses }

    // Find the furthest completed step
    let furthestCompleteIndex = -1
    for (let i = workflowOrder.length - 1; i >= 0; i--) {
      if (cascadedStatuses[workflowOrder[i]] === "complete") {
        furthestCompleteIndex = i
        break
      }
    }

    console.log("📊 Furthest complete index:", furthestCompleteIndex)

    // Auto-complete all steps before the furthest completed step
    if (furthestCompleteIndex > 0) {
      for (let i = 0; i < furthestCompleteIndex; i++) {
        const stepId = workflowOrder[i]
        if (cascadedStatuses[stepId] !== "complete") {
          console.log("✅ Auto-completing step:", stepId)
          cascadedStatuses[stepId] = "complete"
        }
      }
    }

    console.log("🎯 Cascaded statuses:", cascadedStatuses)
    return cascadedStatuses
  }, [])

  // Check if workflow is complete
  const checkWorkflowCompletion = useCallback((currentStatuses: Record<string, AutomationStatus>) => {
    const completedSteps = workflowOrder.filter((stepId) => currentStatuses[stepId] === "complete").length
    const isWorkflowComplete = completedSteps === workflowOrder.length

    console.log("🏁 Workflow completion check:", {
      completedSteps,
      totalSteps: workflowOrder.length,
      isWorkflowComplete,
      currentStatuses,
    })

    return isWorkflowComplete
  }, [])

  // Process SSE events
  const processEvent = useCallback(
    (event: MessageEvent) => {
      if (isCompleteRef.current) {
        console.log("⏹️ Ignoring event - workflow already complete")
        return
      }

      try {
        const data = JSON.parse(event.data)
        console.log("📨 SSE message received:", event.data)

        if (!data.type || !data.payload) {
          console.warn("⚠️ Invalid event format:", data)
          return
        }

        const { type, payload } = data
        console.log("🔄 Processing event type:", type, "for leadId:", payload.leadId)

        lastEventTimeRef.current = Date.now()

        setDebugInfo((prev) => ({
          ...prev,
          eventCount: prev.eventCount + 1,
          lastEventType: type,
          timeSinceLastEvent: 0,
        }))

        if (type === "status-update") {
          const { step: originalStep, status, timestamp, debug } = payload

          // Map step names if needed
          const step = stepMapping[originalStep] || originalStep

          if (originalStep !== step) {
            console.log("🔄 Mapping step:", originalStep, "->", step)
          }

          console.log("📊 Status update - Step:", step, "Status:", status)

          setStatuses((prevStatuses) => {
            console.log("🔄 Previous statuses:", prevStatuses)
            const newStatuses = { ...prevStatuses, [step]: status }
            console.log("🆕 New statuses before cascade:", newStatuses)

            const cascadedStatuses = applyCascadingCompletion(newStatuses)
            console.log("✨ Final cascaded statuses:", cascadedStatuses)

            return cascadedStatuses
          })

          // Add to status log with mapped step name
          const logMessage =
            originalStep !== step ? `${step} ${status} (mapped from ${originalStep})` : `${step} ${status}`

          setStatusLog((prev) => [
            ...prev,
            {
              step,
              status,
              message: logMessage,
              timestamp: timestamp || new Date().toISOString(),
              debug,
            },
          ])
        } else if (type === "dashboard-update") {
          console.log("🎯 DASHBOARD UPDATE RECEIVED:", payload)
          setDashboardData(payload)

          // Set dashboard-complete status
          setStatuses((prevStatuses) => {
            const newStatuses = { ...prevStatuses, "dashboard-complete": "complete" }
            console.log("🏁 Setting dashboard-complete status:", newStatuses)
            return newStatuses
          })
        }
      } catch (error) {
        console.error("❌ Error processing SSE event:", error)
        setError(`Event processing error: ${error}`)
      }
    },
    [applyCascadingCompletion],
  )

  // Create EventSource connection
  const createEventSource = useCallback(
    (leadId: string) => {
      if (isCompleteRef.current) {
        console.log("⏹️ Not creating EventSource - workflow already complete")
        return
      }

      console.log("🔌 Creating EventSource for leadId:", leadId)

      // Close existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }

      const eventSource = new EventSource(`/api/events/${leadId}`)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        console.log("✅ SSE connection opened successfully for leadId:", leadId)
        setError(null)
        reconnectAttempts.current = 0

        setDebugInfo((prev) => ({
          ...prev,
          sseReadyState: eventSource.readyState,
        }))
      }

      eventSource.onmessage = processEvent

      eventSource.onerror = (error) => {
        console.error("❌ SSE connection error:", error)
        setError("Connection lost. Attempting to reconnect...")

        setDebugInfo((prev) => ({
          ...prev,
          sseReadyState: eventSource.readyState,
        }))

        // Attempt reconnection with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts && !isCompleteRef.current) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000
          console.log(
            `🔄 Attempting reconnection ${reconnectAttempts.current + 1}/${maxReconnectAttempts} in ${delay}ms`,
          )

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++
            createEventSource(leadId)
          }, delay)
        } else {
          setError("Connection failed after multiple attempts")
        }
      }

      return eventSource
    },
    [processEvent],
  )

  // Update debug info periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setDebugInfo((prev) => ({
        ...prev,
        timeSinceLastEvent: now - lastEventTimeRef.current,
        timeSinceStart: now - startTimeRef.current,
        sseReadyState: eventSourceRef.current?.readyState || 0,
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Check for workflow completion
  useEffect(() => {
    console.log("📊 Statuses changed:", statuses)
    const completedSteps = Object.keys(statuses).filter(
      (stepId) => statuses[stepId] === "complete" && workflowOrder.includes(stepId),
    ).length
    console.log("✅ Completed steps:", `${completedSteps}/${workflowOrder.length}`)

    const workflowComplete = checkWorkflowCompletion(statuses)

    if (workflowComplete && !isCompleteRef.current) {
      console.log("🎉 Setting workflow as complete!")
      isCompleteRef.current = true
      setIsComplete(true)

      // Close EventSource after completion
      if (eventSourceRef.current) {
        console.log("🔌 Closing EventSource after dashboard completion")
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [statuses, checkWorkflowCompletion])

  // Main effect for leadId changes
  useEffect(() => {
    console.log("🏁 isComplete state changed:", isComplete)

    if (!leadId) {
      return
    }

    // Reset state for new leadId
    if (!isCompleteRef.current) {
      console.log("🚀 Starting automation for leadId:", leadId)
      setStatuses({})
      setStatusLog([])
      setDashboardData(null)
      setError(null)
      startTimeRef.current = Date.now()
      lastEventTimeRef.current = Date.now()

      createEventSource(leadId)
    }

    // Cleanup function
    return () => {
      if (!isCompleteRef.current) {
        console.log("🧹 Cleaning up automation for leadId:", leadId)
        if (eventSourceRef.current) {
          eventSourceRef.current.close()
          eventSourceRef.current = null
        }
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = null
        }
      }
    }
  }, [leadId, createEventSource])

  return {
    statuses,
    statusLog,
    dashboardData,
    isComplete,
    error,
    debugInfo,
  }
}
