export type StatusUpdate = {
  step: string
  status: "processing" | "complete" | "error"
  message?: string
  data?: Record<string, any>
}

export type DashboardData = {
  processingTime: string
  leadScore: number
  category: string
  integrations: string[]
  metrics: {
    responseTime: string
    conversionProbability: string
  }
  leadData: {
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
