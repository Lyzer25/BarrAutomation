"use client"

import { useState, useEffect, useCallback } from "react"
import { leadEventEmitter } from "@/lib/events"
import type { AutomationEvent, StatusUpdate, DashboardData } from "@/types/automation-types"

export const useAutomationProgress = (leadId: string | null) => {
  const [statuses, setStatuses] = useState<Record<string, StatusUpdate["status"]>>({})
  const [statusLog, setStatusLog] = useState<string[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetState = useCallback(() => {
    setStatuses({})
    setStatusLog([])
    setDashboardData(null)
    setIsComplete(false)
    setError(null)
  }, [])

  useEffect(() => {
    if (!leadId) {
      resetState()
      return
    }

    resetState()
    setStatusLog([`${new Date().toLocaleTimeString()}: Workflow started for lead: ${leadId}`])

    console.log('Subscribing to leadId:', leadId);

    const handleEvent = (event: AutomationEvent) => {
      console.log('Handling type:', event.type, 'for leadId:', leadId);
      if (event.type === "status-update") {
        const { step, status, message } = event.payload
        setStatuses((prev) => ({ ...prev, [step]: status }))
        const logMessage = `${new Date().toLocaleTimeString()}: ${step} - ${status} ${message ? `(${message})` : ""}`
        setStatusLog((prev) => [...prev, logMessage])
      } else if (event.type === "dashboard-update") {
        setDashboardData(event.payload)
        setIsComplete(true)
        setStatusLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: Dashboard received. Workflow complete.`])
      } else if (event.type === "error") {
        setError(event.payload.message)
        setStatusLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ERROR - ${event.payload.message}`])
      } else {
        console.warn('No handler for event type:', event.type, 'for leadId:', leadId);
      }
    }

    leadEventEmitter.subscribe(leadId, handleEvent)

    // Fallback timeout in case n8n workflow fails silently
    const timeoutId = setTimeout(() => {
      if (!isComplete) {
        const errorMessage = "Demo timed out. The workflow might be slow or have failed."
        setError(errorMessage)
        setStatusLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: TIMEOUT - ${errorMessage}`])
      }
    }, 90000) // 90-second timeout

    return () => {
      leadEventEmitter.unsubscribe(leadId, handleEvent)
      clearTimeout(timeoutId)
    }
  }, [leadId, isComplete, resetState])

  return { statuses, statusLog, dashboardData, isComplete, error }
}
