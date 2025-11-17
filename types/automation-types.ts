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

// Contact Form Types
export type ContactBasics = {
  fullName: string
  email: string
  phone?: string
  company?: string
  website?: string
  message: string
}

export type DiscoveryAnswers = {
  hoursFocus?: string
  followupPain?: string[]
  repeatedLookups?: string
  singlePointProcess?: string
  morningKPIs?: string
  integrations?: string[]
}

export type ContactPayload = ContactBasics & DiscoveryAnswers & {
  page: 'contact'
  userAgent?: string
  ip?: string
  trap?: string
  category?: 'web-dev' | 'software-tools' | 'scripts' | 'ai-automations'
}

export type WebDevPayload = {
  fullName: string
  email: string
  phone?: string
  company?: string
  projectType: string
  timeline: string
  budget: string
  existingWebsite?: string
  message: string
  category: 'web-dev'
  page: 'contact'
  userAgent?: string
  ip?: string
}

export type SoftwareToolsPayload = {
  fullName: string
  email: string
  phone?: string
  company: string
  softwareType: string
  userCount: string
  timeline: string
  integrations?: string
  message: string
  category: 'software-tools'
  page: 'contact'
  userAgent?: string
  ip?: string
}

export type ScriptsPayload = {
  fullName: string
  email: string
  phone?: string
  company?: string
  scriptType: string
  frequency: string
  urgency: string
  currentProcess?: string
  message: string
  category: 'scripts'
  page: 'contact'
  userAgent?: string
  ip?: string
}
