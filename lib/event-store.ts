type StatusLogEntry = {
  step: string
  status: string
  message?: string
  timestamp: string
}

type Snapshot = {
  statuses: Record<string, string>
  statusLog: StatusLogEntry[]
  dashboardData: any | null
}

const statusesMap = new Map<string, Record<string, string>>()
const statusLogsMap = new Map<string, StatusLogEntry[]>()
const dashboardMap = new Map<string, any>()

export function addStatusUpdate(leadId: string, update: { step: string; status: string; message?: string; timestamp?: string }): Snapshot {
  const { step, status, message } = update
  const timestamp = update.timestamp || new Date().toISOString()

  const currentStatuses = statusesMap.get(leadId) ?? {}
  currentStatuses[step] = status
  statusesMap.set(leadId, currentStatuses)

  const logs = statusLogsMap.get(leadId) ?? []
  logs.push({ step, status, message, timestamp })
  statusLogsMap.set(leadId, logs)

  return getSnapshot(leadId)
}

export function setDashboardData(leadId: string, data: any): Snapshot {
  dashboardMap.set(leadId, data)
  return getSnapshot(leadId)
}

export function getSnapshot(leadId: string): Snapshot {
  return {
    statuses: statusesMap.get(leadId) ?? {},
    statusLog: statusLogsMap.get(leadId) ?? [],
    dashboardData: dashboardMap.get(leadId) ?? null,
  }
}

export function clearLeadData(leadId: string) {
  statusesMap.delete(leadId)
  statusLogsMap.delete(leadId)
  dashboardMap.delete(leadId)
}
