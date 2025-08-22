"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { debugStore } from "@/lib/debug-store"

export interface AutomationStep {
  id: string
  name: string
  status: "pending" | "in-progress" | "completed" | "error"
  message?: string
  timestamp?: string
  duration?: number
}

export interface AutomationProgress {
  leadId: string | null
  steps: AutomationStep[]
  isComplete: boolean
  error: string | null
  startTime: number
  lastEventTime: number
  sseReadyState: number
}

const WORKFLOW_STEPS = [
  { id: "lead-capture", name: "Lead Capture", description: "Processing incoming lead data" },
  { id: "data-enrichment", name: "Data Enrichment", description: "Enriching lead with additional data" },
  { id: "ai-qualification", name: "AI Qualification", description: "AI analyzing lead quality and intent" },
  { id: "crm-integration", name: "CRM Integration", description: "Adding lead to CRM system" },
  { id: "task-creation", name: "Task Creation", description: "Creating follow-up tasks" },
  { id: "notification", name: "Notification", description: "Sending notifications to team" },
  { id: "dashboard-update", name: "Dashboard Update", description: "Updating dashboard with new data" },
]

export function useAutomationProgress(leadId: string | null) {
  const [progress, setProgress] = useState<AutomationProgress>({
    leadId: null,
    steps: WORKFLOW_STEPS.map((step) => ({
      id: step.id,
      name: step.name,
      status: "pending" as const,
      message: step.description,
    })),
    isComplete: false,
    error: null,
    startTime: 0,
    lastEventTime: 0,
    sseReadyState: 0,
  })

  const [statusLog, setStatusLog] = useState<string[]>([])
  const [dashboardData, setDashboardData] = useState<any>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  // Step mapping for webhook events
  const mapStepId = useCallback((originalStep: string): string => {
    const stepMapping: Record<string, string> = {
      "ai-complete": "ai-qualification",
      "crm-complete": "crm-integration",
      "task-complete": "task-creation",
      "notification-complete": "notification",
      "dashboard-complete": "dashboard-update",
    }

    const mapped = stepMapping[originalStep] || originalStep
    debugStore.logEvent("STEP_MAPPING", {
      original: originalStep,
      mapped,
      available: Object.keys(stepMapping),
    })
    return mapped
  }, [])

  const updateStepStatus = useCallback(
    (stepId: string, status: AutomationStep["status"], message?: string) => {
      const mappedStepId = mapStepId(stepId)

      setProgress((prev) => {
        const stepExists = prev.steps.some((step) => step.id === mappedStepId)
        if (!stepExists) {
          debugStore.logEvent("STEP_NOT_FOUND", {
            stepId: mappedStepId,
            originalStepId: stepId,
            availableSteps: prev.steps.map((s) => s.id),
          })
          return prev
        }

        const updatedSteps = prev.steps.map((step) => {
          if (step.id === mappedStepId) {
            return {
              ...step,
              status,
              message: message || step.message,
              timestamp: new Date().toISOString(),
              duration: status === "completed" ? Date.now() - prev.startTime : undefined,
            }
          }
          return step
        })

        const completedCount = updatedSteps.filter((step) => step.status === "completed").length
        const isComplete = completedCount === updatedSteps.length

        debugStore.logEvent("STEP_STATUS_UPDATE", {
          stepId: mappedStepId,
          status,
          message,
          completedCount,
          totalSteps: updatedSteps.length,
          isComplete,
        })

        return {
          ...prev,
          steps: updatedSteps,
          isComplete,
          lastEventTime: Date.now(),
        }
      })

      // Add to status log
      setStatusLog((prev) => [
        ...prev,
        `${new Date().toLocaleTimeString()}: ${stepId} - ${status}${message ? ` (${message})` : ""}`,
      ])
    },
    [mapStepId],
  )

  const connectSSE = useCallback(() => {
    if (!leadId || eventSourceRef.current) return

    try {
      debugStore.logEvent("SSE_CONNECTING", { leadId, attempt: reconnectAttempts.current + 1 })

      const eventSource = new EventSource(`/api/events/${leadId}`)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        debugStore.logEvent("SSE_CONNECTED", { leadId })
        reconnectAttempts.current = 0
        setProgress((prev) => ({ ...prev, sseReadyState: eventSource.readyState }))
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          debugStore.logEvent("SSE_MESSAGE_RECEIVED", { leadId, data })

          if (data?.type === "status-update" && data?.payload) {
            const { step, status, message } = data.payload
            if (step && status) {
              updateStepStatus(step, status, message)
            }
          } else if (data?.type === "dashboard-data" && data?.payload) {
            debugStore.logEvent("DASHBOARD_DATA_RECEIVED", { leadId, payload: data.payload })
            setDashboardData(data.payload)
          } else if (data?.type === "error") {
            debugStore.logEvent("SSE_ERROR_MESSAGE", { leadId, error: data.message })
            setProgress((prev) => ({
              ...prev,
              error: data.message || "An error occurred",
            }))
          }
        } catch (parseError) {
          debugStore.logEvent("SSE_PARSE_ERROR", { leadId, error: parseError, rawData: event.data })
        }
      }

      eventSource.onerror = (error) => {
        debugStore.logEvent("SSE_ERROR", { leadId, error, readyState: eventSource.readyState })

        if (eventSource.readyState === EventSource.CLOSED) {
          eventSourceRef.current = null

          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000)

            debugStore.logEvent("SSE_RECONNECT_SCHEDULED", {
              leadId,
              attempt: reconnectAttempts.current,
              delay,
            })

            reconnectTimeoutRef.current = setTimeout(() => {
              connectSSE()
            }, delay)
          } else {
            debugStore.logEvent("SSE_MAX_RECONNECT_ATTEMPTS", { leadId })
            setProgress((prev) => ({
              ...prev,
              error: "Connection lost. Please refresh the page to retry.",
            }))
          }
        }

        setProgress((prev) => ({ ...prev, sseReadyState: eventSource.readyState }))
      }
    } catch (error) {
      debugStore.logEvent("SSE_CONNECTION_ERROR", { leadId, error })
      setProgress((prev) => ({ ...prev, error: "Failed to establish connection" }))
    }
  }, [leadId, updateStepStatus])

  const cleanup = useCallback(() => {
    debugStore.logEvent("AUTOMATION_CLEANUP", { leadId })

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    reconnectAttempts.current = 0

    setProgress({
      leadId: null,
      steps: WORKFLOW_STEPS.map((step) => ({
        id: step.id,
        name: step.name,
        status: "pending" as const,
        message: step.description,
      })),
      isComplete: false,
      error: null,
      startTime: 0,
      lastEventTime: 0,
      sseReadyState: 0,
    })

    setStatusLog([])
    setDashboardData(null)
  }, [leadId])

  // Connect when leadId changes
  useEffect(() => {
    if (leadId) {
      setProgress((prev) => ({
        ...prev,
        leadId,
        startTime: Date.now(),
        lastEventTime: Date.now(),
      }))
      connectSSE()
    } else {
      cleanup()
    }

    return cleanup
  }, [leadId, connectSSE, cleanup])

  // Debug info for monitoring
  const debugInfo = {
    sseReadyState: progress.sseReadyState,
    timeSinceStart: progress.startTime ? Date.now() - progress.startTime : 0,
    timeSinceLastEvent: progress.lastEventTime ? Date.now() - progress.lastEventTime : 0,
    reconnectAttempts: reconnectAttempts.current,
    hasEventSource: !!eventSourceRef.current,
  }

  return {
    statuses: progress.steps.reduce(
      (acc, step) => {
        acc[step.id] = step.status
        return acc
      },
      {} as Record<string, AutomationStep["status"]>,
    ),
    statusLog,
    dashboardData,
    isComplete: progress.isComplete,
    error: progress.error,
    debugInfo,
    cleanup,
  }
}
