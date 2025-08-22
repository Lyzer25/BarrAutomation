"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Webhook,
  Settings,
  BrainCircuit,
  Mail,
  Database,
  MessageSquare,
  BarChart2,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface WorkflowStep {
  id: string
  label: string
  description: string
  technicalDetails: string
  icon: React.ReactNode
}

const workflowSteps: WorkflowStep[] = [
  {
    id: "lead-received",
    label: "Lead Capture",
    description: "Incoming lead data is received and validated",
    technicalDetails: "Webhook triggers n8n workflow, validates required fields, assigns unique ID",
    icon: <Webhook className="w-6 h-6" />,
  },
  {
    id: "data-processing",
    label: "Data Processing",
    description: "Lead information is cleaned and enriched",
    technicalDetails: "Normalize contact data, validate email format, enrich with additional context",
    icon: <Settings className="w-6 h-6" />,
  },
  {
    id: "ai-qualification",
    label: "AI Analysis",
    description: "OpenAI analyzes lead quality and intent",
    technicalDetails: "GPT-4 processes message content, assigns lead score, determines qualification level",
    icon: <BrainCircuit className="w-6 h-6" />,
  },
  {
    id: "email-sent",
    label: "Email Dispatch",
    description: "Personalized response email is generated and sent",
    technicalDetails: "AI crafts personalized email based on lead data, sends via SMTP integration",
    icon: <Mail className="w-6 h-6" />,
  },
  {
    id: "crm-complete",
    label: "CRM Update",
    description: "Lead data is saved to customer database",
    technicalDetails: "Create contact record, update lead status, sync with CRM system",
    icon: <Database className="w-6 h-6" />,
  },
  {
    id: "discord-sent",
    label: "Team Alert",
    description: "Sales team is notified of new qualified lead",
    technicalDetails: "Send formatted notification to Discord channel with lead summary and score",
    icon: <MessageSquare className="w-6 h-6" />,
  },
  {
    id: "dashboard-complete",
    label: "Dashboard Ready",
    description: "Analytics dashboard is updated with results",
    technicalDetails: "Compile workflow metrics, generate insights, prepare dashboard visualization",
    icon: <BarChart2 className="w-6 h-6" />,
  },
]

interface WorkflowCardsProps {
  statuses: Record<string, string>
  statusLog: Array<{
    timestamp: string
    step: string
    status: string
    message: string
  }>
  error: string | null
  onContinue: () => void
  isComplete: boolean
}

const getStatusIcon = (status: string, isAnimating = false) => {
  switch (status) {
    case "complete":
      return <CheckCircle className={cn("w-5 h-5 text-green-400", isAnimating && "animate-pulse")} />
    case "processing":
      return <Clock className="w-5 h-5 text-blue-400 animate-spin" />
    case "error":
      return <AlertCircle className="w-5 h-5 text-red-400" />
    default:
      return <Clock className="w-5 h-5 text-gray-400" />
  }
}

const getStatusBadge = (status: string, isAnimating = false) => {
  switch (status) {
    case "complete":
      return (
        <Badge
          className={cn(
            "bg-green-500/20 text-green-400 border-green-500/30",
            isAnimating && "animate-pulse bg-green-400/30 text-green-300",
          )}
        >
          Complete
        </Badge>
      )
    case "processing":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Processing</Badge>
    case "error":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>
    default:
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Pending</Badge>
  }
}

const formatTimestamp = (timestamp: string | undefined): string => {
  try {
    if (!timestamp) {
      return new Date().toLocaleTimeString()
    }

    const date = new Date(timestamp)
    if (isNaN(date.getTime())) {
      return new Date().toLocaleTimeString()
    }

    return date.toLocaleTimeString()
  } catch (error) {
    return new Date().toLocaleTimeString()
  }
}

