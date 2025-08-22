export interface LeadData {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
  source: string
}

export interface EmailContent {
  subject: string
  body: string
  recipient: string
}

export interface DiscordMessage {
  title: string
  description: string
  fields: Array<{
    name: string
    value: string
    inline?: boolean
  }>
  color?: number
}

export interface DashboardMetrics {
  responseTime: string
  conversionProbability: string
  leadScore: number
}

export interface DashboardData {
  dashboard: {
    leadScore: number
    category: string
    leadData: LeadData
    metrics: DashboardMetrics
    processingTime: number
    emailContent: EmailContent
    discordMessage: DiscordMessage
    integrations: string[]
  }
}

export interface AutomationStatus {
  step: string
  status: "pending" | "processing" | "complete" | "error"
  message?: string
  timestamp: string
  data?: any
}

export interface WorkflowStep {
  id: string
  label: string
  description: string
  status: "pending" | "processing" | "complete" | "error"
  timestamp?: string
}
