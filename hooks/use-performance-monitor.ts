"use client"

import { useEffect } from 'react'
import { debugStore } from '@/lib/debug-store'

export const usePerformanceMonitor = () => {
  useEffect(() => {
    if (!debugStore.isDebugEnabled()) return

    // Monitor memory usage
    const memoryInterval = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        debugStore.logPerformanceMetric('memory', {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          usedMB: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          totalMB: Math.round(memory.totalJSHeapSize / 1024 / 1024)
        })
      }
    }, 5000)

    // Monitor long tasks
    let longTaskObserver: PerformanceObserver | null = null
    if ('PerformanceObserver' in window) {
      try {
        longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            debugStore.logPerformanceMetric('longTask', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
              entryType: entry.entryType
            })
            
            // Log critical long tasks
            if (entry.duration > 100) {
              debugStore.logEvent('PERFORMANCE_LONG_TASK_CRITICAL', {
                duration: entry.duration,
                name: entry.name,
                startTime: entry.startTime
              })
            }
          })
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })
      } catch (error) {
        console.warn('Long task observer not supported:', error)
      }
    }

    // Monitor navigation timing
    if ('getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation')
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0] as PerformanceNavigationTiming
        debugStore.logEvent('PERFORMANCE_NAVIGATION_TIMING', {
          domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
          loadComplete: nav.loadEventEnd - nav.loadEventStart,
          domInteractive: nav.domInteractive - nav.navigationStart,
          firstPaint: nav.domContentLoadedEventStart - nav.navigationStart,
          totalLoadTime: nav.loadEventEnd - nav.navigationStart
        })
      }
    }

    // Monitor resource timing for critical resources
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resource = entry as PerformanceResourceTiming
        
        // Only log slow resources or errors
        if (resource.duration > 1000 || resource.transferSize === 0) {
          debugStore.logEvent('PERFORMANCE_SLOW_RESOURCE', {
            name: resource.name,
            duration: resource.duration,
            transferSize: resource.transferSize,
            initiatorType: resource.initiatorType,
            responseStart: resource.responseStart,
            responseEnd: resource.responseEnd
          })
        }
      })
    })
    
    try {
      resourceObserver.observe({ entryTypes: ['resource'] })
    } catch (error) {
      console.warn('Resource observer not supported:', error)
    }

    // Monitor paint timing
    const paintObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        debugStore.logEvent('PERFORMANCE_PAINT_TIMING', {
          name: entry.name,
          startTime: entry.startTime,
          duration: entry.duration
        })
      })
    })
    
    try {
      paintObserver.observe({ entryTypes: ['paint'] })
    } catch (error) {
      console.warn('Paint observer not supported:', error)
    }

    // Monitor layout shifts (CLS)
    const layoutShiftObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const layoutShift = entry as any
        if (layoutShift.value > 0.1) { // Only log significant shifts
          debugStore.logEvent('PERFORMANCE_LAYOUT_SHIFT', {
            value: layoutShift.value,
            startTime: entry.startTime,
            hadRecentInput: layoutShift.hadRecentInput,
            sources: layoutShift.sources?.map((source: any) => ({
              node: source.node?.tagName,
              currentRect: source.currentRect,
              previousRect: source.previousRect
            }))
          })
        }
      })
    })
    
    try {
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (error) {
      console.warn('Layout shift observer not supported:', error)
    }

    // Monitor first input delay (FID)
    const firstInputObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const firstInput = entry as any
        debugStore.logEvent('PERFORMANCE_FIRST_INPUT_DELAY', {
          processingStart: firstInput.processingStart,
          startTime: entry.startTime,
          duration: entry.duration,
          delay: firstInput.processingStart - entry.startTime
        })
      })
    })
    
    try {
      firstInputObserver.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      console.warn('First input observer not supported:', error)
    }

    // Monitor largest contentful paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const lcp = entry as any
        debugStore.logEvent('PERFORMANCE_LARGEST_CONTENTFUL_PAINT', {
          startTime: entry.startTime,
          renderTime: lcp.renderTime,
          loadTime: lcp.loadTime,
          size: lcp.size,
          element: lcp.element?.tagName,
          url: lcp.url
        })
      })
    })
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      console.warn('LCP observer not supported:', error)
    }

    // Cleanup function
    return () => {
      clearInterval(memoryInterval)
      
      if (longTaskObserver) {
        longTaskObserver.disconnect()
      }
      
      resourceObserver.disconnect()
      paintObserver.disconnect()
      layoutShiftObserver.disconnect()
      firstInputObserver.disconnect()
      lcpObserver.disconnect()
    }
  }, [])

  // Return performance utilities
  return {
    measureRender: (componentName: string) => {
      const startTime = performance.now()
      return () => {
        const endTime = performance.now()
        const duration = endTime - startTime
        debugStore.logPerformanceMetric('render', {
          component: componentName,
          duration,
          startTime,
          endTime
        })
        
        if (duration > 16) { // Longer than one frame
          debugStore.logEvent('PERFORMANCE_SLOW_RENDER', {
            component: componentName,
            duration,
            threshold: 16
          })
        }
      }
    },
    
    measureFunction: (functionName: string, fn: () => any) => {
      const startTime = performance.now()
      const result = fn()
      const endTime = performance.now()
      const duration = endTime - startTime
      
      debugStore.logEvent('PERFORMANCE_FUNCTION_TIMING', {
        function: functionName,
        duration,
        startTime,
        endTime
      })
      
      return result
    },
    
    markEvent: (eventName: string, data?: any) => {
      performance.mark(eventName)
      debugStore.logEvent('PERFORMANCE_MARK', {
        mark: eventName,
        timestamp: performance.now(),
        data
      })
    }
  }
}
