"use client"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, BrainCircuit, CheckCircle, Rocket } from "lucide-react"
import AnimatedStat from "@/components/smart-lead-machine/animated-stat"
import IntegrationEcosystem from "@/components/smart-lead-machine/integration-ecosystem"
import DemoModal from "@/components/smart-lead-machine/demo-modal"
import WorkflowVisualizer from "@/components/smart-lead-machine/workflow-visualizer"
import DashboardViewer from "@/components/smart-lead-machine/dashboard-viewer"
import { useAutomationProgress } from "@/hooks/use-automation-progress"

export default function SmartLeadMachinePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null)
  const { statuses, statusLog, dashboardData, isComplete, error } = useAutomationProgress(activeLeadId)

  const handleDemoStarted = useCallback((leadId: string) => {
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
          {activeLeadId && !isComplete && (
            <motion.div
              key="visualizer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12"
            >
              <WorkflowVisualizer statuses={statuses} statusLog={statusLog} error={error} />
            </motion.div>
          )}

          {activeLeadId && isComplete && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 pb-16"
            >
              <DashboardViewer data={dashboardData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onDemoStarted={handleDemoStarted} />

      <div className="container mx-auto px-4 py-16">
        <IntegrationEcosystem />
      </div>
    </div>
  )
}
