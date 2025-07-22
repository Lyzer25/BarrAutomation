"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, ArrowRight, MessageSquare, BrainCircuit, CheckCircle, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { mockDashboardData } from "@/lib/mock-dashboard"
import type { DashboardData } from "@/types/automation-types"

const integrationAlternatives = {
  email: [
    { name: "Gmail", description: "Google's email service" },
    { name: "Outlook", description: "Microsoft's email service" },
    { name: "SendGrid", description: "Transactional email API" },
    { name: "Mailchimp", description: "Email marketing platform" },
  ],
  data: [
    { name: "Google Sheets", description: "Cloud-based spreadsheets" },
    { name: "Airtable", description: "Spreadsheet-database hybrid" },
    { name: "Notion", description: "All-in-one workspace" },
    { name: "Database", description: "SQL/NoSQL databases" },
  ],
  notification: [
    { name: "Discord", description: "Community chat platform" },
    { name: "Slack", description: "Real-time team chat" },
    { name: "Microsoft Teams", description: "Enterprise collaboration" },
    { name: "Twilio", description: "SMS and voice notifications" },
    { name: "Telegram", description: "Secure messaging app" },
  ],
  ai: [
    { name: "OpenAI", description: "GPT models for text generation" },
    { name: "Anthropic Claude", description: "Advanced AI assistant" },
    { name: "Google AI", description: "Machine learning services" },
  ],
}

const getIntegrationCategory = (integrationName: string): keyof typeof integrationAlternatives | null => {
  const name = integrationName.toLowerCase()
  if (["gmail", "outlook", "sendgrid", "mailchimp"].includes(name)) return "email"
  if (["sheets", "google sheets", "airtable", "notion", "database"].includes(name)) return "data"
  if (["discord", "slack", "teams", "microsoft teams", "twilio", "telegram"].includes(name)) return "notification"
  if (["openai", "anthropic", "claude", "google ai"].includes(name)) return "ai"
  return null
}

const StyledCard = ({ children, className, ...props }: { children: React.ReactNode; className?: string } & any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
    className={cn(
      "bg-gradient-radial from-black to-gray-900 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors",
      className,
    )}
    {...props}
  >
    {children}
  </motion.div>
)

const LeadScoreBar = ({ score }: { score: number }) => {
  const scoreColor = score > 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-blue-500"
  return (
    <div className="w-full bg-gray-800 rounded-full h-2.5">
      <motion.div
        className={cn("h-2.5 rounded-full", scoreColor)}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      />
    </div>
  )
}

const MetricCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="flex flex-col items-center justify-center text-center space-y-2 p-4">
    <div className="text-blue-400">{icon}</div>
    <p className="text-3xl font-mono font-bold text-white">{value}</p>
    <p className="text-sm font-mono text-gray-400">{label}</p>
  </div>
)

