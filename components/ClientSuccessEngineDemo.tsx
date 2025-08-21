"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Info } from "lucide-react"

/**
 * ClientSuccessEngineDemo.tsx
 * Single-file, frontend-only interactive Client Success Engine demo.
 *
 * Export default: ClientSuccessEngineDemo
 *
 * Note: uses shadcn/ui components from components/ui/*
 * and framer-motion for subtle animations. All data simulated client-side.
 */

/* ===========================
   Types
   =========================== */

type KickoffTarget = "ASAP" | "7 days" | "14 days"

type ClientProfile = {
  id: string
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  startDate: string // ISO
}

type ContractTerms = {
  clientName: string
  startDate: string
  endDate: string
  scope: string[]
  billingCadence: "Monthly" | "Quarterly" | "Annually"
  value: number
}

type Owner = {
  id: string
  name: string
  role: string
  email: string
  avatarColor?: string
}

type TaskStatus = "Not Started" | "In Progress" | "Done"

type Task = {
  id: string
  title: string
  ownerId?: string
  ownerName?: string
  ownerRole?: string
  status: TaskStatus
  dueDate: string
  dependencyIds?: string[]
  notes?: string
}

type EngineConfig = {
  provisionAsana: boolean
  provisionDocuSign: boolean
  provisionPortal: boolean
  provisionEmails: boolean
  kickoffTarget: KickoffTarget
}

type StatusReport = {
  week: number
  date: string
  greeting: string
  completed: Task[]
  upcoming: Task[]
  blockers: string[]
  nextSteps: string[]
}

/* ===========================
   Utilities
   =========================== */

const uid = (prefix = "") => prefix + Math.random().toString(36).slice(2, 9)

const today = () => {
  const d = new Date()
  d.setHours(9, 0, 0, 0)
  return d
}

const addDays = (d: Date, days: number) => {
  const out = new Date(d)
  out.setDate(out.getDate() + days)
  return out
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

const isoDate = (d: Date) => d.toISOString()

const formatCurrency = (v: number) =>
  v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })

/* deterministic owner sets */
const TEAM_MEMBERS: Owner[] = [
  { id: "o1", name: "Avery Shah", role: "Client Success Lead", email: "avery@barri.ai", avatarColor: "bg-accent" },
  { id: "o2", name: "Jordan Kim", role: "Project Manager", email: "jordan@barri.ai", avatarColor: "bg-accent" },
  { id: "o3", name: "Taylor Reed", role: "Engagement Manager", email: "taylor@barri.ai", avatarColor: "bg-accent" },
  { id: "o4", name: "Samir Patel", role: "Implementation Lead", email: "samir@barri.ai", avatarColor: "bg-accent" },
]

const sampleClient = (): ClientProfile => {
  const start = addDays(today(), 3)
  return {
    id: uid("c_"),
    companyName: "Brightline Creative",
    contactName: "Avery Shah",
    contactEmail: "avery@brightline.co",
    contactPhone: "555-321-9876",
    startDate: isoDate(start),
  }
}

const sampleContract = (clientName = "Brightline Creative"): ContractTerms => {
  const s = addDays(today(), 3)
  const e = addDays(s, 90)
  return {
    clientName,
    startDate: isoDate(s),
    endDate: isoDate(e),
    scope: [
      "Kickoff & onboarding",
      "Technical integration",
      "Monthly performance reports",
      "Quarterly strategic review",
    ],
    billingCadence: "Monthly",
    value: 18000,
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

/* generate tasks based on package and kickoff */
const generateTasks = (kickoff: KickoffTarget, contract: ContractTerms | null, clientStart: string): Task[] => {
  const baseDate = new Date(clientStart)

  // Only tasks that can realistically be automated with AI/LLMs and workflow tools
  const automatedTasks = [
    "Extract client data from signed contract",
    "Generate personalized welcome email",
    "Create project workspace from template",
    "Set up client folder structure",
    "Send contract summary to client",
    "Schedule kickoff meeting",
    "Generate custom onboarding checklist",
    "Create automated status report template",
    "Set up client portal access",
    "Configure notification workflows",
  ]

  // kickoff speed affects due offsets
  const kickoffOffset = kickoff === "ASAP" ? 2 : kickoff === "7 days" ? 7 : 14

  const tasks: Task[] = automatedTasks.map((title, idx) => {
    const daysOffset = Math.round((idx + 1) * (kickoffOffset / 3))
    const due = addDays(baseDate, clamp(daysOffset, 1, 21))
    return {
      id: uid("task_"),
      title,
      status: "Not Started" as TaskStatus,
      dueDate: isoDate(due),
      dependencyIds:
        idx > 0
          ? [
              /* will assign later */
            ]
          : undefined,
    }
  })

  // create simple dependencies
  for (let i = 1; i < tasks.length; i++) {
    tasks[i].dependencyIds = [tasks[i - 1].id]
  }

  return tasks
}

const assignOwners = (tasks: Task[], owners: Owner[]): Task[] => {
  if (!owners || owners.length === 0) return tasks
  // round-robin assign owners
  return tasks.map((task, i) => {
    const owner = owners[i % owners.length]
    if (!owner) return task
    return {
      ...task,
      ownerId: owner.id,
      ownerName: owner.name,
      ownerRole: owner.role,
    }
  })
}

const scheduleStatusEmail = (client: ClientProfile | null, week = 1): StatusReport => {
  const date = addDays(today(), week * 7)
  const greeting = `Hello ${client?.contactName ?? "Team"},`
  return {
    week,
    date: isoDate(date),
    greeting,
    completed: [],
    upcoming: [],
    blockers: [],
    nextSteps: ["Review completed tasks", "Confirm next milestones", "Share questions before Friday review"],
  }
}

/* ===========================
   Small UI helpers
   =========================== */

const HeroMetric: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <Card className="p-3 bg-black/50 border border-white/10 backdrop-blur-sm">
    <div className="flex flex-col">
      <div className="text-sm text-white/60">{subtitle}</div>
      <div className="mt-2 text-lg font-semibold text-white">{title}</div>
    </div>
  </Card>
)

const InfoTooltip: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className={`relative inline-block ${className}`}>
      <Info
        className="w-4 h-4 text-white/40 hover:text-accent cursor-help transition-colors"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-black border border-white/20 rounded-lg text-sm text-white whitespace-normal max-w-sm shadow-lg">
          <div className="bg-black px-1 py-0.5 rounded">{text}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  )
}

