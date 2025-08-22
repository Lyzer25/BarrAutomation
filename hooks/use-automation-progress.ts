"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { AutomationStatus, DashboardData } from "@/types/automation-types"

const WORKFLOW_ORDER = [
  "lead-received",
  "data-processing",
  "ai-qualification",
  "email-sent",
  "crm-complete",
  "discord-sent",
  "dashboard-complete",
]

// Step mapping for webhook events to UI steps
const STEP_MAPPING: Record<string, string> = {
  "ai-complete": "ai-qualification", // Map ai-complete webhook to ai-qualification UI step
}

export function useAutomationProgress() {
  const [statuses, setStatuses] = useState<Record<string, AutomationStatus>>({})
  const [activityLog, setActivityLog] = useState<
    Array<{
      id: string
      message: string
      timestamp: Date
      status: "success" | "processing" | "error"
    }>
  >([])
  const [isComplete, setIsComplete] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [leadId, setLeadId] = useState<string | null>(null)

  const eventSourceRef = useRef<EventSource | null>(null)
  const isCompleteRef = useRef(false)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  // Enhanced logging for debugging
  useEffect(() => {
    console.log("🏁 isComplete state changed:", isComplete)
    isCompleteRef.current = isComplete
  }, [isComplete])

  useEffect(() => {
    console.log("📊 Statuses changed:", statuses)
    const completedSteps = Object.values(statuses).filter((status) => status === "complete").length
    console.log(`✅ Completed steps: ${completedSteps}/${WORKFLOW_ORDER.length}`)
  }, [statuses])

  const addToActivityLog = useCallback((message: string, status: "success" | "processing" | "error" = "success") => {
    const logEntry = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      status,
    }
    setActivityLog((prev) => [...prev, logEntry])
  }, [])

  const cascadeCompletion = useCallback(
    (newStatuses: Record<string, AutomationStatus>) => {
      console.log("🔄 Cascading completion check:", { newStatuses, workflowOrder: WORKFLOW_ORDER })

      // Find the furthest complete step in the workflow order
      let furthestCompleteIndex = -1
      for (let i = WORKFLOW_ORDER.length - 1; i >= 0; i--) {
        const step = WORKFLOW_ORDER[i]
        if (newStatuses[step] === "complete") {
          furthestCompleteIndex = i
          break
        }
      }

      console.log("📊 Furthest complete index:", furthestCompleteIndex)

      // Auto-complete all previous steps
      const cascadedStatuses = { ...newStatuses }
      for (let i = 0; i <= furthestCompleteIndex; i++) {
        const step = WORKFLOW_ORDER[i]
        if (!cascadedStatuses[step] || cascadedStatuses[step] !== "complete") {
          console.log("✅ Auto-completing step:", step)
          cascadedStatuses[step] = "complete"
          addToActivityLog(`Auto-completed (cascaded from ${WORKFLOW_ORDER[furthestCompleteIndex]})`, "success")
        }
      }

      console.log("🎯 Cascaded statuses:", cascadedStatuses)
      return cascadedStatuses
    },
    [addToActivityLog],
  )

  const checkWorkflowCompletion = useCallback(
    (currentStatuses: Record<string, AutomationStatus>) => {
      const completedSteps = WORKFLOW_ORDER.filter((step) => currentStatuses[step] === "complete").length
      const isWorkflowComplete = completedSteps === WORKFLOW_ORDER.length

      console.log("🏁 Workflow completion check:", {
        completedSteps: completedSteps - 1, // Subtract 1 for display purposes
        totalSteps: WORKFLOW_ORDER.length,
        isWorkflowComplete,
        currentStatuses,
      })

      if (isWorkflowComplete && !isCompleteRef.current) {
        console.log("🎉 Setting workflow as complete!")
        setIsComplete(true)
        addToActivityLog("Workflow completed successfully!", "success")
      }
    },
    [addToActivityLog],
  )

  const processEvent = useCallback(
    (event: MessageEvent) => {
      if (isCompleteRef.current) {
        console.log("⏹️ Ignoring event - workflow already complete")
        return
      }

      try {
        const data = JSON.parse(event.data)
        console.log("📨 SSE message received:", event.data)

        if (!leadId) {
          console.log("⚠️ No leadId set, ignoring event")
          return
        }

        console.log("🔄 Processing event type:", data.type, "for leadId:", leadId)

        if (data.type === "status-update") {
          const { step: originalStep, status, timestamp, debug } = data.payload

          // Apply step mapping if needed
          const step = STEP_MAPPING[originalStep] || originalStep

          if (originalStep !== step) {
            console.log("🔄 Mapping step:", originalStep, "→", step)
            addToActivityLog(
              `${step} ${status} (mapped from ${originalStep})`,
              status === "complete" ? "success" : "processing",
            )
          }

          console.log("📊 Status update - Step:", step, "Status:", status)

          // Filter out steps that aren't in our workflow
          if (!WORKFLOW_ORDER.includes(step)) {
            console.log("⚠️ Ignoring unexpected step:", step)
            return
          }

          setStatuses((prevStatuses) => {
            console.log("🔄 Previous statuses:", prevStatuses)
            const newStatuses = { ...prevStatuses, [step]: status }
            console.log("🆕 New statuses before cascade:", newStatuses)

            const cascadedStatuses = cascadeCompletion(newStatuses)
            console.log("✨ Final cascaded statuses:", cascadedStatuses)

            // Add to activity log for completed steps
            Object.keys(cascadedStatuses).forEach((stepKey) => {
              if (cascadedStatuses[stepKey] === "complete" && prevStatuses[stepKey] !== "complete") {
                console.log("✅ Step completed during workflow:", stepKey)
              }
            })

            // Check for workflow completion after a brief delay to ensure state updates
            setTimeout(() => checkWorkflowCompletion(cascadedStatuses), 100)

            return cascadedStatuses
          })
        } else if (data.type === "dashboard-update") {
          console.log("🎯 DASHBOARD UPDATE RECEIVED:", data.payload)
          setDashboardData(data.payload)

          // Set dashboard-complete status
          setStatuses((prevStatuses) => {
            const newStatuses = { ...prevStatuses, "dashboard-complete": "complete" }
            console.log("🏁 Setting dashboard-complete status:", newStatuses)

            const cascadedStatuses = cascadeCompletion(newStatuses)

            // Check for workflow completion
            setTimeout(() => checkWorkflowCompletion(cascadedStatuses), 100)

            return cascadedStatuses
          })
        }
      } catch (error) {
        console.error("❌ Error processing SSE event:", error)
        addToActivityLog("Error processing automation event", "error")
      }
    },
    [leadId, cascadeCompletion, checkWorkflowCompletion, addToActivityLog],
  )

  const createEventSource = useCallback(
    (currentLeadId: string) => {
      if (isCompleteRef.current) {
        console.log("⏹️ Not creating EventSource - workflow already complete")
        return
      }

      // Close existing connection
      if (eventSourceRef.current) {
        console.log("🔌 Closing existing EventSource")
        eventSourceRef.current.close()
      }

      console.log("🔌 Creating EventSource for leadId:", currentLeadId)
      const eventSource = new EventSource(`/api/events/${currentLeadId}`)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        console.log("✅ SSE connection opened successfully for leadId:", currentLeadId)
        reconnectAttempts.current = 0
      }

      eventSource.onmessage = processEvent

      eventSource.onerror = (error) => {
        console.error("❌ SSE connection error:", error)

        if (!isCompleteRef.current && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000
          console.log(
            `🔄 Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`,
          )

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++
            createEventSource(currentLeadId)
          }, delay)
        }
      }
    },
    [processEvent],
  )

  const startAutomation = useCallback(
    (newLeadId: string) => {
      console.log("🚀 Starting automation for leadId:", newLeadId)
      setLeadId(newLeadId)
      setStatuses({})
      setActivityLog([])
      setIsComplete(false)
      setDashboardData(null)

      addToActivityLog(`Workflow started for lead: ${newLeadId}`, "processing")
      createEventSource(newLeadId)
    },
    [addToActivityLog, createEventSource],
  )

  const cleanup = useCallback(() => {
    console.log("🧹 Cleaning up automation for leadId:", leadId)

    if (eventSourceRef.current) {
      console.log("🔌 Closing EventSource after dashboard completion")
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [leadId])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  // Auto-close connection when workflow completes
  useEffect(() => {
    if (isComplete) {
      cleanup()
    }
  }, [isComplete, cleanup])

  return {
    statuses,
    activityLog,
    isComplete,
    dashboardData,
    leadId,
    startAutomation,
    cleanup,
  }
}
