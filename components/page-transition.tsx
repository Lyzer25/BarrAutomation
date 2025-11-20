"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayPath, setDisplayPath] = useState(pathname)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (pathname !== displayPath) {
      setIsAnimating(true)

      // Scroll to top immediately
      window.scrollTo(0, 0)

      // Update displayed path after zoom out completes
      const timeout = setTimeout(() => {
        setDisplayPath(pathname)
        setIsAnimating(false)
      }, 400) // Half of total animation (zoom out phase)

      return () => clearTimeout(timeout)
    }
  }, [pathname, displayPath])

  return (
    <motion.div
      key={displayPath}
      initial={false}
      animate={{
        scale: isAnimating ? 0 : 1,
        opacity: isAnimating ? 0 : 1,
      }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{
        transformOrigin: "center center",
      }}
    >
      {children}
    </motion.div>
  )
}
