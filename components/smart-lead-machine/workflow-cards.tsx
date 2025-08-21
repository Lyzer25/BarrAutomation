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
import type { AutomationStatus, StatusLogEntry } from "@/types/automation-types"
import { cn } from "@/lib/utils"

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
  statuses: Record<string, AutomationStatus>
  statusLog: StatusLogEntry[]
  error: string | null
  onContinue: () => void
  isComplete: boolean
}

const getStatusIcon = (status: AutomationStatus) => {
  switch (status) {
    case "complete":
      return <CheckCircle className="w-5 h-5 text-green-400" />
    case "processing":
      return <Clock className="w-5 h-5 text-blue-400 animate-spin" />
    case "error":
      return <AlertCircle className="w-5 h-5 text-red-400" />
    default:
      return <Clock className="w-5 h-5 text-gray-400" />
  }
}

const getStatusColor = (status: AutomationStatus) => {
  switch (status) {
    case "complete":
      return "border-green-500 bg-green-500/10"
    case "processing":
      return "border-blue-500 bg-blue-500/10"
    case "error":
      return "border-red-500 bg-red-500/10"
    default:
      return "border-gray-600 bg-gray-800/50"
  }
}

const getStatusBadge = (status: AutomationStatus) => {
  switch (status) {
    case "complete":
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Complete</Badge>
    case "processing":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Processing</Badge>
    case "error":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>
    default:
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Pending</Badge>
  }
}

export default function WorkflowCards({ statuses, statusLog, error, onContinue, isComplete }: WorkflowCardsProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Workflow Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {workflowSteps.map((step, index) => {
          const status = statuses[step.id] || "pending"
          const isActive = status === "processing"

          return (
            <Card
              key={step.id}
              className={cn(
                "relative transition-all duration-500 border-2",
                getStatusColor(status),
                isActive && "animate-pulse",
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        status === "complete"
                          ? "bg-green-500/20"
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
                        {getStatusIcon(status)}
                        {getStatusBadge(status)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                  <div className="bg-black/30 rounded-lg p-3 border border-gray-700">
                    <p className="text-xs text-gray-400 font-mono">{step.technicalDetails}</p>
                  </div>
                </div>

                {/* Continue Button for Dashboard Step */}
                {step.id === "dashboard-complete" && status === "complete" && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <Button onClick={onContinue} className="w-full bg-green-600 hover:bg-green-700 text-white">
                      View Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

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
                  <span className="text-gray-500 text-xs">{new Date(entry.timestamp).toLocaleTimeString()}</span>
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
    </div>
  )
}
