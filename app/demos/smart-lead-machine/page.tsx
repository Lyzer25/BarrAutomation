"use client"
import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, BrainCircuit, CheckCircle, Rocket } from "lucide-react"
import AnimatedStat from "@/components/smart-lead-machine/animated-stat"
import IntegrationEcosystem from "@/components/smart-lead-machine/integration-ecosystem"
import DemoModal from "@/components/smart-lead-machine/demo-modal"
import WorkflowVisualizer from "@/components/smart-lead-machine/workflow-visualizer"
import DashboardViewer from "@/components/smart-lead-machine/dashboard-viewer"
import DebugPanel from "@/components/debug/debug-panel"
import ErrorBoundary from "@/components/smart-lead-machine/error-boundary"
import { useAutomationProgress } from "@/hooks/use-automation-progress"
import { debugStore } from "@/lib/debug-store"
import { initializeKeyboardShortcuts, initializeURLDebugAccess } from "@/lib/debug-console"

export default function SmartLeadMachinePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null)
  const { 
    statuses, 
    statusLog, 
    dashboardData, 
    isComplete, 
    error, 
    timedOut,
    timeoutCountdown,
    debugInfo 
  } = useAutomationProgress(activeLeadId)

  // Initialize debug system
  useEffect(() => {
    // Initialize keyboard shortcuts and URL debug access
    const cleanupKeyboard = initializeKeyboardShortcuts()
    initializeURLDebugAccess()
    
    debugStore.logEvent('DEMO_PAGE_LOADED', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })

    return () => {
      if (cleanupKeyboard) cleanupKeyboard()
    }
  }, [])

  // Log automation state changes for debugging
  useEffect(() => {
    if (activeLeadId) {
      debugStore.logEvent('AUTOMATION_STATE_CHANGE', {
        leadId: activeLeadId,
        statuses,
        isComplete,
        error,
        timedOut,
        timeoutCountdown,
        debugInfo
      })
    }
  }, [activeLeadId, statuses, isComplete, error, timedOut, timeoutCountdown, debugInfo])

  // Add console.log to trace rendering logic
  console.log('--- RENDER CYCLE ---')
  console.log('isComplete:', isComplete)
  console.log('dashboardData:', dashboardData)
  console.log('error:', error)
  console.log('timedOut:', timedOut)
  console.log('--------------------')

  const handleDemoStarted = useCallback((leadId: string) => {
    debugStore.logEvent('DEMO_STARTED', { 
      leadId,
      timestamp: new Date().toISOString()
    })
    setActiveLeadId(leadId)
  }, [])

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0)_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-mono text-4xl md:text-6xl font-thin bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Smart Lead Machine
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Watch AI transform raw leads into qualified opportunities in real-time. This live demo processes actual data
            through our complete automation stack, powered by n8n and OpenAI.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <AnimatedStat icon={<Clock className="w-8 h-8" />} value={30} suffix="sec" label="Response Time" />
            <AnimatedStat icon={<BrainCircuit className="w-8 h-8" />} value={95} suffix="%" label="AI Accuracy" />
            <AnimatedStat icon={<DollarSign className="w-8 h-8" />} value={120} suffix="K+" label="Revenue Recovery" />
            <AnimatedStat icon={<CheckCircle className="w-8 h-8" />} value={90} suffix="%" label="Time Saved" />
          </div>
        </div>
      </section>

      {/* CTA and Visualizer/Dashboard Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        {!activeLeadId && (
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Button
              size="lg"
              className="px-8 py-6 text-lg animate-pulse-glow shadow-accent/20 shadow-lg"
              onClick={() => setIsModalOpen(true)}
            >
              <Rocket className="mr-3 h-6 w-6" />
              See Live Demo
            </Button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {activeLeadId && !isComplete && !timedOut && (
            <motion.div
              key="visualizer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12"
            >
              <WorkflowVisualizer statuses={statuses} statusLog={statusLog} error={error} />
              
              {/* Debug info overlay (only visible when debug mode is enabled) */}
              {debugStore.isDebugEnabled() && (
                <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-gray-400">Timeout Countdown</div>
                      <div className="text-white font-mono">{timeoutCountdown}s</div>
                    </div>
                    <div>
                      <div className="text-gray-400">SSE Status</div>
                      <div className="text-white font-mono">
                        {debugInfo.sseReadyState === 1 ? 'Connected' : 'Disconnected'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Last Event</div>
                      <div className="text-white font-mono">
                        {Math.round(debugInfo.timeSinceLastEvent / 1000)}s ago
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Runtime</div>
                      <div className="text-white font-mono">
                        {Math.round(debugInfo.timeSinceStart / 1000)}s
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeLeadId && isComplete && !timedOut && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 pb-16"
            >
              <ErrorBoundary>
                <DashboardViewer data={dashboardData} />
              </ErrorBoundary>
            </motion.div>
          )}

          {activeLeadId && timedOut && (
            <motion.div
              key="timeout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 pb-16"
            >
              <div className="max-w-2xl mx-auto text-center">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8">
                  <div className="text-red-400 text-6xl mb-4">⏰</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Demo Timed Out</h3>
                  <p className="text-gray-300 mb-6">
                    The workflow took longer than expected. This might be due to high server load or a slow external service.
                  </p>
                  
                  {debugStore.isDebugEnabled() && (
                    <div className="bg-gray-900 border border-gray-700 rounded p-4 mb-6 text-left">
                      <div className="text-sm text-gray-300 space-y-2">
                        <div>Debug Info:</div>
                        <div>• Timeout occurred at: {new Date().toLocaleTimeString()}</div>
                        <div>• Last event: {Math.round(debugInfo.timeSinceLastEvent / 1000)}s ago</div>
                        <div>• Total runtime: {Math.round(debugInfo.timeSinceStart / 1000)}s</div>
                        <div>• SSE connection: {debugInfo.sseReadyState === 1 ? 'Was connected' : 'Disconnected'}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={() => {
                        debugStore.logEvent('DEMO_RETRY_CLICKED', { leadId: activeLeadId })
                        setActiveLeadId(null)
                        setIsModalOpen(true)
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Try Again
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        debugStore.logEvent('DEMO_RESET_CLICKED', { leadId: activeLeadId })
                        setActiveLeadId(null)
                      }}
                    >
                      Reset Demo
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onDemoStarted={handleDemoStarted} />

      {/* Debug Panel - Hidden by default, accessible via debug commands */}
      <DebugPanel />

      <div className="container mx-auto px-4 py-16">
        <IntegrationEcosystem />
      </div>
    </div>
  )
}
