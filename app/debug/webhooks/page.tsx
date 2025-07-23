"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Download, 
  RefreshCw, 
  Send, 
  Trash2,
  Wifi,
  WifiOff,
  Zap
} from "lucide-react"

interface WebhookLog {
  id: string
  timestamp: string
  endpoint: string
  leadId: string
  method: string
  success: boolean
  processingTime: number
  error?: string
  responseStatus: number
  userAgent?: string
  sourceIP?: string
}

interface HealthData {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  metrics: {
    totalRequests: number
    successfulRequests: number
    failedRequests: number
    successRate: number
    errorRate: number
    averageResponseTime: number
  }
  recentActivity: {
    lastActivity?: string
    recentLogs: WebhookLog[]
  }
  errorSummary: Array<{
    error: string
    count: number
    lastOccurrence: string
  }>
}

export default function WebhookDebugPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [testEndpoint, setTestEndpoint] = useState('/api/webhook/status-update/test123')
  const [testPayload, setTestPayload] = useState('{\n  "step": "test",\n  "status": "complete",\n  "message": "Debug test"\n}')
  const [testResult, setTestResult] = useState<any>(null)
  const [testLoading, setTestLoading] = useState(false)

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/webhook/health')
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`)
      }
      const data = await response.json()
      setHealthData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health data')
    } finally {
      setLoading(false)
    }
  }

  const clearLogs = async () => {
    try {
      const response = await fetch('/api/webhook/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear-logs' })
      })
      
      if (response.ok) {
        await fetchHealthData()
      }
    } catch (err) {
      console.error('Failed to clear logs:', err)
    }
  }

  const exportLogs = async () => {
    try {
      const response = await fetch('/api/webhook/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export-logs' })
      })
      
      if (response.ok) {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `webhook-logs-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('Failed to export logs:', err)
    }
  }

  const testWebhook = async () => {
    setTestLoading(true)
    setTestResult(null)
    
    try {
      const response = await fetch(testEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: testPayload
      })
      
      const responseData = await response.json()
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        timestamp: new Date().toISOString()
      })
      
      // Refresh health data to see the new log
      setTimeout(fetchHealthData, 1000)
    } catch (err) {
      setTestResult({
        error: err instanceof Error ? err.message : 'Test failed',
        timestamp: new Date().toISOString()
      })
    } finally {
      setTestLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthData()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(fetchHealthData, 5000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500'
      case 'degraded': return 'text-yellow-500'
      case 'unhealthy': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'degraded': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'unhealthy': return <AlertCircle className="h-5 w-5 text-red-500" />
      default: return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-accent" />
          <span className="ml-2 text-lg">Loading webhook diagnostics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Webhook Data</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchHealthData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Webhook Debug Dashboard</h1>
          <p className="text-muted-foreground">Monitor and debug webhook activity in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {autoRefresh ? 'Live' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchHealthData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {healthData && getStatusIcon(healthData.status)}
              <div>
                <p className="text-sm font-medium">System Status</p>
                <p className={`text-lg font-bold ${healthData && getStatusColor(healthData.status)}`}>
                  {healthData?.status || 'Unknown'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Success Rate</p>
                <p className="text-lg font-bold text-blue-500">
                  {healthData?.metrics.successRate.toFixed(1) || '0'}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-lg font-bold text-purple-500">
                  {healthData?.metrics.averageResponseTime || 0}ms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Total Requests</p>
                <p className="text-lg font-bold text-green-500">
                  {healthData?.metrics.totalRequests || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Recent Logs</TabsTrigger>
          <TabsTrigger value="errors">Error Summary</TabsTrigger>
          <TabsTrigger value="test">Test Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Webhook Activity</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={clearLogs}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-2">
              <AnimatePresence>
                {healthData?.recentActivity.recentLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className={`${log.success ? 'border-green-500/20' : 'border-red-500/20'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {log.success ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                            <div>
                              <p className="font-medium">{log.endpoint}</p>
                              <p className="text-sm text-muted-foreground">
                                Lead ID: {log.leadId} • {new Date(log.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={log.success ? "default" : "destructive"}>
                              {log.responseStatus}
                            </Badge>
                            <Badge variant="outline">
                              {log.processingTime}ms
                            </Badge>
                          </div>
                        </div>
                        {log.error && (
                          <div className="mt-2 p-2 bg-red-500/10 rounded text-sm text-red-400">
                            {log.error}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {!healthData?.recentActivity.recentLogs.length && (
                <div className="text-center py-8 text-muted-foreground">
                  No webhook activity recorded yet
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <h2 className="text-xl font-semibold">Error Summary</h2>
          <div className="space-y-2">
            {healthData?.errorSummary.map((error, index) => (
              <Card key={index} className="border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-400">{error.error}</p>
                      <p className="text-sm text-muted-foreground">
                        Last occurred: {new Date(error.lastOccurrence).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="destructive">{error.count} times</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {!healthData?.errorSummary.length && (
              <div className="text-center py-8 text-muted-foreground">
                No errors recorded 🎉
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <h2 className="text-xl font-semibold">Test Webhook Endpoints</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Send Test Request</CardTitle>
                <CardDescription>Test webhook endpoints manually</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Endpoint</label>
                  <Input
                    value={testEndpoint}
                    onChange={(e) => setTestEndpoint(e.target.value)}
                    placeholder="/api/webhook/status-update/test123"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Payload (JSON)</label>
                  <Textarea
                    value={testPayload}
                    onChange={(e) => setTestPayload(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
                
                <Button onClick={testWebhook} disabled={testLoading} className="w-full">
                  {testLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Test Request
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Result</CardTitle>
                <CardDescription>Response from webhook endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                {testResult ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={testResult.error ? "destructive" : "default"}>
                        {testResult.status || 'Error'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {testResult.timestamp && new Date(testResult.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <Separator />
                    <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-64">
                      {JSON.stringify(testResult.data || testResult.error, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Send a test request to see the response
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
