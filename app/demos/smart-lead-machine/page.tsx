"use client"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, BrainCircuit, CheckCircle, Rocket } from "lucide-react"
import AnimatedStat from "@/components/smart-lead-machine/animated-stat"
import IntegrationEcosystem from "@/components/smart-lead-machine/integration-ecosystem"
import dynamic from "next/dynamic"
import WorkflowCards from "@/components/smart-lead-machine/workflow-cards"
import DashboardViewer from "@/components/smart-lead-machine/dashboard-viewer"
import DebugPanel from "@/components/debug/debug-panel"
import ErrorBoundary from "@/components/smart-lead-machine/error-boundary"
import { useAutomationProgress } from "@/hooks/use-automation-progress"

const DemoModal = dynamic(() => import("@/components/smart-lead-machine/demo-modal"))

export default function SmartLeadMachinePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null)
  const [showDashboard, setShowDashboard] = useState(false)

  const { statuses, statusLog, dashboardData, isComplete, error, startAutomation } = useAutomationProgress()

  const handleDemoStarted = useCallback(
    (leadId: string) => {
      console.log("🚀 Demo started with leadId:", leadId)
      setActiveLeadId(leadId)
      setShowDashboard(false)
      startAutomation(leadId)
    },
    [startAutomation],
  )

  const handleContinueToDashboard = useCallback(() => {
    console.log("🎯 Continue to dashboard")
    setShowDashboard(true)
  }, [])

  const handleBackToWorkflow = useCallback(() => {
    console.log("🔄 Back to workflow")
    setShowDashboard(false)
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

      {/* CTA and Workflow/Dashboard Section */}
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
          {activeLeadId && !showDashboard && (
            <motion.div
              key="workflow-cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12"
            >
              <WorkflowCards
                statuses={statuses}
                statusLog={statusLog}
                error={error}
                onContinue={handleContinueToDashboard}
                isComplete={isComplete}
              />
            </motion.div>
          )}

          {activeLeadId && showDashboard && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 pb-16"
            >
              <div className="mb-6">
                <Button variant="outline" onClick={handleBackToWorkflow} className="mb-4 bg-transparent">
                  ← Back to Workflow
                </Button>
              </div>
              <ErrorBoundary>
                <DashboardViewer data={dashboardData} />
              </ErrorBoundary>
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