export default function WorkflowCards({ statuses, statusLog, error, onContinue, isComplete }: WorkflowCardsProps) {
  const [animatingSteps, setAnimatingSteps] = useState<Set<string>>(new Set())
  const [showContinueButton, setShowContinueButton] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log("🎨 WorkflowCards - isComplete changed:", isComplete)
    console.log("🎨 WorkflowCards - current statuses:", statuses)
  }, [isComplete, statuses])

  // Handle animation states when workflow completes
  useEffect(() => {
    if (isComplete) {
      console.log("🎉 Workflow complete! Starting completion animations...")

      // Filter out non-workflow steps and start animating completed steps
      const workflowStepIds = workflowSteps.map((step) => step.id)
      const completedWorkflowSteps = Object.keys(statuses).filter(
        (stepId) => statuses[stepId] === "complete" && workflowStepIds.includes(stepId),
      )

      console.log("✨ Animating completed workflow steps:", completedWorkflowSteps)
      setAnimatingSteps(new Set(completedWorkflowSteps))

      // Show continue button after a delay to let animations play
      const timer = setTimeout(() => {
        console.log("🎯 Showing continue button")
        setShowContinueButton(true)

        // Keep animations running for a bit longer
        setTimeout(() => {
          console.log("🎭 Stopping animations")
          setAnimatingSteps(new Set())
        }, 2000)
      }, 3000) // Increased delay to 3 seconds

      return () => clearTimeout(timer)
    } else {
      console.log("🔄 Workflow not complete, resetting animation states")
      setShowContinueButton(false)
      setAnimatingSteps(new Set())
    }
  }, [isComplete, statuses])

  // Animate individual steps as they complete (during workflow)
  useEffect(() => {
    if (!isComplete) {
      const workflowStepIds = workflowSteps.map((step) => step.id)

      Object.keys(statuses).forEach((stepId) => {
        if (statuses[stepId] === "complete" && workflowStepIds.includes(stepId)) {
          console.log("✅ Step completed during workflow:", stepId)
          setAnimatingSteps((prev) => new Set([...prev, stepId]))

          // Stop animating this individual step after 3 seconds
          setTimeout(() => {
            setAnimatingSteps((prev) => {
              const newSet = new Set(prev)
              newSet.delete(stepId)
              return newSet
            })
          }, 3000)
        }
      })
    }
  }, [statuses, isComplete])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-4 bg-gray-800 rounded-lg text-xs text-gray-300">
          <div>isComplete: {isComplete.toString()}</div>
          <div>showContinueButton: {showContinueButton.toString()}</div>
          <div>animatingSteps: {Array.from(animatingSteps).join(", ")}</div>
          <div>
            completedSteps:{" "}
            {Object.keys(statuses)
              .filter((s) => statuses[s] === "complete")
              .join(", ")}
          </div>
          <div>
            workflowSteps:{" "}
            {Object.keys(statuses)
              .filter((s) => statuses[s] === "complete" && workflowSteps.some((ws) => ws.id === s))
              .join(", ")}
          </div>
        </div>
      )}

      {/* Workflow Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {workflowSteps.map((step, index) => {
          const status = statuses[step.id] || "pending"
          const isAnimating = animatingSteps.has(step.id)
          const isActive = status === "processing" || isAnimating

          return (
            <Card
              key={step.id}
              className={cn(
                "relative transition-all duration-500 border-2 overflow-hidden",
                status === "complete"
                  ? isAnimating
                    ? "border-green-400 bg-green-500/10 shadow-lg shadow-green-400/20"
                    : "border-green-500 bg-green-500/10"
                  : status === "processing"
                    ? "border-blue-500 bg-blue-500/10"
                    : status === "error"
                      ? "border-red-500 bg-red-500/10"
                      : "border-gray-600 bg-gray-800/50",
                isActive && "shadow-lg transform scale-105",
              )}
            >
              {/* Liquid Fill Animation */}
              {status === "processing" && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500/30 to-green-400/20 transition-all duration-[3000ms] ease-out liquid-fill" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500/20 to-transparent liquid-fill-wave" />
                </div>
              )}

              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-all duration-300",
                        status === "complete"
                          ? isAnimating
                            ? "bg-green-400/30 shadow-lg shadow-green-400/20"
                            : "bg-green-500/20"
                          : status === "processing"
                            ? "bg-blue-500/20"
                            : status === "error"
                              ? "bg-red-500/20"
                              : "bg-gray-500/20",
                      )}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{step.label}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(status, isAnimating)}
                        {getStatusBadge(status, isAnimating)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                  <div
                    className={cn(
                      "bg-black/30 rounded-lg p-3 border border-gray-700 transition-all duration-300",
                      isAnimating && "border-green-500/50 bg-green-500/5",
                    )}
                  >
                    <p className="text-xs text-gray-400 font-mono">{step.technicalDetails}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Continue Button - Shows after workflow is complete and animations finish */}
      {showContinueButton && (
        <div className="flex justify-center mb-8">
          <Button
            onClick={onContinue}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold animate-pulse"
          >
            View Dashboard Results <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Status Log */}
      {statusLog.length > 0 && (
        <Card className="bg-black/50 border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Activity Log</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {statusLog.slice(-10).map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(entry.status)}
                    <span className="text-gray-300">{entry.message}</span>
                  </div>
                  <span className="text-gray-500 text-xs">{formatTimestamp(entry.timestamp)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900/20 border-red-500/30 mt-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-red-400">Connection Error</h3>
                <p className="text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <style jsx global>{`
        @keyframes liquidFill {
          0% {
            height: 0%;
            opacity: 0.8;
          }
          50% {
            height: 50%;
            opacity: 0.6;
          }
          100% {
            height: 100%;
            opacity: 0.4;
          }
        }

        @keyframes liquidWave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .liquid-fill {
          animation: liquidFill 3s ease-out forwards;
        }

        .liquid-fill-wave {
          animation: liquidFill 3s ease-out forwards 0.5s, liquidWave 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
