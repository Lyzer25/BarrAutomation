"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { debugStore } from '@/lib/debug-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DebugPanelProps {
  className?: string
}

export default function DebugPanel({ className }: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('events')
  const [debugData, setDebugData] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [filterLevel, setFilterLevel] = useState('all')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Listen for debug panel events
  useEffect(() => {
    const handleShowPanel = () => {
      setIsVisible(true)
      debugStore.logEvent('DEBUG_PANEL_SHOWN', { timestamp: new Date().toISOString() })
    }
    
    const handleHidePanel = () => {
      setIsVisible(false)
      debugStore.logEvent('DEBUG_PANEL_HIDDEN', { timestamp: new Date().toISOString() })
    }
    
    const handleTogglePanel = () => {
      setIsVisible(prev => !prev)
      debugStore.logEvent('DEBUG_PANEL_TOGGLED', { 
        newState: !isVisible,
        timestamp: new Date().toISOString() 
      })
    }

    window.addEventListener('show-debug-panel', handleShowPanel)
    window.addEventListener('hide-debug-panel', handleHidePanel)
    window.addEventListener('toggle-debug-panel', handleTogglePanel)

    return () => {
      window.removeEventListener('show-debug-panel', handleShowPanel)
      window.removeEventListener('hide-debug-panel', handleHidePanel)
      window.removeEventListener('toggle-debug-panel', handleTogglePanel)
    }
  }, [isVisible])

  // Auto-refresh debug data
  useEffect(() => {
    if (!isVisible || !autoRefresh) return

    const updateData = () => {
      if (debugStore.isDebugEnabled()) {
        setDebugData(debugStore.getFullReport())
      }
    }

    updateData() // Initial load
    intervalRef.current = setInterval(updateData, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isVisible, autoRefresh])

  // Manual refresh
  const handleRefresh = () => {
    if (debugStore.isDebugEnabled()) {
      setDebugData(debugStore.getFullReport())
      debugStore.logEvent('DEBUG_PANEL_MANUAL_REFRESH', {})
    }
  }

  // Filter events based on search and level
  const getFilteredEvents = () => {
    if (!debugData?.events) return []
    
    let filtered = debugData.events
    
    // Filter by level
    if (filterLevel !== 'all') {
      filtered = filtered.filter((event: any) => {
        if (filterLevel === 'errors') return event.type.includes('ERROR')
        if (filterLevel === 'warnings') return event.type.includes('WARNING')
        if (filterLevel === 'timeout') return event.type.includes('TIMEOUT')
        if (filterLevel === 'sse') return event.type.includes('SSE')
        if (filterLevel === 'automation') return event.type.includes('AUTOMATION') || event.type.includes('STATUS') || event.type.includes('DASHBOARD')
        return true
      })
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((event: any) => 
        event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        JSON.stringify(event.data).toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return filtered.slice(-100) // Show last 100 events
  }

  const getEventTypeColor = (type: string) => {
    if (type.includes('ERROR')) return 'bg-red-500'
    if (type.includes('WARNING')) return 'bg-yellow-500'
    if (type.includes('TIMEOUT')) return 'bg-orange-500'
    if (type.includes('SSE')) return 'bg-blue-500'
    if (type.includes('AUTOMATION')) return 'bg-green-500'
    if (type.includes('NETWORK')) return 'bg-purple-500'
    return 'bg-gray-500'
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const exportCurrentView = () => {
    const data = {
      tab: activeTab,
      searchQuery,
      filterLevel,
      data: debugData,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `debug-${activeTab}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isVisible || !debugStore.isDebugEnabled()) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-[9999] backdrop-blur-sm"
    >
      <div className="absolute inset-4 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-700 bg-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-white font-semibold text-lg">Debug Panel</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  className="flex-1"
                >
                  🔄 Refresh
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={autoRefresh ? 'bg-green-600' : ''}
                >
                  {autoRefresh ? '⏸️' : '▶️'}
                </Button>
              </div>
            </div>
            
            <nav className="flex-1 p-2">
              {[
                { id: 'events', label: 'Events', icon: '📝', count: debugData?.events?.length || 0 },
                { id: 'network', label: 'Network', icon: '🌐', count: debugData?.networkCalls?.length || 0 },
                { id: 'state', label: 'State', icon: '🔄', count: debugData?.stateHistory?.length || 0 },
                { id: 'performance', label: 'Performance', icon: '⚡', count: debugData?.performance?.memoryUsage?.length || 0 },
                { id: 'timeline', label: 'Timeline', icon: '⏱️', count: 0 },
                { id: 'summary', label: 'Summary', icon: '📊', count: 0 },
                { id: 'export', label: 'Export', icon: '📤', count: 0 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3 rounded mb-1 transition-colors flex items-center justify-between ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span>{tab.icon} {tab.label}</span>
                  {tab.count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
            
            <div className="p-4 border-t border-gray-700">
              <div className="text-xs text-gray-400 space-y-1">
                <div>Session: {debugData?.sessionId?.slice(-8)}</div>
                <div>Events: {debugData?.summary?.totalEvents || 0}</div>
                <div>Errors: {debugData?.summary?.errorCount || 0}</div>
                <div>Timeouts: {debugData?.summary?.timeoutCount || 0}</div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Header with controls */}
            <div className="p-4 border-b border-gray-700 bg-gray-800">
              <div className="flex gap-4 items-center">
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
                
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="all">All Events</option>
                  <option value="errors">Errors Only</option>
                  <option value="warnings">Warnings</option>
                  <option value="timeout">Timeout Events</option>
                  <option value="sse">SSE Events</option>
                  <option value="automation">Automation</option>
                </select>
                
                <Button variant="outline" size="sm" onClick={exportCurrentView}>
                  📤 Export
                </Button>
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
              <Tabs value={activeTab} className="h-full">
                <TabsContent value="events" className="h-full">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-2">
                      {getFilteredEvents().map((event: any) => (
                        <div
                          key={event.id}
                          className="bg-gray-800 border border-gray-700 rounded p-3 text-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${getEventTypeColor(event.type)} text-white text-xs`}>
                              {event.type}
                            </Badge>
                            <span className="text-gray-400 text-xs">
                              {formatTimestamp(event.timestamp)}
                            </span>
                          </div>
                          <pre className="text-gray-300 text-xs overflow-x-auto">
                            {JSON.stringify(event.data, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="network" className="h-full">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-2">
                      {debugData?.networkCalls?.slice(-50).map((call: any, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-800 border border-gray-700 rounded p-3 text-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={call.success ? 'bg-green-500' : 'bg-red-500'}>
                              {call.method}
                            </Badge>
                            <span className="text-gray-400 text-xs">
                              {call.status} • {call.duration}ms
                            </span>
                          </div>
                          <div className="text-gray-300 text-xs mb-1">{call.url}</div>
                          <div className="text-gray-400 text-xs">
                            {formatTimestamp(call.timestamp)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="state" className="h-full">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-2">
                      {debugData?.stateHistory?.slice(-30).map((state: any, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-800 border border-gray-700 rounded p-3 text-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{state.component}</Badge>
                            <span className="text-gray-400 text-xs">
                              {formatTimestamp(state.timestamp)}
                            </span>
                          </div>
                          <div className="text-gray-300 text-xs mb-1">
                            Reason: {state.reason}
                          </div>
                          <details className="text-gray-400 text-xs">
                            <summary className="cursor-pointer">State Changes</summary>
                            <pre className="mt-2 overflow-x-auto">
                              {JSON.stringify({ old: state.oldState, new: state.newState }, null, 2)}
                            </pre>
                          </details>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="performance" className="h-full">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      <div className="bg-gray-800 border border-gray-700 rounded p-4">
                        <h3 className="text-white font-semibold mb-2">Memory Usage</h3>
                        <div className="space-y-2">
                          {debugData?.performance?.memoryUsage?.slice(-10).map((memory: any, index: number) => (
                            <div key={index} className="text-sm">
                              <div className="flex justify-between text-gray-300">
                                <span>{formatTimestamp(memory.timestamp)}</span>
                                <span>{Math.round(memory.used / 1024 / 1024)}MB used</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 border border-gray-700 rounded p-4">
                        <h3 className="text-white font-semibold mb-2">Long Tasks</h3>
                        <div className="space-y-2">
                          {debugData?.performance?.longTasks?.slice(-10).map((task: any, index: number) => (
                            <div key={index} className="text-sm text-gray-300">
                              <div className="flex justify-between">
                                <span>{task.name}</span>
                                <span>{Math.round(task.duration)}ms</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="timeline" className="h-full">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-2">
                      {debugData?.events?.slice(-20).map((event: any) => (
                        <div key={event.id} className="flex items-center gap-4 py-2 border-b border-gray-700">
                          <div className="text-xs text-gray-400 w-20">
                            {formatTimestamp(event.timestamp)}
                          </div>
                          <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                          <div className="flex-1">
                            <div className="text-sm text-white">{event.type}</div>
                            <div className="text-xs text-gray-400 truncate">
                              {JSON.stringify(event.data).substring(0, 100)}...
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="summary" className="h-full">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800 border border-gray-700 rounded p-4">
                          <h3 className="text-white font-semibold mb-2">Session Info</h3>
                          <div className="space-y-1 text-sm text-gray-300">
                            <div>ID: {debugData?.sessionId}</div>
                            <div>Browser: {debugData?.browser?.userAgent?.split(' ')[0]}</div>
                            <div>URL: {debugData?.browser?.url}</div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 border border-gray-700 rounded p-4">
                          <h3 className="text-white font-semibold mb-2">Counters</h3>
                          <div className="space-y-1 text-sm text-gray-300">
                            <div>Total Events: {debugData?.summary?.totalEvents}</div>
                            <div>Network Calls: {debugData?.summary?.totalNetworkCalls}</div>
                            <div>State Changes: {debugData?.summary?.totalStateChanges}</div>
                            <div>Errors: {debugData?.summary?.errorCount}</div>
                            <div>Timeouts: {debugData?.summary?.timeoutCount}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 border border-gray-700 rounded p-4">
                        <h3 className="text-white font-semibold mb-2">Recent Errors</h3>
                        <div className="space-y-2">
                          {debugData?.events?.filter((e: any) => e.type.includes('ERROR')).slice(-5).map((error: any) => (
                            <div key={error.id} className="text-sm">
                              <div className="text-red-400">{error.type}</div>
                              <div className="text-gray-400 text-xs">{formatTimestamp(error.timestamp)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="export" className="h-full">
                  <div className="p-4 space-y-4">
                    <div className="bg-gray-800 border border-gray-700 rounded p-4">
                      <h3 className="text-white font-semibold mb-4">Export Options</h3>
                      <div className="space-y-3">
                        <Button 
                          onClick={() => debugStore.exportReport()}
                          className="w-full justify-start"
                        >
                          📊 Export Full Debug Report
                        </Button>
                        <Button 
                          onClick={exportCurrentView}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          📋 Export Current View
                        </Button>
                        <Button 
                          onClick={() => {
                            const events = debugStore.getEvents('timeout')
                            const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `timeout-events-${Date.now()}.json`
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          ⏰ Export Timeout Events
                        </Button>
                        <Button 
                          onClick={() => debugStore.clear()}
                          variant="destructive"
                          className="w-full justify-start"
                        >
                          🗑️ Clear Debug Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
