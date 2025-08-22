"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { debugStore } from "@/lib/debug-store"

export interface AutomationStep {
  id: string
  name: string
  status: "not-started" | "in-progress" | "done" | "error"
  message?: string
  timestamp?: string
}

export interface AutomationProgress {
  leadId: string | null
  steps: AutomationStep[]
  isComplete: boolean
  error?: string
}

export interface AutomationStatus {
  step: string
  status: "not-started" | "in-progress" | "done" | "error"
  message: string
  timestamp: string
}

export interface StatusLogEntry {
  timestamp: string
  step: string
  status: string
  message: string
  details?: any
}

export interface DashboardData {
  leadId: string
  leadInfo?: {
    name?: string
    email?: string
    company?: string
    phone?: string
    source?: string
    score?: number
    status?: string
    tags?: string[]
    notes?: string
    lastContact?: string
    nextFollowUp?: string
  }
  metrics?: {
    responseTime?: number
    engagementScore?: number
    conversionProbability?: number
    dealValue?: number
    timeToClose?: number
    touchpoints?: number
  }
  timeline?: Array<{
    timestamp: string
    event: string
    details: string
    type: "info" | "success" | "warning" | "error"
  }>
  aiInsights?: {
    summary?: string
    recommendations?: string[]
    riskFactors?: string[]
    opportunities?: string[]
    nextBestAction?: string
  }
  integrationData?: {
    [key: string]: any
  }
}

export interface DebugInfo {
  sseReadyState: number
  timeSinceLastEvent: number
  timeSinceStart: number
  eventCount: number
  lastEventType: string
  connectionAttempts: number
}

const INITIAL_STEPS: AutomationStep[] = [
  { id: "webhook-received", name: "Webhook Received", status: "not-started" },
  { id: "lead-parsed", name: "Lead Data Parsed", status: "not-started" },
  { id: "ai-qualification", name: "AI Lead Qualification", status: "not-started" },
  { id: "crm-lookup", name: "CRM Contact Lookup", status: "not-started" },
  { id: "crm-update", name: "CRM Update", status: "not-started" },
  { id: "notification-sent", name: "Notification Sent", status: "not-started" },
  { id: "automation-complete", name: "Automation Complete", status: "not-started" },
]

const WORKFLOW_STEPS = [
  "lead-capture",
  "data-enrichment",
  "ai-qualification",
  "crm-sync",
  "email-sequence",
  "task-creation",
  "notification-sent",
]

// Map webhook events to workflow steps
const STEP_MAPPING: { [key: string]: string } = {
  "ai-complete": "ai-qualification",
  "enrichment-complete": "data-enrichment",
  "crm-complete": "crm-sync",
  "email-complete": "email-sequence",
  "task-complete": "task-creation",
  "notification-complete": "notification-sent",
}

