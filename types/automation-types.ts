export type StatusUpdate = {
  step: string
  status: "processing" | "complete" | "error"
  message?: string
  data?: Record<string, any>
}

export type DashboardData = {
  processingTime: string
  leadScore: number | string
  category: string
  integrations: string[]
  metrics: {
    responseTime: string
    conversionProbability: string
  }
  leadData?: {
    name: string
    email: string
    phone: string
    message: string
    [key: string]: any
  }
  emailContent: {
    subject: string
    body: string
  }
  discordMessage: {
    title: string
    description: string
    fields: { name: string; value: string }[]
  }
  [key: string]: any
}

export type AutomationEvent =
  | { type: "status-update"; payload: StatusUpdate }
  | { type: "dashboard-update"; payload: DashboardData }
  | { type: "error"; payload: { message: string } }

export interface AutomationStatus {
  step: string
  status: "not-started" | "in-progress" | "done" | "error"
  message: string
  timestamp: string
}

export interface StatusLogEntry {
  timestamp: string
  step: string
  status: string
  message: string
  details?: any
}