/* ===========================
   Main Component
   =========================== */

export default function ClientSuccessEngineDemo() {
  /* Wizard / Inputs */
  const [wizardStep, setWizardStep] = useState<number>(1)
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null)
  const [contractTerms, setContractTerms] = useState<ContractTerms | null>(null)

  const [config, setConfig] = useState<EngineConfig>({
    provisionAsana: true,
    provisionDocuSign: true,
    provisionPortal: true,
    provisionEmails: true,
    kickoffTarget: "7 days",
  })

  const _useSampleData = () => {
    const sample = sampleClient()
    setClientProfile(sample)
  }

  const useSampleData = useCallback(() => {
    _useSampleData()
  }, [])

  const _useSampleContractInner = () => {
    const c = sampleContract(clientProfile?.companyName ?? "Brightline Creative")
    setContractTerms(c)
  }

  const useSampleContract = useCallback(() => {
    _useSampleContractInner()
  }, [clientProfile?.companyName])

  /* generated runtime */
  const [owners, setOwners] = useState<Owner[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isLaunched, setIsLaunched] = useState(false)
  const [stageIndex, setStageIndex] = useState<number>(-1)
  const [logLines, setLogLines] = useState<string[]>([])
  const [showTable, setShowTable] = useState(false)

  /* Add after the existing state declarations */
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)

  /* progress stages */
  const stages = [
    "Extracting client details from contract documents...",
    "Generating personalized project templates...",
    "Creating workspaces and assigning team members...",
    "Provisioning client portal and access...",
    "Scheduling reports and notifications...",
  ]

  /* Recompute owners/tasks when client, contract, or config changes (but not while running) */
  useEffect(() => {
    if (!clientProfile) return
    setOwners(TEAM_MEMBERS)
    const generated = generateTasks(config.kickoffTarget, contractTerms, clientProfile.startDate)
    const assigned = assignOwners(generated, TEAM_MEMBERS)
    setTasks(assigned)
    // recompute launched flag if config changes mid-run
    setIsLaunched(false)
  }, [clientProfile, contractTerms, config.kickoffTarget])

  /* Engine simulation */
  const resetEngine = React.useCallback(() => {
    setIsRunning(false)
    setStageIndex(-1)
    setLogLines([])
    setIsLaunched(false)
    setOwners([])
    setTasks([])
    setShowTable(false)
    // do not clear client/contract unless full reset requested
  }, [])

  useEffect(() => {
    const timeouts: number[] = []
    if (!isRunning) return
    setLogLines([])
    setStageIndex(-1)
    const baseDelay = 800

    stages.forEach((stage, i) => {
      const delay = baseDelay + i * 1200
      const t = window.setTimeout(() => {
        setStageIndex(i)
        setLogLines((s) => [...s, `• ${stage}`])

        // Automated task progression during engine run
        if (i === 1) {
          // Stage 1: Start first few tasks
          setTasks((prev) => prev.map((t0, idx) => (idx < 3 ? { ...t0, status: "In Progress" as TaskStatus } : t0)))
        }
        if (i === 2) {
          // Stage 2: Complete first tasks, start more
          setTasks((prev) =>
            prev.map((t0, idx) => {
              if (idx < 2) return { ...t0, status: "Done" as TaskStatus }
              if (idx < 5) return { ...t0, status: "In Progress" as TaskStatus }
              return t0
            }),
          )
        }
        if (i === 3) {
          // Stage 3: Complete more tasks, start remaining
          setTasks((prev) =>
            prev.map((t0, idx) => {
              if (idx < 4) return { ...t0, status: "Done" as TaskStatus }
              if (idx < 7) return { ...t0, status: "In Progress" as TaskStatus }
              return t0
            }),
          )
        }
        if (i === 4) {
          // Stage 4: Complete most tasks, finish remaining
          setTasks((prev) =>
            prev.map((t0, idx) => {
              if (idx < 6) return { ...t0, status: "Done" as TaskStatus }
              if (idx < prev.length) return { ...t0, status: "In Progress" as TaskStatus }
              return t0
            }),
          )
        }

        if (i === stages.length - 1) {
          // finish after last stage - complete ALL tasks
          setTimeout(() => {
            setIsRunning(false)
            setIsLaunched(true)
            setStageIndex(stages.length)
            // Complete ALL remaining tasks
            setTasks((prev) => prev.map((t0) => ({ ...t0, status: "Done" as TaskStatus })))
          }, 600)
        }
      }, delay)
      timeouts.push(t)
    })

    return () => {
      timeouts.forEach((t) => clearTimeout(t))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning])

  /* Launch handler */
  const canLaunch = !!clientProfile && !!contractTerms && !isRunning
  const handleLaunch = () => {
    if (!canLaunch) return
    // ensure owners/tasks up-to-date
    setOwners(TEAM_MEMBERS)
    const generated = generateTasks(config.kickoffTarget, contractTerms, clientProfile!.startDate)
    const assigned = assignOwners(generated, TEAM_MEMBERS)
    setTasks(assigned)
    setIsRunning(true)
    setStageIndex(0)
    setLogLines([`🚀 Automation started for ${clientProfile?.companyName}`])
    setIsLaunched(false)
    // move to stage progression handled by effect
  }

  /* reset full demo */
  const resetFull = () => {
    setWizardStep(1)
    setClientProfile(null)
    setContractTerms(null)
    setConfig({
      provisionAsana: true,
      provisionDocuSign: true,
      provisionPortal: true,
      provisionEmails: true,
      kickoffTarget: "7 days",
    })
    resetEngine()
  }

  /* Derived values */
  const projectSummary = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((t) => t.status === "Done").length
    const inProgress = tasks.filter((t) => t.status === "In Progress").length
    return { total, done, inProgress }
  }, [tasks])

  const weeklyReport = useMemo(() => {
    return scheduleStatusEmail(clientProfile, 1)
  }, [clientProfile])

  const riskIndicator = useMemo(() => {
    if (config.kickoffTarget === "ASAP" && tasks.length > 10) return "High"
    if (config.kickoffTarget === "ASAP" && tasks.length > 6) return "Medium"
    return "Low"
  }, [config.kickoffTarget, tasks.length])

  /* simple handlers to toggle task status */
  const advanceTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === "Not Started" ? "In Progress" : t.status === "In Progress" ? "Done" : "Done" }
          : t,
      ),
    )
  }

  /* Add the TaskDetailsModal component before the main component return */
  const TaskDetailsModal: React.FC<{ task: Task | null; onClose: () => void }> = ({ task, onClose }) => {
    if (!task) return null

    const getTaskDetails = (taskTitle: string) => {
      const details: Record<string, { description: string; steps: string[]; outcome: string }> = {
        "Extract client data from signed contract": {
          description:
            "AI reads and extracts key information from your signed contract documents using document processing",
          steps: [
            "AI scanned contract document for client details and project scope",
            "Extracted billing terms, dates, and deliverable information",
            "Validated data accuracy using pattern recognition",
            "Structured information for use across connected systems",
          ],
          outcome: "Client information automatically populated across all project management systems",
        },
        "Generate personalized welcome email": {
          description: "AI creates a custom welcome email tailored to your client's business and project needs",
          steps: [
            "AI analyzed client's business context from contract details",
            "Generated personalized messaging appropriate for their industry",
            "Included specific project timeline and next steps",
            "Formatted email with professional tone and branding",
          ],
          outcome: "Personalized welcome email automatically sent with project overview",
        },
        "Create project workspace from template": {
          description: "AI sets up organized project management workspace with relevant tasks and structure",
          steps: [
            "AI selected optimal workspace template based on project scope",
            "Created project with client-specific naming and organization",
            "Generated task list with appropriate timelines and dependencies",
            "Configured team access and notification settings",
          ],
          outcome: "Complete project workspace ready for team collaboration and tracking",
        },
        "Set up client folder structure": {
          description: "AI creates organized file storage with proper permissions and folder hierarchy",
          steps: [
            "AI created standardized folder structure for client documents",
            "Set up organized subfolders for different document types",
            "Configured appropriate access permissions for team members",
            "Established file naming conventions and organization rules",
          ],
          outcome: "Professional file organization system ready for document management",
        },
        "Send contract summary to client": {
          description: "AI generates and sends clear project overview based on contract terms",
          steps: [
            "AI analyzed contract to identify key terms and deliverables",
            "Generated executive summary in client-friendly language",
            "Created timeline visualization of project milestones",
            "Automatically sent via email with professional formatting",
          ],
          outcome: "Client received clear understanding of project scope and expectations",
        },
        "Schedule kickoff meeting": {
          description: "AI coordinates optimal meeting time and sends professional calendar invitations",
          steps: [
            "AI analyzed team availability to find optimal meeting slots",
            "Generated meeting agenda based on project requirements",
            "Created calendar invitations with video conference details",
            "Sent invitations to all stakeholders with preparation materials",
          ],
          outcome: "Kickoff meeting scheduled with all participants and materials prepared",
        },
        "Generate custom onboarding checklist": {
          description: "AI creates tailored checklist based on client's specific project requirements",
          steps: [
            "AI analyzed project scope to identify required onboarding steps",
            "Generated customized checklist items relevant to client's needs",
            "Organized tasks in logical sequence with clear descriptions",
            "Set up progress tracking and completion notifications",
          ],
          outcome: "Comprehensive onboarding checklist ensuring no critical steps are missed",
        },
        "Create automated status report template": {
          description: "AI designs recurring report format tailored to client's project and preferences",
          steps: [
            "AI analyzed project structure to identify key metrics to track",
            "Generated report template with relevant sections and formatting",
            "Set up automated data collection from project management tools",
            "Configured weekly delivery schedule and recipient list",
          ],
          outcome: "Professional status reports automatically generated and delivered weekly",
        },
        "Set up client portal access": {
          description: "AI configures secure client portal with relevant project information and resources",
          steps: [
            "AI created branded portal interface with client's project information",
            "Set up secure login credentials and access permissions",
            "Populated portal with relevant documents and progress tracking",
            "Configured automated updates to keep information current",
          ],
          outcome: "Client portal ready with secure access to project resources and updates",
        },
        "Configure notification workflows": {
          description: "AI sets up intelligent notification system to keep all stakeholders informed",
          steps: [
            "AI mapped project stakeholders and their notification preferences",
            "Created automated workflows for different types of project updates",
            "Set up escalation rules for important milestones and issues",
            "Configured delivery channels and timing for optimal communication",
          ],
          outcome: "Smart notification system ensuring timely communication throughout project",
        },
      }

      return (
        details[taskTitle] || {
          description: "AI-powered task completed successfully with all requirements met",
          steps: ["AI executed task according to project specifications"],
          outcome: "Objective achieved and ready for next phase",
        }
      )
    }

    const taskDetails = getTaskDetails(task.title)

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-black border border-white/20 max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{task.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={
                      task.status === "Done"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : task.status === "In Progress"
                          ? "bg-accent/20 text-accent border-accent/30"
                          : "bg-white/10 text-white/70 border-white/20"
                    }
                  >
                    {task.status}
                  </Badge>
                  <span className="text-white/50 text-sm">Due {formatDate(task.dueDate)}</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                onClick={onClose}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-white font-medium mb-2">What was done</h4>
                <p className="text-white/70 text-sm leading-relaxed">{taskDetails.description}</p>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Process breakdown</h4>
                <div className="space-y-2">
                  {taskDetails.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-accent text-xs font-medium">{index + 1}</span>
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Outcome</h4>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm leading-relaxed">{taskDetails.outcome}</p>
                </div>
              </div>

              {task.ownerName && (
                <div>
                  <h4 className="text-white font-medium mb-2">Responsible team member</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-accent text-sm font-medium">
                        {task.ownerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{task.ownerName}</div>
                      <div className="text-white/50 text-xs">{task.ownerRole}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  /* layout */
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Hero / Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Client Success Engine</h1>
            <p className="text-white/70 max-w-xl">
              Transform signed contracts into fully automated client onboarding in minutes. Watch as tasks, owners,
              portals, and status reports are generated automatically.
            </p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge className="bg-white/10 text-white border-white/20">Agencies</Badge>
              <Badge className="bg-white/10 text-white border-white/20">Consulting</Badge>
              <Badge className="bg-white/10 text-white border-white/20">Legal</Badge>
              <Badge className="bg-white/10 text-white border-white/20">Accounting</Badge>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="grid grid-cols-3 gap-3">
              <HeroMetric title="85% Faster" subtitle="Onboarding time" />
              <HeroMetric title="< 10 min" subtitle="Setup to kickoff" />
              <HeroMetric title="100% Automated" subtitle="Status updates" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Wizard */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4 bg-black/50 border border-white/10 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-sm text-white/60">Setup Wizard</div>
                    <div className="text-lg font-semibold text-white">Step {wizardStep} of 4</div>
                  </div>
                  <InfoTooltip text="Follow these 4 simple steps to see how client onboarding gets automated" />
                </div>
                <div className="text-sm text-white/50">Target: {config.kickoffTarget}</div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {wizardStep === 1 && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Label className="text-white">Client Information</Label>
                      <InfoTooltip text="Basic client details that will be used to personalize the onboarding experience" />
                    </div>
                    <div className="mt-2 space-y-3">
                      <Input
                        value={clientProfile?.companyName ?? ""}
                        placeholder="Company Name"
                        className="bg-black/50 border-white/20 text-white placeholder:text-white/40"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setClientProfile(
                            (p) => ({ ...(p ?? sampleClient()), companyName: e.target.value }) as ClientProfile,
                          )
                        }
                      />
                      <Input
                        value={clientProfile?.contactName ?? ""}
                        placeholder="Primary Contact Name"
                        className="bg-black/50 border-white/20 text-white placeholder:text-white/40"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setClientProfile(
                            (p) => ({ ...(p ?? sampleClient()), contactName: e.target.value }) as ClientProfile,
                          )
                        }
                      />
                      <Input
                        value={clientProfile?.contactEmail ?? ""}
                        placeholder="Primary Contact Email"
                        className="bg-black/50 border-white/20 text-white placeholder:text-white/40"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setClientProfile(
                            (p) => ({ ...(p ?? sampleClient()), contactEmail: e.target.value }) as ClientProfile,
                          )
                        }
                      />
                      <div className="flex gap-2">
                        <Input
                          value={clientProfile?.contactPhone ?? ""}
                          placeholder="Phone"
                          className="bg-black/50 border-white/20 text-white placeholder:text-white/40"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setClientProfile(
                              (p) => ({ ...(p ?? sampleClient()), contactPhone: e.target.value }) as ClientProfile,
                            )
                          }
                        />
                        <Input
                          defaultValue={clientProfile ? formatDate(clientProfile.startDate) : ""}
                          placeholder="Start Date"
                          className="bg-black/50 border-white/20 text-white placeholder:text-white/40"
                          readOnly
                        />
                      </div>
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent w-full"
                          onClick={useSampleData}
                        >
                          Use Sample Data
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {wizardStep === 2 && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Label className="text-white">Contract Details</Label>
                      <InfoTooltip text="Contract information helps determine project scope, timeline, and billing setup" />
                    </div>
                    <div className="mt-2 text-white/70">Upload signed agreement or use sample data</div>
                    <div className="mt-3">
                      <input
                        id="file-upload"
                        type="file"
                        accept="application/json"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const f = e.target.files?.[0]
                          if (!f) return
                          const reader = new FileReader()
                          reader.onload = () => {
                            try {
                              const parsed = JSON.parse(String(reader.result))
                              // try to map fields
                              const mapped: ContractTerms = {
                                clientName: parsed.clientName ?? parsed.name ?? clientProfile?.companyName ?? "Client",
                                startDate: parsed.startDate ?? new Date().toISOString(),
                                endDate: parsed.endDate ?? addDays(new Date(), 90).toISOString(),
                                scope: parsed.scope ?? parsed.services ?? ["Kickoff & onboarding"],
                                billingCadence: parsed.billingCadence ?? "Monthly",
                                value: parsed.value ?? 5000,
                              }
                              setContractTerms(mapped)
                            } catch {
                              // ignore parse error
                            }
                          }
                          reader.readAsText(f)
                        }}
                        className="text-white file:bg-accent file:text-black file:border-0 file:rounded file:px-3 file:py-1 file:mr-3"
                      />
                      <div className="mt-3 flex gap-2">
                        <Button className="bg-accent text-black hover:bg-accent/90" onClick={useSampleContract}>
                          Use Sample Contract
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          onClick={() => setContractTerms(null)}
                        >
                          Clear
                        </Button>
                      </div>
                      {contractTerms && (
                        <Card className="mt-4 p-3 bg-black/70 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-sm text-white/60">Contract Preview</div>
                            <InfoTooltip text="This data will be used to generate tasks, timelines, and billing setup" />
                          </div>
                          <div className="mt-2">
                            <div className="font-semibold text-white">{contractTerms.clientName}</div>
                            <div className="text-white/50 text-sm">
                              {formatDate(contractTerms.startDate)} — {formatDate(contractTerms.endDate)} •{" "}
                              {contractTerms.billingCadence}
                            </div>
                            <ul className="mt-2 text-white/70 text-sm list-disc list-inside">
                              {contractTerms.scope.slice(0, 4).map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                            <div className="mt-2 text-white font-medium">
                              {formatCurrency(contractTerms.value)} / term
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  </motion.div>
                )}

                {wizardStep === 3 && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Label className="text-white">Automation Settings</Label>
                      <InfoTooltip text="Choose which tools and processes to automatically set up for this client" />
                    </div>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={config.provisionAsana}
                            onCheckedChange={(v: boolean | "indeterminate") =>
                              setConfig((c) => ({ ...c, provisionAsana: !!v }))
                            }
                          />
                          <div>
                            <div className="text-white">Project Management Board</div>
                            <div className="text-white/50 text-sm">Auto-create Asana/Monday workspace with tasks</div>
                          </div>
                          <InfoTooltip text="AI automatically creates project boards with tasks tailored to your client's specific contract scope and requirements" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={config.provisionDocuSign}
                            onCheckedChange={(v: boolean | "indeterminate") =>
                              setConfig((c) => ({ ...c, provisionDocuSign: !!v }))
                            }
                          />
                          <div>
                            <div className="text-white">Document Signing</div>
                            <div className="text-white/50 text-sm">Set up DocuSign templates and workflows</div>
                          </div>
                          <InfoTooltip text="LLM generates personalized document templates and workflows based on client industry and contract terms" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={config.provisionPortal}
                            onCheckedChange={(v: boolean | "indeterminate") =>
                              setConfig((c) => ({ ...c, provisionPortal: !!v }))
                            }
                          />
                          <div>
                            <div className="text-white">Client Portal</div>
                            <div className="text-white/50 text-sm">Create branded client access portal</div>
                          </div>
                          <InfoTooltip text="AI creates a branded portal with client-specific resources, progress tracking, and automated access provisioning" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={config.provisionEmails}
                            onCheckedChange={(v: boolean | "indeterminate") =>
                              setConfig((c) => ({ ...c, provisionEmails: !!v }))
                            }
                          />
                          <div>
                            <div className="text-white">Status Reports</div>
                            <div className="text-white/50 text-sm">Weekly automated progress emails</div>
                          </div>
                          <InfoTooltip text="LLM writes and schedules personalized status updates based on actual project progress and milestones" />
                        </div>
                      </div>

                      <Separator className="my-3 bg-white/10" />

                      <div className="mt-3 flex items-center gap-2">
                        <div className="text-sm text-white/60">Kickoff Timeline</div>
                        <InfoTooltip text="How quickly you want to get the client up and running" />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant={config.kickoffTarget === "ASAP" ? "default" : "outline"}
                          className={
                            config.kickoffTarget === "ASAP"
                              ? "bg-accent text-black"
                              : "border-white/20 text-white hover:bg-white/10"
                          }
                          onClick={() => setConfig((c) => ({ ...c, kickoffTarget: "ASAP" }))}
                        >
                          ASAP
                        </Button>
                        <Button
                          variant={config.kickoffTarget === "7 days" ? "default" : "outline"}
                          className={
                            config.kickoffTarget === "7 days"
                              ? "bg-accent text-black"
                              : "border-white/20 text-white hover:bg-white/10"
                          }
                          onClick={() => setConfig((c) => ({ ...c, kickoffTarget: "7 days" }))}
                        >
                          7 days
                        </Button>
                        <Button
                          variant={config.kickoffTarget === "14 days" ? "default" : "outline"}
                          className={
                            config.kickoffTarget === "14 days"
                              ? "bg-accent text-black"
                              : "border-white/20 text-white hover:bg-white/10"
                          }
                          onClick={() => setConfig((c) => ({ ...c, kickoffTarget: "14 days" }))}
                        >
                          14 days
                        </Button>
                      </div>

                      <div className="mt-3 text-sm">
                        <div className="text-white/50">
                          Complexity Risk:{" "}
                          <span
                            className={
                              riskIndicator === "High"
                                ? "text-red-400"
                                : riskIndicator === "Medium"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                            }
                          >
                            {riskIndicator}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {wizardStep === 4 && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Label className="text-white">Ready to Launch</Label>
                      <InfoTooltip text="Review your settings and launch the automation to see the magic happen!" />
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="text-white/70">Configuration Summary</div>
                      <Card className="p-3 bg-black/70 border border-white/10">
                        <div className="text-white font-semibold">{clientProfile?.companyName ?? "—"}</div>
                        <div className="text-white/50 text-sm">
                          {clientProfile?.contactName ?? "—"} • {clientProfile?.contactEmail ?? "—"}
                        </div>
                        <div className="mt-2 text-white/70 text-sm">
                          Kickoff target: <span className="font-medium text-white">{config.kickoffTarget}</span>
                        </div>
                        <div className="mt-2 text-white/70 text-sm">
                          Contract:{" "}
                          {contractTerms
                            ? `${formatDate(contractTerms.startDate)} – ${formatDate(contractTerms.endDate)}`
                            : "None"}
                        </div>
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {config.provisionAsana && (
                            <Badge className="bg-white/10 text-white border-white/20">Project Board</Badge>
                          )}
                          {config.provisionDocuSign && (
                            <Badge className="bg-white/10 text-white border-white/20">DocuSign</Badge>
                          )}
                          {config.provisionPortal && (
                            <Badge className="bg-white/10 text-white border-white/20">Client Portal</Badge>
                          )}
                          {config.provisionEmails && (
                            <Badge className="bg-white/10 text-white border-white/20">Weekly Reports</Badge>
                          )}
                        </div>
                      </Card>

                      <div className="flex gap-2">
                        <Button
                          className="bg-accent text-black hover:bg-accent/90 font-semibold"
                          onClick={handleLaunch}
                          disabled={!canLaunch || isRunning}
                        >
                          {isRunning ? "🚀 Running Automation..." : "🚀 Launch Automation"}
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
                        >
                          Back
                        </Button>
                      </div>
                      {!clientProfile || !contractTerms ? (
                        <div className="text-yellow-400 text-sm flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Complete client info and contract details to proceed
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-white/50 text-sm">Progress: {wizardStep}/4</div>
                <div className="flex gap-2">
                  {wizardStep > 1 && (
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      onClick={() => setWizardStep((s) => s - 1)}
                    >
                      Previous
                    </Button>
                  )}
                  {wizardStep < 4 && (
                    <Button
                      className="bg-accent text-black hover:bg-accent/90"
                      onClick={() => setWizardStep((s) => s + 1)}
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Engine run & logs */}
            <Card className="p-3 bg-black/50 border border-white/10 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-sm text-white/60">Automation Status</div>
                    <div className="font-medium text-white">
                      {isRunning ? "🔄 Running" : isLaunched ? "✅ Completed" : "⏸️ Ready"}
                    </div>
                  </div>
                  <InfoTooltip text="Watch as the automation creates tasks, assigns team members, and sets up client resources" />
                </div>
                <div className="text-white/50 text-sm">{logLines.length} steps</div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col gap-2">
                  {stages.map((s, i) => {
                    const done = i < stageIndex || (isLaunched && i <= stages.length - 1)
                    const active = i === stageIndex && isRunning
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2 rounded ${done ? "bg-black/70" : "bg-black/50"} border border-white/10`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10">
                            <AnimatePresence>
                              {done ? (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="text-green-400 font-semibold"
                                >
                                  ✓
                                </motion.span>
                              ) : active ? (
                                <motion.span
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                                  className="text-accent"
                                >
                                  ⚡
                                </motion.span>
                              ) : (
                                <span className="text-white/40">•</span>
                              )}
                            </AnimatePresence>
                          </div>
                          <div>
                            <div className="text-white text-sm">{s}</div>
                            <div className="text-white/50 text-xs">
                              {done ? "Completed" : active ? "In progress..." : "Pending"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-3 flex gap-2">
                  <Button
                    className="bg-accent text-black hover:bg-accent/90"
                    onClick={handleLaunch}
                    disabled={!canLaunch || isRunning}
                  >
                    {isRunning ? "Running..." : "Run Demo"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => resetEngine()}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => {
                      useSampleData()
                      useSampleContract()
                      setWizardStep(4)
                    }}
                  >
                    Quick Demo
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right column: Outputs */}
          <div className="lg:col-span-2 space-y-4">
            {/* Project Plan + Kanban */}
            <Card className="p-4 bg-black/50 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-sm text-white/60">Generated Project Plan</div>
                    <div className="text-xl font-semibold text-white">Onboarding Tasks</div>
                  </div>
                  <InfoTooltip text="These tasks are automatically generated based on your package tier and timeline. Watch them progress during automation!" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-white/50 text-sm mr-2">View:</div>
                  <Button
                    variant={showTable ? "outline" : "default"}
                    className={showTable ? "border-white/20 text-white hover:bg-white/10" : "bg-accent text-black"}
                    onClick={() => setShowTable(false)}
                  >
                    Board
                  </Button>
                  <Button
                    variant={showTable ? "default" : "outline"}
                    className={showTable ? "bg-accent text-black" : "border-white/20 text-white hover:bg-white/10"}
                    onClick={() => setShowTable(true)}
                  >
                    List
                  </Button>
                </div>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  <div className="text-lg mb-2">No tasks generated yet</div>
                  <div className="text-sm">
                    Complete the setup wizard and run the automation to see tasks appear here
                  </div>
                </div>
              ) : !showTable ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(["Not Started", "In Progress", "Done"] as TaskStatus[]).map((col) => (
                    <div key={col} className="bg-black/70 p-3 rounded border border-white/10">
                      <div className="text-sm text-white/60 mb-2 font-medium flex items-center gap-2">
                        {col}
                        <span className="bg-white/10 text-xs px-2 py-1 rounded">
                          {tasks.filter((t) => t.status === col).length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {tasks
                          .filter((t) => t.status === col)
                          .map((t) => (
                            /* In the Kanban view task cards, replace the existing task card content with: */
                            <motion.div
                              key={t.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-2 bg-black/50 rounded border border-white/10 hover:border-white/20 transition-colors"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <div className="font-medium text-white text-sm">{t.title}</div>
                                  <div className="text-white/50 text-xs">
                                    {t.ownerName} • {t.ownerRole}
                                  </div>
                                  <div className="text-white/50 text-xs mt-1">Due {formatDate(t.dueDate)}</div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  {t.status === "Done" ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-accent/30 text-accent hover:bg-accent/10 bg-transparent text-xs"
                                      onClick={() => {
                                        setSelectedTask(t)
                                        setShowTaskDetails(true)
                                      }}
                                    >
                                      View Details
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-white/20 text-white hover:bg-white/10 bg-transparent text-xs"
                                      onClick={() => advanceTask(t.id)}
                                    >
                                      Move →
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        {tasks.filter((t) => t.status === col).length === 0 && (
                          <div className="text-white/40 text-sm text-center py-4">No tasks</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-white/50 text-sm border-b border-white/10">
                        <th className="p-2">Task</th>
                        <th className="p-2">Owner</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Due Date</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((t) => (
                        <tr key={t.id} className="border-t border-white/10 hover:bg-white/5">
                          <td className="p-2 text-white">{t.title}</td>
                          <td className="p-2 text-white/70">{t.ownerName}</td>
                          <td className="p-2">
                            <Badge
                              className={
                                t.status === "Done"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : t.status === "In Progress"
                                    ? "bg-accent/20 text-accent border-accent/30"
                                    : "bg-white/10 text-white/70 border-white/20"
                              }
                            >
                              {t.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-white/70">{formatDate(t.dueDate)}</td>
                          {/* In the table view, replace the Action column content with: */}
                          <td className="p-2">
                            {t.status === "Done" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-accent/30 text-accent hover:bg-accent/10 bg-transparent"
                                onClick={() => {
                                  setSelectedTask(t)
                                  setShowTaskDetails(true)
                                }}
                              >
                                View Details
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                                onClick={() => advanceTask(t.id)}
                              >
                                Advance
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Client Portal + Status Report + Config Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-black/50 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm text-white/60">Client Portal</div>
                  <InfoTooltip text="Automatically generated portal where clients can track progress and access resources" />
                </div>
                <div className="mt-2">
                  <div className="text-white font-semibold">Welcome, {clientProfile?.contactName ?? "Client"}!</div>
                  <div className="text-white/50 text-sm mt-1">
                    Status: <span className="text-green-400">Active</span> • Updated just now
                  </div>
                  <ul className="mt-3 space-y-2 text-white/70">
                    <li>
                      <a className="text-white underline hover:text-accent cursor-pointer">📋 Onboarding Checklist</a>
                    </li>
                    <li>
                      <a className="text-white underline hover:text-accent cursor-pointer">📅 Kickoff Schedule</a>
                    </li>
                    <li>
                      <a className="text-white underline hover:text-accent cursor-pointer">❓ FAQ & Resources</a>
                    </li>
                    <li>
                      <a className="text-white underline hover:text-accent cursor-pointer">💳 Billing Portal</a>
                    </li>
                    <li>
                      <a className="text-white underline hover:text-accent cursor-pointer">💬 Support Chat</a>
                    </li>
                  </ul>
                </div>
              </Card>

              <Card className="p-4 bg-black/50 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm text-white/60">Weekly Status Report</div>
                  <InfoTooltip text="Automated weekly updates sent to clients every Friday at 9 AM" />
                </div>
                <div className="mt-2">
                  <div className="text-white font-semibold">
                    Week 1 Progress for {clientProfile?.companyName ?? "Client"}
                  </div>
                  <div className="text-white/70 text-sm mt-2">{weeklyReport.greeting}</div>
                  <div className="mt-3 text-white/70 text-sm">
                    <div className="font-medium text-white">✅ Completed ({projectSummary.done})</div>
                    <ul className="list-disc list-inside text-white/70 ml-2">
                      {tasks
                        .filter((t) => t.status === "Done")
                        .slice(0, 3)
                        .map((t) => (
                          <li key={t.id}>{t.title}</li>
                        ))}
                      {tasks.filter((t) => t.status === "Done").length === 0 && (
                        <li>Tasks will appear here after automation runs</li>
                      )}
                    </ul>
                  </div>
                  <div className="mt-3 text-white/70 text-sm">
                    <div className="font-medium text-white">🔄 In Progress ({projectSummary.inProgress})</div>
                    <ul className="list-disc list-inside text-white/70 ml-2">
                      {tasks
                        .filter((t) => t.status === "In Progress")
                        .slice(0, 3)
                        .map((t) => (
                          <li key={t.id}>
                            {t.title} — Due {formatDate(t.dueDate)}
                          </li>
                        ))}
                      {tasks.filter((t) => t.status === "In Progress").length === 0 && (
                        <li>Active tasks will show here</li>
                      )}
                    </ul>
                  </div>
                  <div className="mt-3 text-white/50 text-sm italic">📧 Sent automatically every Friday at 9 AM</div>
                </div>
              </Card>

              <Card className="p-4 bg-black/50 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm text-white/60">Project Summary</div>
                  <InfoTooltip text="Real-time overview of project status and configuration" />
                </div>
                <div className="mt-2 text-white font-medium">{clientProfile?.companyName ?? "No Client Selected"}</div>
                <div className="mt-2 text-white/70 text-sm">
                  Timeline: <span className="text-white">{config.kickoffTarget}</span>
                  <br />
                  Tasks: <span className="text-white">{projectSummary.total} total</span>
                  <br />
                  Billing: {contractTerms?.billingCadence ?? "—"} •{" "}
                  {contractTerms ? formatCurrency(contractTerms.value) : "—"}
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {config.provisionAsana && (
                    <Badge className="bg-white/10 text-white border-white/20">📋 Project Board</Badge>
                  )}
                  {config.provisionDocuSign && (
                    <Badge className="bg-white/10 text-white border-white/20">✍️ DocuSign</Badge>
                  )}
                  {config.provisionPortal && (
                    <Badge className="bg-white/10 text-white border-white/20">🌐 Portal</Badge>
                  )}
                  {config.provisionEmails && (
                    <Badge className="bg-white/10 text-white border-white/20">📧 Reports</Badge>
                  )}
                </div>

                {projectSummary.total > 0 && (
                  <div className="mt-3 p-2 bg-black/50 rounded border border-white/10">
                    <div className="text-xs text-white/60 mb-1">Progress</div>
                    <div className="flex gap-1">
                      <div className="flex-1 bg-white/10 rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(projectSummary.done / projectSummary.total) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-white/70">
                        {Math.round((projectSummary.done / projectSummary.total) * 100)}%
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Sticky CTA footer */}
        <div className="fixed left-0 right-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent backdrop-blur p-3 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-white font-semibold">Ready to automate your client onboarding?</div>
                <div className="text-white/70 text-sm">
                  Transform your manual processes into seamless automation in minutes.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href="/contact" className="text-white/70 hover:underline">
                See Pricing
              </a>
              <a href="/contact">
                <Button className="bg-accent text-black hover:bg-accent/90 font-semibold">Get Started</Button>
              </a>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                onClick={() => resetFull()}
              >
                Reset Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showTaskDetails && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => {
            setShowTaskDetails(false)
            setSelectedTask(null)
          }}
        />
      )}
    </div>
  )
}