export default function DashboardViewer({ data }: { data: DashboardData | null }) {
  const [showEmail, setShowEmail] = useState(false)
  const [showDiscord, setShowDiscord] = useState(false)
  const router = useRouter()

  // Add console.log to check data prop
  console.log('--- DashboardViewer RENDER ---')
  console.log('data:', data)
  console.log('-----------------------------')

  // Add detailed logging to trace rendering
  useEffect(() => {
    console.log('--- DashboardViewer MOUNTED ---')
    return () => {
      console.log('--- DashboardViewer UNMOUNTED ---')
    }
  }, [])

  useEffect(() => {
    console.log('--- DashboardViewer DATA UPDATED ---')
    console.log('data:', data)
    console.log('---------------------------------')
  }, [data])

  // Use received data, with field-by-field fallback to mock data
  const dashboard = data || mockDashboardData.dashboard
  const leadScore = dashboard.leadScore ?? mockDashboardData.dashboard.leadScore
  const category = dashboard.category ?? mockDashboardData.dashboard.category
  const leadData = dashboard.leadData ?? mockDashboardData.dashboard.leadData
  const metrics = dashboard.metrics ?? mockDashboardData.dashboard.metrics
  const processingTime = dashboard.processingTime ?? mockDashboardData.dashboard.processingTime
  const emailContent = dashboard.emailContent ?? mockDashboardData.dashboard.emailContent
  const discordMessage = dashboard.discordMessage ?? mockDashboardData.dashboard.discordMessage
  const integrations = dashboard.integrations ?? mockDashboardData.dashboard.integrations

  const scoreColorClass =
    Number(leadScore) > 80 ? "border-green-500" : Number(leadScore) >= 50 ? "border-yellow-500" : "border-blue-500"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
      className="space-y-8 pt-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <StyledCard className={cn("hover:!border-white", scoreColorClass)}>
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
              <div>
                <h3 className="text-2xl font-mono font-bold text-white">{leadData.name}</h3>
                <p className="text-blue-400 font-mono">{leadData.email}</p>
              </div>
              <Badge className={cn("text-sm font-mono whitespace-nowrap", scoreColorClass)}>
                {category}
              </Badge>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm font-mono text-gray-400">Lead Score: {leadScore}/100</p>
              <LeadScoreBar score={Number(leadScore)} />
            </div>
            <p className="text-sm text-gray-300 font-mono italic">"{leadData.message}"</p>
          </StyledCard>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MetricCard icon={<Clock className="w-8 h-8" />} label="Total Time" value={`${processingTime}s`} />
            <MetricCard
              icon={<BrainCircuit className="w-8 h-8" />}
              label="AI Response Time"
              value={metrics.responseTime}
            />
            <MetricCard
              icon={<CheckCircle className="w-8 h-8" />}
              label="Conversion Chance"
              value={metrics.conversionProbability}
            />
          </div>

          <StyledCard>
            <h3 className="font-mono font-bold text-white mb-4">Automation Outputs</h3>
            <div className="space-y-4">
              <Button onClick={() => setShowEmail(!showEmail)} variant="outline" className="w-full justify-between">
                <span className="font-mono">Peek at Sent Email</span> <Mail className="h-4 w-4" />
              </Button>
              <AnimatePresence>
                {showEmail && emailContent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border border-gray-700 rounded-lg p-4 bg-black"
                  >
                    <h4 className="font-bold text-white font-mono">{emailContent.subject}</h4>
                    <div
                      className="prose prose-sm prose-invert mt-2 text-gray-300 font-sans"
                      dangerouslySetInnerHTML={{ __html: emailContent.body }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Button onClick={() => setShowDiscord(!showDiscord)} variant="outline" className="w-full justify-between">
                <span className="font-mono">Reveal Team Notification</span> <MessageSquare className="h-4 w-4" />
              </Button>
              <AnimatePresence>
                {showDiscord && discordMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border border-gray-700 rounded-lg p-4 bg-black"
                  >
                    <p className="font-bold text-white font-mono">{discordMessage.title}</p>
                    <p className="text-sm text-gray-400 mt-1 font-mono">{discordMessage.description}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {discordMessage.fields?.map((field: any, index: number) => (
                        <div key={index}>
                          <p className="text-xs font-semibold text-gray-400 uppercase font-mono">{field.name}</p>
                          <p className="text-sm text-white font-mono">{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </StyledCard>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <StyledCard>
            <h3 className="font-mono font-bold text-white mb-4">Integration Stack</h3>
            <p className="text-sm text-gray-400 font-mono mb-4">
              This workflow used {integrations.length} tools. Click to see alternatives.
            </p>
            <div className="flex flex-wrap gap-2">
              {integrations.map((int: string) => {
                const category = getIntegrationCategory(int)
                return (
                  <Popover key={int}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="font-mono cursor-pointer bg-transparent">
                        {int}
                      </Button>
                    </PopoverTrigger>
                    {category && (
                      <PopoverContent className="w-64 bg-black border-2 border-gray-700 text-white p-4">
                        <div className="space-y-3">
                          <h4 className="font-mono font-medium leading-none">Category Alternatives:</h4>
                          <div className="flex flex-wrap gap-2">
                            <TooltipProvider>
                              {integrationAlternatives[category].map((alt) => (
                                <Tooltip key={alt.name} delayDuration={100}>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      className="cursor-default font-mono hover:border-blue-500 hover:shadow-[0_0_8px_hsl(var(--accent)/0.5)] transition-all"
                                    >
                                      {alt.name}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-black border-gray-600 text-white">
                                    <p>{alt.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </TooltipProvider>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-4 font-mono bg-transparent"
                            onClick={() => router.push("/contact")}
                          >
                            Customize This <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </PopoverContent>
                    )}
                  </Popover>
                )
              })}
            </div>
          </StyledCard>

          <StyledCard>
            <h3 className="font-mono font-bold text-white mb-4">Adapt This Workflow</h3>
            <div className="space-y-2 text-sm text-gray-300 font-mono">
              <p>
                <strong className="text-white">For E-commerce:</strong> Analyze abandoned carts, send personalized
                recovery emails.
              </p>
              <p>
                <strong className="text-white">For Support:</strong> Categorize tickets, analyze sentiment, route to
                agents with suggested replies.
              </p>
              <p>
                <strong className="text-white">No-Code:</strong> We build in platforms like n8n so you can drag-and-drop
                to make changes.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 font-mono bg-transparent"
              onClick={() => router.push("/contact")}
            >
              Build My Custom Version <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </StyledCard>
        </div>
      </div>
    </motion.div>
  )
}
