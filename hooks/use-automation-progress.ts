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
  const [animationActive, setAnimationActive] = useState(false)

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

    const eventSource = new EventSource(`/api/events/${leadId}`);
    eventSource.onopen = () => {
      console.log('SSE opened for leadId:', leadId);
    };
    eventSource.onmessage = (event) => {
      console.log('SSE message:', event.data);
      try {
        const update = JSON.parse(event.data);
        console.log('Handling type:', update.type, 'for leadId:', leadId);
        if (update.type === "status-update") {
          const { step, status, message } = update.payload;
          console.log('Status step:', step);
          setStatuses((prev) => ({ ...prev, [step]: status }));
          const logMessage = `${new Date().toLocaleTimeString()}: ${step} - ${status} ${message ? `(${message})` : ""}`;
          setStatusLog((prev) => [...prev, logMessage]);
          // Animation for Lead Capture
          if (step === 'lead-received') {
            setAnimationActive(true);
          }
        } else if (update.type === "dashboard-update") {
          console.log('Dashboard generating with:', update.payload);
          generateDashboard(update.payload);
          setDashboardData(update.payload);
          setIsComplete(true);
          setStatusLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: Dashboard received. Workflow complete.`]);
        } else if (update.type === "error") {
          setError(update.payload.message);
          setStatusLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ERROR - ${update.payload.message}`]);
        } else {
          console.warn('No handler for event type:', update.type, 'for leadId:', leadId);
        }
      } catch (err) {
        console.error('Failed to parse SSE event:', err, event.data);
      }
    };
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };
    // Fallback timeout in case n8n workflow fails silently
    const timeoutId = setTimeout(() => {
      if (!isComplete) {
        const errorMessage = "Demo timed out. The workflow might be slow or have failed.";
        setError(errorMessage);
        setStatusLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: TIMEOUT - ${errorMessage}`]);
      }
    }, 90000); // 90-second timeout
    return () => {
      eventSource.close();
      clearTimeout(timeoutId);
    };
  }, [leadId, isComplete, resetState])

  // Add generateDashboard function
  function generateDashboard(data: DashboardData) {
    // Example: set metrics, update UI, etc.
    // This can be expanded as needed for your UI
    setDashboardData(data);
    // Optionally, setAnimationActive(true) or update other UI state
  }

  return { statuses, statusLog, dashboardData, isComplete, error, animationActive }
}
