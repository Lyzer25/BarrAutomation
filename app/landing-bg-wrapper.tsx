"use client"

import React from "react"
import dynamic from "next/dynamic"

// Dynamically import PixelBlast to avoid SSR issues (WebGL/window access)
const PixelBlast = dynamic(() => import("@/components/ui/PixelBlast"), { ssr: false })

type LandingBackgroundWrapperProps = {
  children: React.ReactNode
}

export function LandingBackgroundWrapper({ children }: LandingBackgroundWrapperProps) {
  return (
    <div className="relative w-full min-h-screen">
      <div className="relative z-0">{children}</div>
    </div>
  )
}
