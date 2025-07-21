"use client"

import React from "react"
import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Webhook,
  Settings,
  BrainCircuit,
  Mail,
  Database,
  MessageSquare,
  BarChart2,
  Check,
  Loader,
  AlertTriangle,
} from "lucide-react"

const workflowSteps = [
  { id: "lead-received", label: "Lead Capture", icon: <Webhook /> },
  { id: "data-processing", label: "Data Processing", icon: <Settings /> },
  { id: "ai-qualification", label: "AI Analysis", icon: <BrainCircuit /> },
  { id: "email-sent", label: "Email Dispatch", icon: <Mail /> },
  { id: "crm-complete", label: "CRM Update", icon: <Database /> },
  { id: "discord-sent", label: "Team Alert", icon: <MessageSquare /> },
  { id: "dashboard-complete", label: "Dashboard", icon: <BarChart2 /> },
]

const Node = ({
  status,
  label,
  icon,
}: {
  status: "pending" | "processing" | "complete" | "error"
  label: string
  icon: ReactNode
}) => {
  const statusClasses = {
    pending: "border-white/20 text-white/50",
    processing: "border-yellow-500 text-yellow-500 animate-pulse-glow",
    complete: "border-green-500 text-green-500",
    error: "border-red-500 text-red-500",
  }

  const iconMap = {
    pending: icon,
    processing: <Loader className="animate-spin" />,
    complete: <Check />,
    error: <AlertTriangle />,
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center w-28">
      <div
        className={`w-20 h-20 border-2 rounded-full flex items-center justify-center bg-black transition-all duration-300 ${statusClasses[status]}`}
      >
        {iconMap[status]}
      </div>
      <span className={`text-xs font-mono transition-colors duration-300 ${statusClasses[status]}`}>{label}</span>
    </div>
  )
}

const Connector = ({ status }: { status: "pending" | "complete" | "error" }) => {
  const bgColor = status === "complete" ? "bg-accent" : status === "error" ? "bg-red-500" : "bg-border"
  const scaleX = status === "pending" ? 0 : 1
  return (
    <div className="relative flex-1 h-1 bg-border mx-2 md:h-auto md:w-1 md:mx-0 md:my-2">
      <motion.div
        className={`absolute top-0 left-0 h-full w-full ${bgColor}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  )
}

export default function WorkflowVisualizer({
  statuses,
  statusLog,
  error,
}: {
  statuses: Record<string, "pending" | "processing" | "complete" | "error">
  statusLog: string[]
  error: string | null
}) {
  return (
    <div className="w-full space-y-8 py-12">
      <div className="flex flex-col md:flex-row items-center justify-center gap-x-0 gap-y-4">
        {workflowSteps.map((step, index) => {
          const status = statuses[step.id] || "pending"
          const nextStep = workflowSteps[index + 1]
          const connectorStatus = nextStep && statuses[nextStep.id] ? statuses[nextStep.id] : "pending"

          return (
            <React.Fragment key={step.id}>
              <Node status={status} label={step.label} icon={step.icon} />
              {index < workflowSteps.length - 1 && <Connector status={connectorStatus} />}
            </React.Fragment>
          )
        })}
      </div>

      <div className="max-w-2xl mx-auto bg-black border border-white/10 rounded-lg p-4 h-48 overflow-y-auto">
        <h4 className="font-mono text-white mb-2">Status Log</h4>
        <AnimatePresence>
          {statusLog.map((log, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-subtle-gray font-mono mb-1"
            >
              {log}
            </motion.p>
          ))}
        </AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-500 font-mono font-bold"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  )
}
