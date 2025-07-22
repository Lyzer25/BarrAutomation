"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { leadEventEmitter } from "@/lib/events"
import { debugStore } from "@/lib/debug-store"
import type { AutomationEvent, StatusUpdate, DashboardData } from "@/types/automation-types"

export const useAutomationProgress = (leadId: string | null) => {
  const [statuses, setStatuses] = useState<Record<string, StatusUpdate["status"]>>({})
  const [statusLog, setStatusLog] = useState<string[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [animationActive, setAnimationActive] = useState(false)
  
  // NEW: Timeout state tracking
  const [timedOut, setTimedOut] = useState(false)
  const [timeoutTimestamp, setTimeoutTimestamp] = useState<number | null>(null)
  const [timeoutCountdown, setTimeoutCountdown] = useState(90)
  
  // Refs for cleanup and debugging
  const eventSourceRef = useRef<EventSource | null>(null)
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const lastEventTimeRef = useRef<number | null>(null)
 
  const resetState = useCallback(() => {
    debugStore.logEvent('AUTOMATION_STATE_RESET', { 
      leadId,
      timestamp: new Date().toISOString()
    })
    
    setStatuses({})
    setStatusLog([])
    setDashboardData(null)
    setIsComplete(false)
    setError(null)
    setTimedOut(false)
    setTimeoutTimestamp(null)
    setTimeoutCountdown(90)
  }, [leadId])

  // Countdown timer effect
  useEffect(() => {
    if (!leadId || isComplete || error || timedOut) return

    const interval = setInterval(() => {
      setTimeoutCountdown((prev: number) => {
        const newValue = Math.max(0, prev - 1)
        if (newValue <= 10 && newValue > 0) {
          debugStore.logEvent('TIMEOUT_WARNING', { 
            secondsRemaining: newValue,
            leadId,
            lastEventTime: lastEventTimeRef.current
          })
        }
        return newValue
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [leadId, isComplete, error, timedOut])

  useEffect(() => {
    if (!leadId) {
      resetState()
      return
    }

    resetState()
    startTimeRef.current = Date.now()
    lastEventTimeRef.current = Date.now()
    
    debugStore.logEvent('AUTOMATION_STARTED', { 
      leadId,
      startTime: startTimeRef.current,
      timestamp: new Date().toISOString()
    })
    
    setStatusLog([`${new Date().toLocaleTimeString()}: Workflow started for lead: ${leadId}`])

    console.log('Subscribing to leadId:', leadId);

    const eventSource = new EventSource(`/api/events/${leadId}`);
    eventSourceRef.current = eventSource
    
    eventSource.onopen = () => {
      console.log('SSE opened for leadId:', leadId);
      debugStore.logEvent('SSE_CONNECTION_OPENED', { 
        leadId,
        timestamp: new Date().toISOString()
      })
    };
    
    eventSource.onmessage = (event) => {
      const eventTime = Date.now()
      lastEventTimeRef.current = eventTime
      
      console.log('SSE message:', event.data);
      
      debugStore.logEvent('SSE_EVENT_RECEIVED', {
        leadId,
        eventData: event.data,
        timedOut,
        timeSinceTimeout: timedOut ? eventTime - (timeoutTimestamp || 0) : null,
        timeSinceStart: eventTime - (startTimeRef.current || 0),
        timestamp: new Date().toISOString()
      })
      
      try {
        const update = JSON.parse(event.data);
        console.log('Handling type:', update.type, 'for leadId:', leadId);
        
        // CRITICAL: Filter events after timeout (with grace period)
        if (timedOut) {
          const timeSinceTimeout = eventTime - (timeoutTimestamp || 0)
          if (timeSinceTimeout > 30000) { // 30-second grace period
            debugStore.logEvent('EVENT_IGNORED_TIMEOUT', { 
              eventData: update, 
              timeSinceTimeout,
              leadId
            })
            return
          } else {
            debugStore.logEvent('EVENT_GRACE_PERIOD', { 
              eventData: update, 
              timeSinceTimeout,
              leadId
            })
          }
        }
        
        if (update.type === "status-update") {
          const { step, status, message } = update.payload;
          console.log('Status step:', step);
          
          debugStore.logEvent('STATUS_UPDATE_PROCESSED', {
            step,
            status,
            message,
            leadId,
            timedOut
          })
          
          setStatuses((prev: Record<string, StatusUpdate["status"]>) => ({ ...prev, [step]: status }));
          const logMessage = `${new Date().toLocaleTimeString()}: ${step} - ${status} ${message ? `(${message})` : ""}`;
          setStatusLog((prev: string[]) => [...prev, logMessage]);
          
          // Animation for Lead Capture
          if (step === 'lead-received') {
            setAnimationActive(true);
          }
        } else if (update.type === "dashboard-update") {
          console.log('🎯 DASHBOARD UPDATE RECEIVED:', update.payload);
          
          // Handle late dashboard arrival after timeout
          if (timedOut) {
            const timeSinceTimeout = eventTime - (timeoutTimestamp || 0)
            if (timeSinceTimeout < 30000) {
              debugStore.logEvent('STATE_RECOVERY', { 
                timeSinceTimeout, 
                dashboardData: update.payload,
                leadId
              })
              setTimedOut(false)
              setError(null)
              setTimeoutTimestamp(null)
            } else {
              debugStore.logEvent('DASHBOARD_TOO_LATE', { 
                timeSinceTimeout, 
                ignored: true,
                leadId
              })
              return
            }
          }
          
          debugStore.logEvent('DASHBOARD_UPDATE_PROCESSED', {
            dashboardData: update.payload,
            leadId,
            timedOut: false // Reset after recovery
          })
          
          generateDashboard(update.payload);
          console.log('🎯 CALLING setDashboardData');
          setDashboardData(update.payload);
          console.log('🎯 CALLING setIsComplete(true)');
          setIsComplete(true);
          console.log('🎯 STATE AFTER UPDATE:', { isComplete: true, hasData: !!update.payload });
          setStatusLog((prev: string[]) => [...prev, `${new Date().toLocaleTimeString()}: Dashboard received. Workflow complete.`]);
        } else if (update.type === "error") {
          debugStore.logEvent('ERROR_EVENT_RECEIVED', {
            error: update.payload.message,
            leadId,
            timedOut
          })
          
          setError(update.payload.message);
          setStatusLog((prev: string[]) => [...prev, `${new Date().toLocaleTimeString()}: ERROR - ${update.payload.message}`]);
        } else {
          console.warn('No handler for event type:', update.type, 'for leadId:', leadId);
          debugStore.logEvent('UNKNOWN_EVENT_TYPE', {
            eventType: update.type,
            eventData: update,
            leadId
          })
        }
      } catch (err) {
        console.error('Failed to parse SSE event:', err, event.data);
        debugStore.logEvent('SSE_PARSE_ERROR', {
          error: err instanceof Error ? err.message : 'Unknown error',
          eventData: event.data,
          leadId
        })
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      debugStore.logEvent('SSE_CONNECTION_ERROR', {
        error: error,
        leadId,
        timedOut,
        timestamp: new Date().toISOString()
      })
    };
    
    // FIXED: Improved timeout logic with SSE closure
    const timeoutId = setTimeout(() => {
      if (!isComplete && !timedOut) {
        const errorMessage = "Demo timed out. The workflow might be slow or have failed.";
        
        console.log('[TIMEOUT] 90 seconds reached, closing SSE connection');
        debugStore.logEvent('TIMEOUT_TRIGGERED', { 
          duration: 90000, 
          lastEventTime: lastEventTimeRef.current,
          pendingSteps: Object.entries(statuses).filter(([_, status]) => status !== 'complete').map(([step]) => step),
          leadId
        })
        
        setTimedOut(true)
        setTimeoutTimestamp(Date.now())
        setError(errorMessage)
        setStatusLog((prev: string[]) => [...prev, `${new Date().toLocaleTimeString()}: TIMEOUT - ${errorMessage}`])
        
        // CRITICAL: Close the SSE connection
        if (eventSource) {
          eventSource.close()
          console.log('[TIMEOUT] SSE connection closed')
          debugStore.logEvent('SSE_CONNECTION_CLOSED_TIMEOUT', { leadId })
        }
      }
    }, 90000); // 90-second timeout
    
    timeoutIdRef.current = timeoutId
    
    // Listen for debug commands
    const handleForceTimeout = () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
        // Trigger timeout immediately
        setTimeout(() => {
          if (!isComplete && !timedOut) {
            const errorMessage = "Demo timed out (forced for testing)."
            setTimedOut(true)
            setTimeoutTimestamp(Date.now())
            setError(errorMessage)
            setStatusLog((prev: string[]) => [...prev, `${new Date().toLocaleTimeString()}: FORCED TIMEOUT - ${errorMessage}`])
            if (eventSource) {
              eventSource.close()
            }
          }
        }, 100)
      }
    }
    
    const handleForceDashboard = () => {
      if (timedOut) {
        debugStore.logEvent('FORCE_DASHBOARD_RECOVERY', { leadId })
        setTimedOut(false)
        setError(null)
        setTimeoutTimestamp(null)
        setIsComplete(true)
        setDashboardData({
          leadScore: 85,
          category: "High Priority",
          leadData: { name: "Test Lead", email: "test@example.com", phone: "", message: "Forced dashboard test" },
          metrics: { responseTime: "2.3s", conversionProbability: "78%" },
          processingTime: 45,
          emailContent: { subject: "Test Email", body: "Test content" },
          discordMessage: { title: "Test Alert", description: "Test notification" },
          integrations: ["OpenAI", "Gmail", "Discord"]
        })
      }
    }
    
    const handleResetDemo = () => {
      debugStore.logEvent('DEMO_RESET_TRIGGERED', { leadId })
      if (eventSource) {
        eventSource.close()
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
      resetState()
    }
    
    const handleTestSSE = () => {
      debugStore.logEvent('SSE_CONNECTION_TEST', {
        readyState: eventSource.readyState,
        url: eventSource.url,
        leadId
      })
      console.log('SSE Connection Test:', {
        readyState: eventSource.readyState,
        url: eventSource.url,
        leadId
      })
    }
    
    window.addEventListener('force-timeout', handleForceTimeout)
    window.addEventListener('force-dashboard', handleForceDashboard)
    window.addEventListener('reset-demo', handleResetDemo)
    window.addEventListener('test-sse-connection', handleTestSSE)
    
    return () => {
      if (eventSource) {
        eventSource.close()
        debugStore.logEvent('SSE_CONNECTION_CLOSED_CLEANUP', { leadId })
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
      
      window.removeEventListener('force-timeout', handleForceTimeout)
      window.removeEventListener('force-dashboard', handleForceDashboard)
      window.removeEventListener('reset-demo', handleResetDemo)
      window.removeEventListener('test-sse-connection', handleTestSSE)
    };
  }, [leadId, resetState]) // FIXED: Remove isComplete from dependency array to prevent reset loops

  // Add generateDashboard function
  function generateDashboard(data: DashboardData) {
    // Example: set metrics, update UI, etc.
    // This can be expanded as needed for your UI
    setDashboardData(data);
    // Optionally, setAnimationActive(true) or update other UI state
  }

  return { 
    statuses, 
    statusLog, 
    dashboardData, 
    isComplete, 
    error, 
    animationActive,
    // NEW: Debug and timeout info
    timedOut,
    timeoutCountdown,
    timeoutTimestamp,
    debugInfo: {
      startTime: startTimeRef.current,
      lastEventTime: lastEventTimeRef.current,
      sseReadyState: eventSourceRef.current?.readyState,
      timeSinceStart: startTimeRef.current ? Date.now() - startTimeRef.current : 0,
      timeSinceLastEvent: lastEventTimeRef.current ? Date.now() - lastEventTimeRef.current : 0
    }
  }
}