export function useAutomationProgress(leadId: string | null) {
  const [progress, setProgress] = useState<AutomationProgress>({
    leadId: null,
    steps: INITIAL_STEPS,
    isComplete: false,
  })

  const [statuses, setStatuses] = useState<{ [key: string]: AutomationStatus }>({})
  const [statusLog, setStatusLog] = useState<StatusLogEntry[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    sseReadyState: 0,
    timeSinceLastEvent: 0,
    timeSinceStart: 0,
    eventCount: 0,
    lastEventType: "",
    connectionAttempts: 0,
  })

  const eventSourceRef = useRef<EventSource | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const lastEventTimeRef = useRef<number>(Date.now())
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const connectionAttemptsRef = useRef<number>(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = 2000

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

    connectionAttemptsRef.current = 0
  }, [leadId])

  const initializeStatuses = useCallback(() => {
    const initialStatuses: { [key: string]: AutomationStatus } = {}
    WORKFLOW_STEPS.forEach((step) => {
      initialStatuses[step] = {
        step,
        status: "not-started",
        message: getStepMessage(step, "not-started"),
        timestamp: new Date().toISOString(),
      }
    })
    setStatuses(initialStatuses)
    debugStore.logEvent("WORKFLOW_INITIALIZED", { steps: WORKFLOW_STEPS, leadId })
  }, [leadId])

  // Get step message based on status
  function getStepMessage(step: string, status: string): string {
    const messages: { [key: string]: { [key: string]: string } } = {
      "lead-capture": {
        "not-started": "Waiting to capture lead data",
        "in-progress": "Capturing lead information...",
        done: "Lead data captured successfully",
        error: "Failed to capture lead data",
      },
      "data-enrichment": {
        "not-started": "Waiting for data enrichment",
        "in-progress": "Enriching lead data with external sources...",
        done: "Lead data enriched successfully",
        error: "Failed to enrich lead data",
      },
      "ai-qualification": {
        "not-started": "Waiting for AI analysis",
        "in-progress": "AI analyzing lead quality and fit...",
        done: "AI qualification completed",
        error: "AI qualification failed",
      },
      "crm-sync": {
        "not-started": "Waiting for CRM sync",
        "in-progress": "Syncing lead to CRM system...",
        done: "Lead synced to CRM successfully",
        error: "Failed to sync lead to CRM",
      },
      "email-sequence": {
        "not-started": "Waiting to start email sequence",
        "in-progress": "Sending personalized email sequence...",
        done: "Email sequence initiated successfully",
        error: "Failed to start email sequence",
      },
      "task-creation": {
        "not-started": "Waiting to create follow-up tasks",
        "in-progress": "Creating follow-up tasks...",
        done: "Follow-up tasks created successfully",
        error: "Failed to create follow-up tasks",
      },
      "notification-sent": {
        "not-started": "Waiting to send notifications",
        "in-progress": "Sending team notifications...",
        done: "Team notifications sent successfully",
        error: "Failed to send notifications",
      },
    }

    return messages[step]?.[status] || `${step} - ${status}`
  }

  // Update debug info periodically
  useEffect(() => {
    if (!leadId) return

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
  }, [leadId])

  // Connect to SSE with enhanced error handling and reconnection
  const connectSSE = useCallback(() => {
    if (!leadId || eventSourceRef.current) return

    try {
      connectionAttemptsRef.current += 1
      debugStore.logEvent("SSE_CONNECTION_ATTEMPT", {
        leadId,
        attempt: connectionAttemptsRef.current,
        url: `/api/events/${leadId}`,
      })

      const eventSource = new EventSource(`/api/events/${leadId}`)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        debugStore.logEvent("SSE_CONNECTION_OPENED", { leadId })
        setError(null)
        connectionAttemptsRef.current = 0 // Reset on successful connection

        setDebugInfo((prev) => ({
          ...prev,
          sseReadyState: eventSource.readyState,
          connectionAttempts: connectionAttemptsRef.current,
        }))
      }

      eventSource.onmessage = (event) => {
        lastEventTimeRef.current = Date.now()

        try {
          const data = JSON.parse(event.data)
          debugStore.logEvent("SSE_MESSAGE_RECEIVED", { leadId, data })

          setDebugInfo((prev) => ({
            ...prev,
            eventCount: prev.eventCount + 1,
            lastEventType: data.type || "unknown",
            timeSinceLastEvent: 0,
          }))

          if (data.type === "status-update") {
            handleStatusUpdate(data.payload)
          } else if (data.type === "dashboard-data") {
            handleDashboardData(data.payload)
          } else if (data.type === "error") {
            handleError(data.payload)
          }
        } catch (parseError) {
          debugStore.logEvent("SSE_PARSE_ERROR", { leadId, error: parseError, rawData: event.data })
          console.error("Failed to parse SSE message:", parseError)
        }
      }

      eventSource.onerror = (error) => {
        debugStore.logEvent("SSE_CONNECTION_ERROR", { leadId, error, readyState: eventSource.readyState })

        if (eventSource.readyState === EventSource.CLOSED) {
          setError("Connection lost. Attempting to reconnect...")

          // Attempt reconnection if we haven't exceeded max attempts
          if (connectionAttemptsRef.current < maxReconnectAttempts) {
            reconnectTimeoutRef.current = setTimeout(() => {
              eventSourceRef.current = null
              connectSSE()
            }, reconnectDelay * connectionAttemptsRef.current) // Exponential backoff
          } else {
            setError("Connection failed after multiple attempts. Please refresh the page.")
            debugStore.logEvent("SSE_MAX_RECONNECT_ATTEMPTS_REACHED", { leadId })
          }
        }

        setDebugInfo((prev) => ({
          ...prev,
          sseReadyState: eventSource.readyState,
          connectionAttempts: connectionAttemptsRef.current,
        }))
      }
    } catch (connectionError) {
      debugStore.logEvent("SSE_CONNECTION_FAILED", { leadId, error: connectionError })
      setError("Failed to establish connection")
    }
  }, [leadId])

  // Handle status updates with step mapping
  const handleStatusUpdate = useCallback((payload: any) => {
    if (!payload) return

    const { step, status, message, timestamp } = payload

    // Map webhook events to workflow steps
    const mappedStep = STEP_MAPPING[step] || step
    if (mappedStep !== step) {
      debugStore.logEvent("STEP_MAPPED", {
        originalStep: step,
        mappedStep,
        status,
        message,
      })
    }

    debugStore.logEvent("STATUS_UPDATE_PROCESSED", {
      step: mappedStep,
      status,
      message,
      originalStep: step,
    })

    // Update status
    setStatuses((prev) => ({
      ...prev,
      [mappedStep]: {
        step: mappedStep,
        status: status as AutomationStatus["status"],
        message: message || getStepMessage(mappedStep, status),
        timestamp: timestamp || new Date().toISOString(),
      },
    }))

    // Add to status log
    const logEntry: StatusLogEntry = {
      timestamp: timestamp || new Date().toISOString(),
      step: mappedStep,
      status,
      message: message || getStepMessage(mappedStep, status),
      details: payload,
    }

    setStatusLog((prev) => [...prev, logEntry])
  }, [])

  // Handle dashboard data updates
  const handleDashboardData = useCallback((payload: any) => {
    if (!payload) return

    debugStore.logEvent("DASHBOARD_DATA_RECEIVED", { payload })

    // Safely merge dashboard data with null checks
    setDashboardData((prev) => ({
      leadId: payload.leadId || prev?.leadId || "",
      leadInfo: {
        ...prev?.leadInfo,
        ...payload.leadInfo,
      },
      metrics: {
        ...prev?.metrics,
        ...payload.metrics,
      },
      timeline: payload.timeline || prev?.timeline || [],
      aiInsights: {
        ...prev?.aiInsights,
        ...payload.aiInsights,
      },
      integrationData: {
        ...prev?.integrationData,
        ...payload.integrationData,
      },
    }))
  }, [])

  // Handle errors
  const handleError = useCallback((payload: any) => {
    const errorMessage = payload?.message || "An error occurred during automation"
    debugStore.logEvent("AUTOMATION_ERROR", { payload })
    setError(errorMessage)
  }, [])

  // Initialize when leadId changes
  useEffect(() => {
    if (leadId) {
      debugStore.logEvent("AUTOMATION_STARTED", { leadId })
      startTimeRef.current = Date.now()
      lastEventTimeRef.current = Date.now()
      connectionAttemptsRef.current = 0

      initializeStatuses()
      connectSSE()
    }

    return () => {
      cleanup()
    }
  }, [leadId, initializeStatuses, connectSSE, cleanup])

  // Calculate completion status
  const completedSteps = Object.values(statuses).filter((s) => s.status === "done").length
  const totalSteps = WORKFLOW_STEPS.length
  const isComplete = completedSteps === totalSteps

  // Log completion state changes
  useEffect(() => {
    debugStore.logEvent("COMPLETION_STATE_CHANGE", {
      isComplete,
      completedSteps,
      totalSteps,
      statuses: Object.keys(statuses).reduce(
        (acc, key) => {
          acc[key] = statuses[key].status
          return acc
        },
        {} as { [key: string]: string },
      ),
    })

    console.log("🏁 isComplete state changed:", isComplete)
    console.log("📊 Statuses changed:", statuses)
    console.log("✅ Completed steps:", `${completedSteps}/${totalSteps}`)
  }, [isComplete, completedSteps, totalSteps, statuses])

  return {
    progress,
    statuses,
    statusLog,
    dashboardData,
    isComplete,
    error,
    debugInfo,
  }
}
